import {
	EAddressType,
	EBoostType,
	EFeeId,
	IAddresses,
	IOutput,
	ISendTransaction,
	IUtxo,
	TGetTotalFeeObj
} from '../types';
import { getDefaultSendTransaction } from '../shapes';
import { Wallet } from '../wallet';
import { Result, ok, err, validateTransaction } from '../utils';
import { reduceValue, shuffleArray } from '../utils';
import { TRANSACTION_DEFAULTS } from '../wallet/constants';
import {
	constructByteCountParam,
	getByteCount,
	removeDustOutputs,
	setReplaceByFee
} from '../utils';
import {
	IAddInput,
	ICreateTransaction,
	ISetupTransaction,
	ITargets,
	TSetupTransactionResponse
} from '../types';
import { networks, Psbt } from 'bitcoinjs-lib';
import { BIP32Interface } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import { getAddressInfo } from 'bitcoin-address-validation';
import { ECPairInterface } from 'ecpair';

bitcoin.initEccLib(ecc);

export class Transaction {
	private _data: ISendTransaction;
	private readonly _wallet: Wallet;

	constructor({ wallet }: { wallet: Wallet }) {
		this._wallet = wallet;
		this._data = getDefaultSendTransaction();
	}

	public get data(): ISendTransaction {
		return this._data;
	}

	/**
	 * Sets up a transaction for a given wallet by gathering inputs, setting the next available change address as an output and sets up the baseline fee structure.
	 * This function will not override previously set transaction data. To do that you'll need to call resetSendTransaction.
	 * @param {string[]} [inputTxHashes]
	 * @param {IUtxo[]} [utxos]
	 * @param {boolean} [rbf]
	 * @param {number} [satsPerByte]
	 * @param {IUtxo[]} [outputs]
	 * @returns {Promise<Result<Partial<ISendTransaction>>>}
	 */
	public async setupTransaction({
		inputTxHashes,
		utxos,
		rbf = false,
		satsPerByte = 1,
		outputs
	}: ISetupTransaction = {}): Promise<TSetupTransactionResponse> {
		try {
			const addressType = this._wallet.data.addressType;

			const currentWallet = this._wallet.data;

			const transaction = currentWallet.transaction;

			// Gather required inputs.
			let inputs: IUtxo[] = [];
			if (inputTxHashes) {
				// If specified, filter for the desired tx_hash and push the utxo as an input.
				inputs = currentWallet.utxos.filter((utxo) => {
					return inputTxHashes.includes(utxo.tx_hash);
				});
			} else if (utxos) {
				inputs = utxos;
			} else {
				inputs = currentWallet.utxos;
			}

			if (!inputs.length) {
				// If inputs were previously selected, leave them.
				if (transaction.inputs.length > 0) {
					inputs = transaction.inputs;
				} else {
					// Otherwise, lets use our available utxo's.
					inputs = this.removeBlackListedUtxos(currentWallet.utxos);
				}
			}

			if (!inputs.length) {
				return err('No inputs specified in setupTransaction.');
			}

			const currentChangeAddresses = currentWallet.changeAddresses;

			const addressTypeKeys = Object.values(EAddressType);
			let changeAddresses: IAddresses = {};
			addressTypeKeys.forEach((key) => {
				changeAddresses = {
					...changeAddresses,
					...currentChangeAddresses[key]
				};
			});
			const changeAddressesArr = Object.values(changeAddresses).map(
				({ address }) => address
			);

			const changeAddressIndexContent =
				currentWallet.changeAddressIndex[addressType];
			// Set the current change address.
			const changeAddress = changeAddressIndexContent.address;
			if (!changeAddress) {
				return err('Unable to successfully generate a change address.');
			}

			const lightningInvoice = currentWallet.transaction?.lightningInvoice;

			outputs = outputs || currentWallet.transaction?.outputs || [];
			if (!lightningInvoice) {
				//Remove any potential change address that may have been included from a previous tx attempt.
				outputs = outputs.filter((output) => {
					if (output.address && !changeAddressesArr.includes(output.address)) {
						return output;
					}
				});
			}

			// Set the minimum fee.
			const fee = this.getTotalFee({
				satsPerByte,
				message: '',
				transaction: {
					...transaction,
					inputs,
					outputs
				}
			});

			const payload = {
				inputs,
				changeAddress,
				fee,
				outputs,
				rbf,
				satsPerByte
			};

			this._data = {
				...this._data,
				...payload
			};

			// Save the transaction data.
			await this._wallet.saveWalletData('transaction', this._data);

			return ok(payload);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * This completely resets the send transaction state.
	 * @returns {Promise<Result<string>>}
	 */
	async resetSendTransaction(): Promise<Result<string>> {
		this._data = getDefaultSendTransaction();
		await this._wallet.saveWalletData('transaction', this._data);
		return ok('Transaction reset.');
	}

	/**
	 * Removes blacklisted UTXO's from the UTXO array.
	 * @param utxos
	 */
	removeBlackListedUtxos(utxos?: IUtxo[]): IUtxo[] {
		if (!utxos) {
			utxos = this._wallet.data.utxos;
		}
		const blacklistedUtxos = this._wallet.data.blacklistedUtxos;
		return utxos.filter((utxo) => {
			return !blacklistedUtxos.find(
				(blacklistedUtxo) =>
					utxo.address === blacklistedUtxo.address &&
					utxo.height === blacklistedUtxo.height &&
					utxo.tx_hash === blacklistedUtxo.tx_hash &&
					utxo.tx_pos === blacklistedUtxo.tx_pos
			);
		});
	}

	/**
	 * Attempt to estimate the current fee for a given transaction and its UTXO's
	 * @param {number} [satsPerByte]
	 * @param {string} [message]
	 * @param {Partial<ISendTransaction>} [transaction]
	 * @param {boolean} [fundingLightning]
	 * @returns {number}
	 */
	getTotalFee = ({
		satsPerByte,
		message = '',
		transaction = this.data,
		fundingLightning = false
	}: {
		satsPerByte: number;
		message?: string;
		transaction?: Partial<ISendTransaction>;
		fundingLightning?: boolean;
	}): number => {
		const baseTransactionSize = TRANSACTION_DEFAULTS.recommendedBaseFee;
		try {
			const inputs = transaction.inputs || [];
			const outputs = transaction.outputs || [];
			const changeAddress = transaction.changeAddress;

			//Group all input & output addresses into their respective array.
			const inputAddresses = inputs.map((input) => input.address);
			const outputAddresses = outputs.map((output) => output.address);

			//No need for a change address when draining the wallet
			if (changeAddress && !transaction.max) {
				outputAddresses.push(changeAddress);
			}

			//Determine the address type of each address and construct the object for fee calculation
			const inputParam = constructByteCountParam(inputAddresses);
			const outputParam = constructByteCountParam(outputAddresses);
			//Increase P2WPKH output address by one for lightning funding calculation.
			if (fundingLightning) {
				outputParam.P2WPKH = (outputParam.P2WPKH || 0) + 1;
			}

			let transactionByteCount = getByteCount(inputParam, outputParam, message);
			if (satsPerByte < 2) {
				const minByteCount = TRANSACTION_DEFAULTS.recommendedBaseFee;
				if (transactionByteCount < minByteCount)
					transactionByteCount = minByteCount;
			}
			return transactionByteCount * satsPerByte;
		} catch {
			return baseTransactionSize * satsPerByte;
		}
	};

	/**
	 * Attempt to estimate the current fee for a given transaction and its UTXO's
	 * @param {number} [amount]
	 * @param {number} [satsPerByte]
	 * @param {string} [message]
	 * @param {Partial<ISendTransaction>} [transaction]
	 * @param {boolean} [fundingLightning]
	 * @returns {Result<TGetTotalFeeObj>}
	 */
	getTotalFeeObj = ({
		satsPerByte = this._wallet.feeEstimates.normal,
		message = '',
		transaction = this.data,
		fundingLightning = false
	}: {
		satsPerByte?: number;
		message?: string;
		transaction?: Partial<ISendTransaction>;
		fundingLightning?: boolean;
	} = {}): Result<TGetTotalFeeObj> => {
		try {
			if (!transaction.inputs?.length) {
				this.setupTransaction({});
				transaction = this.data;
			}
			const inputs = transaction.inputs || [];
			const outputs = transaction.outputs || [];
			const changeAddress = transaction.changeAddress;

			if (!inputs.length) {
				return ok({
					totalFee: 0,
					transactionByteCount: 0,
					satsPerByte: 0,
					maxSatPerByte: 0
				});
			}

			//Group all input & output addresses into their respective array.
			const inputAddresses = inputs.map((input) => input.address);
			const outputAddresses = outputs.map((output) => output.address);

			// Always assume we're sending to at least one output for a proper base calculation.
			let increaseAddressCount = 0;
			if (!outputAddresses.length) {
				increaseAddressCount++;
			}
			//No need for a change address when draining the wallet
			if (changeAddress && !transaction.max) {
				outputAddresses.push(changeAddress);
			}

			//Determine the address type of each address and construct the object for fee calculation
			const inputParam = constructByteCountParam(inputAddresses);
			const outputParam = constructByteCountParam(outputAddresses, [
				{ addrType: this._wallet.data.addressType, count: increaseAddressCount }
			]);
			//Increase P2WPKH output address by one for lightning funding calculation.
			if (fundingLightning) {
				outputParam.P2WPKH = (outputParam.P2WPKH || 0) + 1;
			}

			let transactionByteCount = getByteCount(inputParam, outputParam, message);
			if (satsPerByte < 2) {
				const minByteCount = TRANSACTION_DEFAULTS.recommendedBaseFee;
				if (transactionByteCount < minByteCount)
					transactionByteCount = minByteCount;
			}
			const inputAmount = this.getTransactionInputValue({ inputs });
			const outputAmount = this.getTransactionOutputValue({ outputs });
			// To prevent the user from spending more in fees than their output, use the output amount if available.
			const txBalance =
				outputAmount && outputAmount < inputAmount ? outputAmount : inputAmount;
			const maxSatPerByte = this.getMaxSatsPerByte({
				transactionByteCount,
				balance: txBalance
			});
			if (maxSatPerByte < satsPerByte) {
				return ok({
					totalFee: transactionByteCount * maxSatPerByte,
					transactionByteCount: maxSatPerByte ? transactionByteCount : 0,
					satsPerByte: maxSatPerByte,
					maxSatPerByte
				});
			}
			return ok({
				totalFee: transactionByteCount * satsPerByte,
				transactionByteCount,
				satsPerByte,
				maxSatPerByte
			});
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Returns the maximum sats per byte that can be used for a given transaction.
	 * @param {number} transactionByteCount
	 * @param {number} [balance]
	 * @returns {number}
	 */
	getMaxSatsPerByte = ({
		transactionByteCount,
		balance = this._wallet.getBalance()
	}: {
		transactionByteCount: number;
		balance?: number;
	}): number => {
		return Math.floor(balance / (2 * transactionByteCount));
	};

	/**
	 * Creates complete signed transaction using the transaction data store
	 * @param {ISendTransaction} [transactionData]
	 * @param {boolean} [shuffleOutputs]
	 * @returns {Promise<Result<{id: string, hex: string}>>}
	 */
	createTransaction = async ({
		transactionData = this.data,
		shuffleOutputs = true
	}: ICreateTransaction = {}): Promise<Result<{ id: string; hex: string }>> => {
		//Remove any outputs that are below the dust limit and apply them to the fee.
		removeDustOutputs(transactionData.outputs);

		const inputValue = this.getTransactionInputValue({
			inputs: transactionData.inputs
		});
		const outputValue = this.getTransactionOutputValue({
			outputs: transactionData.outputs
		});
		if (inputValue === 0) {
			const message = 'No inputs to spend.';
			return err(message);
		}
		const fee = inputValue - outputValue;

		//Refuse tx if the fee is greater than the amount we're attempting to send.
		if (fee > inputValue) {
			const message = 'Fee is larger than the intended payment.';
			return err(message);
		}

		const validateRes = validateTransaction(transactionData);
		if (validateRes.isErr()) return err(validateRes.error.message);

		try {
			const bip32InterfaceRes = await this._wallet.getBip32Interface();
			if (bip32InterfaceRes.isErr()) {
				return err(bip32InterfaceRes.error.message);
			}

			//Create PSBT before signing inputs
			const psbtRes = await this.createPsbtFromTransactionData({
				transactionData,
				bip32Interface: bip32InterfaceRes.value,
				shuffleTargets: shuffleOutputs
			});

			if (psbtRes.isErr()) {
				return err(psbtRes.error);
			}

			const psbt = psbtRes.value;

			const signedPsbtRes = await this.signPsbt({
				psbt,
				bip32Interface: bip32InterfaceRes.value
			});

			if (signedPsbtRes.isErr()) {
				return err(signedPsbtRes.error);
			}

			const tx = signedPsbtRes.value.extractTransaction();
			const id = tx.getId();
			const hex = tx.toHex();
			return ok({ id, hex });
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Returns total value of all utxos.
	 * @param {IUtxo[]} [inputs]
	 */
	getTransactionInputValue = ({ inputs }: { inputs?: IUtxo[] }): number => {
		try {
			if (!inputs) {
				const transaction = this.data;
				inputs = transaction.inputs;
			}
			if (inputs) {
				const response = reduceValue({ arr: inputs, value: 'value' });
				if (response.isOk()) {
					return response.value;
				}
			}
			return 0;
		} catch (e) {
			return 0;
		}
	};

	/**
	 * Loops through inputs and signs them
	 * @param {Psbt} psbt
	 * @param {BIP32Interface} bip32Interface
	 * @returns {Promise<Result<Psbt>>}
	 */
	signPsbt = async ({
		psbt,
		bip32Interface
	}: {
		psbt: Psbt;
		bip32Interface: BIP32Interface;
	}): Promise<Result<Psbt>> => {
		const transactionDataRes = this.data;

		const { inputs } = transactionDataRes;
		for (const [index, input] of inputs.entries()) {
			try {
				let keyPair = input?.keyPair;
				if (!keyPair && input?.path) {
					keyPair = bip32Interface.derivePath(input.path);
				}
				if (!keyPair) return err('Unable to derive keyPair.');
				psbt.signInput(index, keyPair);
			} catch (e) {
				return err(e);
			}
		}

		psbt.finalizeAllInputs();

		return ok(psbt);
	};

	/**
	 * Returns a PSBT that includes unsigned funding inputs.
	 * @param {ISendTransaction} transactionData
	 * @param {BIP32Interface} bip32Interface
	 * @param shuffleTargets
	 * @returns {Promise<Result<Psbt>>}
	 */
	createPsbtFromTransactionData = async ({
		transactionData,
		bip32Interface,
		shuffleTargets = true
	}: {
		transactionData: ISendTransaction;
		bip32Interface?: BIP32Interface;
		shuffleTargets?: boolean;
	}): Promise<Result<Psbt>> => {
		const { inputs, outputs, fee, rbf } = transactionData;
		let { changeAddress, message } = transactionData;

		//Get balance of current inputs.
		const balance = this.getTransactionInputValue({
			inputs
		});

		//Get value of current outputs.
		const outputValue = this.getTransactionOutputValue({
			outputs
		});

		const network = networks[this._wallet.network];

		//Collect all outputs.
		let targets: ITargets[] = outputs.concat();

		//Change address and amount to send back to wallet.
		if (changeAddress) {
			const changeAddressValue = balance - (outputValue + fee);
			// Ensure we're not creating unspendable dust.
			// If we have less than 2x the recommended base fee, just contribute it to the fee in this transaction.
			if (changeAddressValue > TRANSACTION_DEFAULTS.dustLimit) {
				targets.push({
					address: changeAddress,
					value: changeAddressValue,
					index: targets.length
				});
			}
			// Looks like we don't need a change address.
			// Double check we don't have any spare sats hanging around.
		} else if (outputValue + fee < balance) {
			// If we have spare sats hanging around and the difference is greater than the dust limit, generate a changeAddress to send them to.
			const diffValue = balance - (outputValue + fee);
			if (diffValue > TRANSACTION_DEFAULTS.dustLimit) {
				const changeAddressRes = await this._wallet.getChangeAddress();
				if (changeAddressRes.isErr()) {
					return err(changeAddressRes.error.message);
				}
				changeAddress = changeAddressRes.value.address;
				targets.push({
					address: changeAddress,
					value: diffValue,
					index: targets.length
				});
			}
		}

		//Embed any OP_RETURN messages.
		if (message.trim() !== '') {
			const messageLength = message.length;
			const lengthMin = 5;
			//This is a patch for the following: https://github.com/coreyphillips/moonshine/issues/52
			if (messageLength > 0 && messageLength < lengthMin) {
				message += ' '.repeat(lengthMin - messageLength);
			}
			const data = Buffer.from(message, 'utf8');
			const embed = bitcoin.payments.embed({
				data: [data],
				network
			});
			targets.push({ script: embed.output!, value: 0, index: targets.length });
		}

		if (!bip32Interface) {
			const bip32InterfaceRes = await this._wallet.getBip32Interface();
			if (bip32InterfaceRes.isErr()) {
				return err(bip32InterfaceRes.error.message);
			}
			bip32Interface = bip32InterfaceRes.value;
		}

		const root = bip32Interface;
		const psbt = new bitcoin.Psbt({ network });

		//Add Inputs from inputs array
		try {
			for (const input of inputs) {
				let keyPair = input?.keyPair;
				if (!keyPair && input?.path) {
					keyPair = root.derivePath(input.path);
				}
				if (!keyPair) {
					return err('Unable to derive keyPair.');
				}
				await this.addInput({
					psbt,
					keyPair,
					input
				});
			}
		} catch (e) {
			return err(e);
		}

		//Set RBF if supported and prompted via rbf in Settings.
		setReplaceByFee({ psbt, setRbf: !!rbf });

		// Shuffle targets if not run from unit test and add outputs.
		if (shuffleTargets) {
			targets = shuffleArray(targets);
		}

		targets.forEach((target) => {
			//Check if OP_RETURN
			let isOpReturn = false;
			try {
				isOpReturn = !!target.script;
			} catch (e) {}
			if (isOpReturn) {
				if (target.script) {
					psbt.addOutput({
						script: target.script,
						value: target.value ?? 0
					});
				}
			} else {
				if (target.address && target.value) {
					psbt.addOutput({
						address: target.address,
						value: target.value
					});
				}
			}
		});

		return ok(psbt);
	};

	addInput = async ({
		psbt,
		keyPair,
		input
	}: IAddInput): Promise<Result<string>> => {
		try {
			const network = networks[this._wallet.network];
			const { type } = getAddressInfo(input.address);

			if (!input.value) {
				return err('No input provided.');
			}

			if (input.value <= TRANSACTION_DEFAULTS.dustLimit) {
				return err('Input value is below dust limit.');
			}

			// Use the provided input keyPair if available.
			if (input?.keyPair) {
				keyPair = input.keyPair;
			}

			if (type === 'p2wpkh') {
				const p2wpkh = bitcoin.payments.p2wpkh({
					pubkey: keyPair.publicKey,
					network
				});
				if (!p2wpkh?.output) {
					return err('p2wpkh.output is undefined.');
				}
				psbt.addInput({
					hash: input.tx_hash,
					index: input.tx_pos,
					witnessUtxo: {
						script: p2wpkh.output,
						value: input.value
					}
				});
			}

			if (type === 'p2sh') {
				const p2wpkh = bitcoin.payments.p2wpkh({
					pubkey: keyPair.publicKey,
					network
				});
				const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network });
				if (!p2sh?.output) {
					return err('p2sh.output is undefined.');
				}
				if (!p2sh?.redeem) {
					return err('p2sh.redeem.output is undefined.');
				}
				psbt.addInput({
					hash: input.tx_hash,
					index: input.tx_pos,
					witnessUtxo: {
						script: p2sh.output,
						value: input.value
					},
					redeemScript: p2sh.redeem.output
				});
			}

			if (type === 'p2pkh') {
				const transaction = await this._wallet.electrum.getTransactions({
					txHashes: [{ tx_hash: input.tx_hash }]
				});
				if (transaction.isErr()) {
					return err(transaction.error.message);
				}
				const hex = transaction.value.data[0].result.hex;
				const nonWitnessUtxo = Buffer.from(hex, 'hex');
				psbt.addInput({
					hash: input.tx_hash,
					index: input.tx_pos,
					nonWitnessUtxo
				});
			}
			return ok('Success');
		} catch {
			return err('Unable to add input.');
		}
	};

	/**
	 * Adds external inputs to the current transaction.
	 * @param {IUtxo[]} inputs
	 * @param {BIP32Interface | ECPairInterface} keyPair
	 * @returns {Result<IUtxo[]>}
	 */
	public addExternalInputs({
		inputs,
		keyPair
	}: {
		inputs: IUtxo[];
		keyPair: BIP32Interface | ECPairInterface;
	}): Result<IUtxo[]> {
		if (!inputs || !inputs.length) return err('No inputs provided.');
		const transaction = this.data;
		const satsPerByte = transaction.satsPerByte;
		const newInputs = inputs.map((input) => {
			return {
				...input,
				keyPair
			};
		});
		const _inputs = [...transaction.inputs, ...newInputs];
		const feeInfo = this.getTotalFeeObj({
			satsPerByte,
			transaction: {
				...transaction,
				inputs: _inputs
			}
		});
		if (feeInfo.isErr()) return err(feeInfo.error.message);
		const feeUpdateRes = this.updateFee({
			satsPerByte,
			transaction: {
				...transaction,
				inputs: _inputs
			}
		});
		if (feeUpdateRes.isErr()) return err(feeUpdateRes.error.message);
		const updateSendRes = this.updateSendTransaction({
			transaction: {
				inputs: _inputs
			}
		});
		if (updateSendRes.isErr()) return err(updateSendRes.error.message);
		return ok(_inputs);
	}

	/**
	 * Adds an output at the specified index to the current transaction.
	 * @param {string} address
	 * @param {number} value
	 * @param {number} [index]
	 * @returns {IOutput}
	 */
	addOutput = async ({
		address,
		value,
		index = 0
	}: IOutput): Promise<Result<string>> => {
		if (value <= TRANSACTION_DEFAULTS.dustLimit) {
			return err('Output value is below dust limit.');
		}
		if (!this.data.inputs?.length) {
			const setupRes = await this.setupTransaction();
			if (setupRes.isErr()) return err(setupRes.error.message);
		}
		return this.updateSendTransaction({
			transaction: {
				outputs: [{ address, value, index }]
			}
		});
	};

	/**
	 * Returns total value of all outputs. Excludes any value that would be sent to the change address.
	 * @param {IOutput[]} [outputs]
	 * @returns {number}
	 */
	getTransactionOutputValue = ({
		outputs
	}: {
		outputs?: IOutput[];
	} = {}): number => {
		try {
			if (!outputs) {
				const transaction = this.data;
				outputs = transaction.outputs;
			}
			const response = reduceValue({ arr: outputs, value: 'value' });
			if (response.isOk()) {
				return response.value;
			}
			return 0;
		} catch {
			return 0;
		}
	};

	/**
	 * This updates the transaction state used for sending.
	 * @param {Partial<ISendTransaction>} transaction
	 * @return {Promise<Result<string>>}
	 */
	updateSendTransaction = ({
		transaction
	}: {
		transaction: Partial<ISendTransaction>;
	}): Result<string> => {
		try {
			//Add output if specified
			if (transaction.outputs) {
				const currentTransaction = this._wallet.transaction.data;
				const outputs = currentTransaction.outputs.concat();
				transaction.outputs.forEach((output) => {
					//if (output.value > TRANSACTION_DEFAULTS.dustLimit)
					outputs[output.index] = output;
				});
				transaction.outputs = outputs;
			}

			this._data = {
				...this._data,
				...transaction
			};

			this._wallet.saveWalletData('transaction', this.data).then();

			return ok('Transaction updated');
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Updates the fee for the current transaction by the specified amount.
	 * @param {number} [satsPerByte]
	 * @param {EFeeId} [selectedFeeId]
	 * @param {number} [index]
	 * @param {ISendTransaction} [transaction]
	 * @returns {Result<{ fee: number }>}
	 */
	public updateFee({
		satsPerByte,
		selectedFeeId = EFeeId.custom,
		index = 0,
		transaction = this.data
	}: {
		satsPerByte: number;
		selectedFeeId?: EFeeId;
		index?: number;
		transaction?: ISendTransaction;
	}): Result<{ fee: number }> {
		const inputTotal = this.getTransactionInputValue({
			inputs: transaction.inputs
		});

		const { max, message, outputs } = transaction;
		let address = '';
		if (outputs.length > index) {
			address = outputs[index]?.address ?? '';
		}

		const newFee = this.getTotalFee({ satsPerByte, transaction, message });

		//Return if the new fee exceeds half of the user's input balance
		if (newFee >= inputTotal / 2) {
			return err(
				'Unable to increase the fee any further. Otherwise, it will exceed half the current input balance.'
			);
		}

		const totalTransactionValue = this.getTransactionOutputValue({
			outputs
		});

		//Return if the new fee exceeds half of the user's output amount
		if (newFee >= totalTransactionValue / 2) {
			return err(
				'Unable to increase the fee any further. Otherwise, it will exceed half the current sending/output amount.'
			);
		}

		const newTotalAmount = totalTransactionValue + newFee;
		const _transaction: Partial<ISendTransaction> = {
			satsPerByte,
			fee: newFee,
			selectedFeeId
		};

		if (max) {
			// Update the tx value with the new fee to continue sending the max amount.
			_transaction.outputs = [{ address, value: inputTotal - newFee, index }];
		}

		// Check that the user has enough funds
		if (max || newTotalAmount <= inputTotal) {
			this.updateSendTransaction({
				transaction: _transaction
			});
			return ok({ fee: newFee });
		}

		return err(
			'New total amount exceeds the available balance. Unable to update the transaction fee.'
		);
	}

	/**
	 * Toggles the max amount to the provided output index.
	 * @param {string} [address] If left undefined, the current receiving address will be provided.
	 * @param {ISendTransaction} [transaction]
	 * @param {number} [index]
	 * @param satsPerByte
	 * @param rbf
	 */
	sendMax = async ({
		address,
		transaction,
		index = 0,
		satsPerByte,
		rbf = false
	}: {
		address?: string;
		transaction?: ISendTransaction;
		index?: number;
		satsPerByte?: number;
		rbf?: boolean;
	} = {}): Promise<Result<string>> => {
		try {
			if (!transaction) {
				transaction = this.data;
			}
			if (!transaction.inputs?.length) {
				const setupRes = await this.setupTransaction({ rbf });
				if (setupRes.isErr()) return err(setupRes.error.message);
			}
			const outputs = transaction.outputs ?? [];
			// No address specified, attempt to assign the address currently specified in the current output index.
			if (!address) {
				address = outputs[index]?.address ?? '';
			}

			const maxAmountResponse = this.getMaxSendAmount({
				satsPerByte: satsPerByte ?? transaction?.satsPerByte ?? 1,
				selectedFeeId: transaction.selectedFeeId,
				transaction
			});
			if (maxAmountResponse.isErr()) {
				return err(maxAmountResponse.error);
			}
			const { amount, fee } = maxAmountResponse.value;

			if (!transaction.max) {
				this.updateSendTransaction({
					transaction: {
						max: true,
						outputs: [{ address, value: amount, index }],
						fee
					}
				});
			} else {
				this.updateSendTransaction({
					transaction: {
						max: false
					}
				});
			}

			return ok('Successfully setup max send transaction.');
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Calculates the max amount able to send for onchain/lightning
	 * @param {ISendTransaction} [transaction]
	 * @param {number} [index]
	 */
	//TODO: Double check the transactionSpeed and customFeeRate are being used correctly.
	estimateTransactionCosts = ({
		transaction,
		customFeeRate
	}: {
		transaction?: ISendTransaction;
		customFeeRate?: number;
	}): Result<{ amount: number; fee: number; satsPerByte: number }> => {
		try {
			if (!transaction) {
				transaction = this.data;
			}

			const currentWallet = this._wallet.data;
			const onchainBalance = currentWallet.balance;

			const inputValue = this.getTransactionInputValue({
				inputs: transaction.inputs
			});
			const amount = onchainBalance > inputValue ? onchainBalance : inputValue;

			let utxos: IUtxo[] = [];
			//Ensure we add the larger utxo set for a more accurate fee.
			if (transaction.inputs.length > currentWallet?.utxos.length) {
				utxos = transaction.inputs;
			} else {
				utxos = currentWallet?.utxos ?? [];
			}
			const fees = this._wallet.feeEstimates;
			const selectedFeeId = this._wallet.selectedFeeId;
			const satsPerByte = customFeeRate ?? fees[selectedFeeId] ?? 1;
			const fee = this.getTotalFee({
				satsPerByte,
				message: transaction.message,
				transaction: {
					...transaction,
					max: true,
					inputs: utxos,
					selectedFeeId,
					satsPerByte
				}
			});

			if (amount <= fee) {
				return err(
					`An amount of ${amount} is too low to spend with an expected fee of ${fee} at ${satsPerByte} satsPerVByte.`
				);
			}

			const maxAmount = {
				amount: amount - fee,
				fee,
				satsPerByte
			};

			return ok(maxAmount);
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Calculates the max amount able to send for the provided/current onchain transaction.
	 * @param {number} satsPerByte
	 * @param {EFeeId} [selectedFeeId]
	 * @param {ISendTransaction} [transaction]
	 * @returns {Result<{ amount: number; fee?: number }>}
	 */
	getMaxSendAmount({
		satsPerByte,
		selectedFeeId = EFeeId.none,
		transaction = this.data
	}: {
		satsPerByte: number;
		selectedFeeId?: EFeeId;
		transaction?: ISendTransaction;
	}): Result<{ amount: number; fee: number }> {
		try {
			const inputValue = this.getTransactionInputValue({
				inputs: transaction.inputs
			});
			const amount = inputValue;

			const inputs = transaction.inputs ?? [];

			const fee = this.getTotalFee({
				satsPerByte,
				message: transaction.message,
				transaction: {
					...transaction,
					max: true,
					inputs,
					selectedFeeId,
					satsPerByte
				}
			});

			if (amount <= fee) {
				return err(
					`An amount of ${amount} is too low to spend with an expected fee of ${fee} at ${satsPerByte} satsPerVByte.`
				);
			}

			const maxAmount = {
				amount: amount - fee,
				fee
			};

			return ok(maxAmount);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Sets up a CPFP transaction.
	 * @param {string} [txid]
	 * @param {number} [satsPerByte]
	 */
	async setupCpfp({
		txid,
		satsPerByte
	}: {
		txid?: string; // txid of utxo to include in the CPFP tx. Undefined will gather all utxo's.
		satsPerByte?: number;
	}): Promise<Result<ISendTransaction>> {
		const response = await this.setupTransaction({
			inputTxHashes: txid ? [txid] : undefined,
			rbf: true
		});

		const receiveAddress = await this._wallet.getReceiveAddress({});
		if (receiveAddress.isErr()) {
			return err(receiveAddress.error.message);
		}

		this._data = {
			...this._data,
			...response,
			satsPerByte: satsPerByte ?? this.data?.satsPerByte ?? 1,
			boostType: EBoostType.cpfp
		};

		// Construct the tx to send funds back to ourselves using the assigned inputs, receive address and fee.
		const sendMaxResponse = await this.sendMax({
			address: receiveAddress.value
		});
		if (sendMaxResponse.isErr()) {
			return err(sendMaxResponse.error.message);
		}

		return ok(this.data);
	}
}
