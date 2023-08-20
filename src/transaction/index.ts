import {
	EAddressType,
	IAddresses,
	IOutput,
	ISendTransaction,
	IUtxo
} from '../types';
import { getDefaultSendTransaction } from '../shapes';
import { Wallet } from '../wallet';
import { Result, ok, err } from '../utils/result';
import { reduceValue, shuffleArray } from '../utils';
import { TRANSACTION_DEFAULTS } from '../wallet/constants';
import {
	constructByteCountParam,
	getByteCount,
	removeDustOutputs,
	setReplaceByFee
} from '../utils/transaction';
import {
	IAddInput,
	ICreateTransaction,
	ISetupTransaction,
	ITargets,
	TSetupTransactionResponse
} from '../types/transaction';
import { networks, Psbt } from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import { getAddressInfo } from 'bitcoin-address-validation';

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

export class Transaction {
	public data: ISendTransaction;
	public wallet: Wallet;
	private mnemonic: string;
	private passphrase: string;

	constructor({
		wallet,
		mnemonic,
		passphrase = ''
	}: {
		wallet: Wallet;
		mnemonic: string;
		passphrase?: string;
	}) {
		this.wallet = wallet;
		this.mnemonic = mnemonic;
		this.passphrase = passphrase;
		this.data = getDefaultSendTransaction();
	}

	/**
	 * Sets up a transaction for a given wallet by gathering inputs, setting the next available change address as an output and sets up the baseline fee structure.
	 * This function will not override previously set transaction data. To do that you'll need to call resetSendTransaction.
	 * @param {string[]} [inputTxHashes]
	 * @param {IUtxo[]} [utxos]
	 * @param {boolean} [rbf]
	 * @returns {Promise<Result<Partial<ISendTransaction>>>}
	 */
	public async setupTransaction({
		inputTxHashes,
		utxos,
		rbf = false
	}: ISetupTransaction = {}): TSetupTransactionResponse {
		try {
			const addressType = this.wallet.addressType;

			const currentWallet = this.wallet.data;

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
				return err('No inputs specified.');
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
			let changeAddress = changeAddressIndexContent.address;

			if (!changeAddress || changeAddressIndexContent.index < 0) {
				// It's possible we haven't set the change address index yet. Generate one on the fly.
				const generateAddressResponse = await this.wallet.generateAddresses({
					addressAmount: 0,
					changeAddressAmount: 1,
					addressType
				});
				if (generateAddressResponse.isErr()) {
					return err(generateAddressResponse.error.message);
				}
				changeAddress =
					generateAddressResponse.value.changeAddresses[0].address;
			}
			if (!changeAddress) {
				return err('Unable to successfully generate a change address.');
			}

			// Set the minimum fee.
			const fee = this.getTotalFee({
				satsPerByte: 1,
				message: ''
			});

			let outputs = currentWallet.transaction.outputs || [];
			//Remove any potential change address that may have been included from a previous tx attempt.
			outputs = outputs.filter((output) => {
				if (output.address && !changeAddressesArr.includes(output.address)) {
					return output;
				}
			});

			const payload = {
				inputs,
				changeAddress,
				fee,
				outputs,
				rbf
			};

			this.data = {
				...this.data,
				...payload
			};

			return ok(payload);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Removes blacklisted UTXO's from the UTXO array.
	 * @param utxos
	 */
	removeBlackListedUtxos(utxos?: IUtxo[]): IUtxo[] {
		if (!utxos) {
			utxos = this.wallet.data.utxos;
		}
		const blacklistedUtxos = this.wallet.data.blacklistedUtxos;
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

	/*
	 * Attempt to estimate the current fee for a given wallet and its UTXO's
	 * */
	getTotalFee = ({
		satsPerByte = this.wallet.feeEstimates.normal,
		message = '',
		transaction = this.data,
		fundingLightning = false
	}: {
		satsPerByte?: number;
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

			const transactionByteCount = getByteCount(
				inputParam,
				outputParam,
				message
			);
			return transactionByteCount * satsPerByte;
		} catch {
			return baseTransactionSize * satsPerByte;
		}
	};

	/**
	 * Creates complete signed transaction using the transaction data store
	 * @param {ISendTransaction} [transactionData]
	 * @returns {Promise<Result<{id: string, hex: string}>>}
	 */
	createTransaction = async ({
		transactionData
	}: ICreateTransaction = {}): Promise<Result<{ id: string; hex: string }>> => {
		// If no transaction data is provided, use the stored transaction object from storage.
		if (!transactionData) {
			transactionData = this.data;
		}

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

		try {
			const bip32InterfaceRes = await this.getBip32Interface();
			if (bip32InterfaceRes.isErr()) {
				return err(bip32InterfaceRes.error.message);
			}

			//Create PSBT before signing inputs
			const psbtRes = await this.createPsbtFromTransactionData({
				transactionData,
				bip32Interface: bip32InterfaceRes.value
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
			// @ts-ignore
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
				const keyPair = bip32Interface.derivePath(input.path);
				psbt.signInput(index, keyPair);
			} catch (e) {
				// @ts-ignore
				return err(e);
			}
		}

		psbt.finalizeAllInputs();

		return ok(psbt);
	};

	/**
	 * Returns a PSBT that includes unsigned funding inputs.
	 * @param {TWalletName} selectedWallet
	 * @param {TAvailableNetworks} selectedNetwork
	 * @param {ISendTransaction} transactionData
	 * @param {BIP32Interface} bip32Interface
	 * @return {Promise<Result<Psbt>>}
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

		const network = networks[this.wallet.network];

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
				const changeAddressRes = await this.wallet.getChangeAddress();
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
			const bip32InterfaceRes = await this.getBip32Interface();
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
				const path = input.path;
				const keyPair: BIP32Interface = root.derivePath(path);
				await this.addInput({
					psbt,
					keyPair,
					input
				});
			}
		} catch (e) {
			// @ts-ignore
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
			const network = networks[this.wallet.network];
			const { type } = getAddressInfo(input.address);

			if (!input.value) {
				return err('No input provided.');
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
				const transaction = await this.wallet.electrum.getTransactions({
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
	 * Creates a BIP32Interface from the selected wallet's mnemonic and passphrase
	 * @returns {Promise<Result<BIP32Interface>>}
	 */
	getBip32Interface = async (): Promise<Result<BIP32Interface>> => {
		const network = networks[this.wallet.network];
		const bip39Passphrase = this.passphrase;
		const seed = await bip39.mnemonicToSeed(this.mnemonic, bip39Passphrase);
		const root = bip32.fromSeed(seed, network);
		return ok(root);
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
		} catch (e) {
			console.log(e);
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
				const currentTransaction = this.wallet.transaction.data;
				const outputs = currentTransaction.outputs.concat();
				transaction.outputs.forEach((output) => {
					outputs[output.index] = output;
				});
				transaction.outputs = outputs;
			}

			this.data = {
				...this.data,
				...transaction
			};

			return ok('Transaction updated');
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	};

	/**
	 * Updates the fee for the current transaction by the specified amount.
	 * @param {number} [satsPerByte]
	 * @param {number} [index]
	 * @param {ISendTransaction} [transaction]
	 */
	//TODO: Check that selectedFeeID is working correctly.
	public updateFee({
		satsPerByte,
		index = 0,
		transaction
	}: {
		satsPerByte: number;
		index?: number;
		transaction?: ISendTransaction;
	}): Result<{ fee: number }> {
		if (!transaction) {
			transaction = this.data;
		}
		const inputTotal = this.getTransactionInputValue({
			inputs: transaction.inputs
		});

		const { max, message, outputs } = transaction;
		let address = '';
		if (outputs.length > index) {
			address = outputs[index]?.address ?? '';
		}

		const newFee = this.getTotalFee({ satsPerByte, message });

		//Return if the new fee exceeds half of the user's balance
		if (newFee >= inputTotal / 2) {
			return err(
				'Unable to increase the fee any further. Otherwise, it will exceed half the current balance.'
			);
		}

		const selectedFeeId = this.wallet.transaction.data.selectedFeeId;
		const totalTransactionValue = this.getTransactionOutputValue({
			outputs
		});
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
	 * Sends the max amount to the provided output index.
	 * @param {string} [address] If left undefined, the current receiving address will be provided.
	 * @param {ISendTransaction} [transaction]
	 * @param {number} [index]
	 */
	sendMax = ({
		address,
		transaction,
		index = 0
	}: {
		address?: string;
		transaction?: Partial<ISendTransaction>;
		index?: number;
	} = {}): Result<string> => {
		try {
			if (!transaction) {
				transaction = this.data;
			}
			const outputs = transaction.outputs ?? [];
			// No address specified, attempt to assign the address currently specified in the current output index.
			if (!address) {
				address = outputs[index]?.address ?? '';
			}

			const transactionCosts = this.estimateTransactionCosts({});
			if (transactionCosts.isErr()) {
				return err(transactionCosts.error);
			}
			const { amount, fee } = transactionCosts.value;

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
			// @ts-ignore
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

			// onchain transaction
			const onchainBalance = this.wallet.data.balance;

			const inputValue = this.getTransactionInputValue({
				inputs: transaction.inputs
			});
			const amount = onchainBalance > inputValue ? onchainBalance : inputValue;

			const currentWallet = this.wallet.data;
			let utxos: IUtxo[] = [];
			//Ensure we add the larger utxo set for a more accurate fee.
			if (transaction.inputs.length > currentWallet?.utxos.length) {
				utxos = transaction.inputs;
			} else {
				utxos = currentWallet?.utxos ?? [];
			}
			const fees = this.wallet.feeEstimates;
			const selectedFeeId = transaction.selectedFeeId;
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

			const maxAmount = {
				amount: amount - fee,
				fee,
				satsPerByte
			};

			if (amount <= fee) {
				return err('Balance is too low to spend.');
			}

			return ok(maxAmount);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	};
}
