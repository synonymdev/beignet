import * as bitcoin from 'bitcoinjs-lib';
import { networks, Psbt } from 'bitcoinjs-lib';
import { err, ok, Result } from './result';
import {
	EAddressType,
	EAvailableNetworks,
	IOutput,
	ISendTransaction,
	TDecodeRawTx,
	TGetByteCountInputs,
	TGetByteCountOutputs
} from '../types';
import { reduceValue } from './wallet';
import validate, { getAddressInfo } from 'bitcoin-address-validation';
import * as bip21 from 'bip21';
import { TRANSACTION_DEFAULTS } from '../wallet/constants';
import { validateAddress } from './helpers';
import { btcToSats } from './conversion';

/**
 * Sets RBF for the provided psbt.
 * @param {Psbt} psbt
 * @param {boolean} setRbf
 * @returns {void}
 */
export const setReplaceByFee = ({
	psbt,
	setRbf = true
}: {
	psbt: Psbt;
	setRbf: boolean;
}): void => {
	try {
		const defaultSequence = bitcoin.Transaction.DEFAULT_SEQUENCE;
		//Cannot set replace-by-fee on transaction without inputs.
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore type for Psbt is wrong
		const ins = psbt.data.globalMap.unsignedTx.tx.ins;
		if (ins.length !== 0) {
			ins.forEach((x) => {
				if (setRbf) {
					if (x.sequence >= defaultSequence - 1) {
						x.sequence = 0;
					}
				} else {
					if (x.sequence < defaultSequence - 1) {
						x.sequence = defaultSequence;
					}
				}
			});
		}
	} catch {}
};

/*
 * Attempts to parse any given string as an on-chain payment request.
 * Returns an error if invalid.
 * @param {string} data
 * @param {EAvailableNetworks} [network]
 * @returns {Result<{address: string; network: EAvailableNetworks; sats: number; message: string;}>}
 */
export const parseOnChainPaymentRequest = (
	data: string,
	network?: EAvailableNetworks
): Result<{
	address: string;
	network: EAvailableNetworks;
	sats: number;
	message: string;
}> => {
	try {
		if (!data) {
			return err('No data provided to parseOnChainPaymentRequest.');
		}

		let validateAddressResult = validateAddress({ address: data, network });

		if (
			validateAddressResult.isValid &&
			!data.includes(':' || '?' || '&' || '//')
		) {
			return ok({
				address: data,
				network: validateAddressResult.network,
				sats: 0,
				message: ''
			});
		}

		//Determine if we need to parse any invoice data.
		if (data.includes(':' || '?' || '&' || '//')) {
			try {
				//Remove slashes
				if (data.includes('//')) {
					data = data.replace('//', '');
				}
				//bip21.decode will throw if anything other than "bitcoin" is passed to it.
				//Replace any instance of "testnet" or "litecoin" with "bitcoin"
				if (data.includes(':')) {
					data = data.substring(data.indexOf(':') + 1);
					data = `bitcoin:${data}`;
				}

				// types are wrong for package 'bip21'
				const result = bip21.decode(data) as {
					address: string;
					options: { [key: string]: string };
				};
				const address = result.address;
				validateAddressResult = validateAddress({ address, network });
				//Ensure address is valid
				if (!validateAddressResult.isValid) {
					return err(`Invalid address: ${data}`);
				}
				let amount = 0;
				let message = '';
				try {
					amount = Number(result.options.amount) || 0;
				} catch (e) {}
				try {
					message = result.options.message || '';
				} catch (e) {}
				return ok({
					address,
					network: validateAddressResult.network,
					sats: btcToSats(amount),
					message
				});
			} catch {
				return err(data);
			}
		}
		return err(data);
	} catch {
		return err(data);
	}
};

/**
 * Constructs the parameter for getByteCount via an array of addresses.
 * @param {string[]} addresses
 * @param increaseAddressCount
 * @returns {TGetByteCountInputs | TGetByteCountOutputs}y
 */
export const constructByteCountParam = (
	addresses: string[],
	increaseAddressCount: { addrType: EAddressType; count: number }[] = []
): TGetByteCountInputs | TGetByteCountOutputs => {
	try {
		if (addresses.length <= 0) {
			return { P2WPKH: 0 };
		}
		const param: TGetByteCountOutputs = {};
		addresses.map((address) => {
			if (validate(address)) {
				const addressType = getAddressInfo(address).type.toUpperCase();
				param[addressType] = param[addressType] ? param[addressType] + 1 : 1;
			}
		});
		increaseAddressCount.forEach(({ addrType, count }) => {
			param[addrType] = (param[addrType] ?? 0) + count;
		});
		return param;
	} catch {
		return { P2WPKH: 0 };
	}
};

/*
	Adapted from: https://gist.github.com/junderw/b43af3253ea5865ed52cb51c200ac19c
	Usage:
	getByteCount({'MULTISIG-P2SH:2-4':45},{'P2PKH':1}) Means "45 inputs of P2SH Multisig and 1 output of P2PKH"
	getByteCount({'P2PKH':1,'MULTISIG-P2SH:2-3':2},{'P2PKH':2}) means "1 P2PKH input and 2 Multisig P2SH (2 of 3) inputs along with 2 P2PKH outputs"
	@param {TGetByteCountInputs} inputs
	@param {TGetByteCountOutputs} outputs
	@param {string} [message]
	@param {number} [minByteCount=166] - The minimum byte count to return. Often helpful when calculating fees for a transaction that has not yet been constructed.
	@returns {number}
*/
export const getByteCount = (
	inputs: TGetByteCountInputs,
	outputs: TGetByteCountOutputs,
	message?: string,
	minByteCount = 166
): number => {
	try {
		let totalWeight = 0;
		let hasWitness = false;
		let inputCount = 0;
		let outputCount = 0;
		// assumes compressed pubkeys in all cases.
		const types = {
			// MULTISIG-* do not include pubkeys or signatures yet (this is calculated at runtime)
			// sigs = 73 and pubkeys = 34 (these include pushdata byte)
			inputs: {
				// Non-segwit: (txid:32) + (vout:4) + (sequence:4) + (script_len:3(max))
				//   + (script_bytes(OP_0,PUSHDATA(max:3),m,n,CHECK_MULTISIG):5)
				'MULTISIG-P2SH': 51 * 4,
				// Segwit: (push_count:1) + (script_bytes(OP_0,PUSHDATA(max:3),m,n,CHECK_MULTISIG):5)
				// Non-segwit: (txid:32) + (vout:4) + (sequence:4) + (script_len:1)
				'MULTISIG-P2WSH': 8 + 41 * 4,
				// Segwit: (push_count:1) + (script_bytes(OP_0,PUSHDATA(max:3),m,n,CHECK_MULTISIG):5)
				// Non-segwit: (txid:32) + (vout:4) + (sequence:4) + (script_len:1) + (p2wsh:35)
				'MULTISIG-P2SH-P2WSH': 8 + 76 * 4,
				// Non-segwit: (txid:32) + (vout:4) + (sequence:4) + (script_len:1) + (sig:73) + (pubkey:34)
				P2PKH: 148 * 4,
				// Segwit: (push_count:1) + (sig:73) + (pubkey:34)
				// Non-segwit: (txid:32) + (vout:4) + (sequence:4) + (script_len:1)
				P2WPKH: 108 + 41 * 4,
				// Segwit: (push_count:1) + (sig:73) + (pubkey:34)
				// Non-segwit: (txid:32) + (vout:4) + (sequence:4) + (script_len:1) + (p2wpkh:23)
				'P2SH-P2WPKH': 108 + 64 * 4,
				P2TR: 138 * 4
			},
			outputs: {
				// (p2sh:24) + (amount:8)
				P2SH: 32 * 4,
				// (p2pkh:26) + (amount:8)
				P2PKH: 34 * 4,
				// (p2wpkh:23) + (amount:8)
				P2WPKH: 31 * 4,
				// (p2wsh:35) + (amount:8)
				P2WSH: 43 * 4,
				P2TR: (8 + 1 + 32) * 4
			}
		};

		const checkUInt53 = (n): void => {
			if (n < 0 || n > Number.MAX_SAFE_INTEGER || n % 1 !== 0)
				throw new RangeError('value out of range');
		};

		const varIntLength = (number): number => {
			checkUInt53(number);

			return number < 0xfd
				? 1
				: number <= 0xffff
				? 3
				: number <= 0xffffffff
				? 5
				: 9;
		};

		Object.keys(inputs).forEach(function (key) {
			key = key.toUpperCase();
			checkUInt53(inputs[key]);
			if (key.slice(0, 8) === 'MULTISIG') {
				// ex. "MULTISIG-P2SH:2-3" would mean 2 of 3 P2SH MULTISIG
				const keyParts = key.split(':');
				if (keyParts.length !== 2) throw new Error('invalid input: ' + key);
				const newKey = keyParts[0];
				const mAndN = keyParts[1].split('-').map(function (item) {
					return parseInt(item);
				});

				totalWeight += types.inputs[newKey] * inputs[key];
				const multiplyer = newKey === 'MULTISIG-P2SH' ? 4 : 1;
				totalWeight +=
					(73 * mAndN[0] + 34 * mAndN[1]) * multiplyer * inputs[key];
			} else {
				totalWeight += types.inputs[key] * inputs[key];
			}
			inputCount += inputs[key];
			if (key.indexOf('W') >= 0) hasWitness = true;
		});

		Object.keys(outputs).forEach(function (key) {
			key = key.toUpperCase();
			checkUInt53(outputs[key]);
			totalWeight += types.outputs[key] * outputs[key];
			outputCount += outputs[key];
		});

		if (hasWitness) totalWeight += 2;
		if (message?.length) {
			// Multiply by 2 to help ensure Electrum servers will broadcast the tx.
			totalWeight += message.length * 2;
		}

		totalWeight += 8 * 4;
		totalWeight += varIntLength(inputCount) * 4;
		totalWeight += varIntLength(outputCount) * 4;

		const totalVsize = Math.ceil(totalWeight / 4);
		return totalVsize < minByteCount ? minByteCount : totalVsize;
	} catch {
		return minByteCount;
	}
};

/**
 * Removes outputs that are below the dust limit.
 * @param {IOutput[]} outputs
 * @returns {IOutput[]}
 */
export const removeDustOutputs = (outputs: IOutput[]): IOutput[] => {
	return outputs.filter((output) => {
		return output.value > TRANSACTION_DEFAULTS.dustLimit;
	});
};

/**
 * Used to validate transaction form data.
 * @param {ISendTransaction} transaction
 * @return {Result<string>}
 */
export const validateTransaction = (
	transaction: ISendTransaction
): Result<string> => {
	const baseFee = TRANSACTION_DEFAULTS.recommendedBaseFee;

	try {
		if (!transaction.fee) {
			return err('No transaction fee provided.');
		}
		if (transaction.outputs.length < 1 || !transaction.outputs[0].address) {
			return err('Please provide an address to send funds to.');
		}
		if (transaction.outputs.length > 0 && !transaction.outputs[0].value) {
			return err('Please provide an amount to send.');
		}
		const inputs = transaction.inputs;
		const outputs = transaction.outputs;
		for (let i = 0; i < outputs.length; i++) {
			const address = outputs[i]?.address ?? '';
			const value = outputs[i]?.value ?? 0;
			const { isValid } = validateAddress({ address });
			if (!isValid) {
				return err(`Invalid Address: ${address}`);
			}
			if (value < baseFee) {
				return err(
					`Output value for ${address} must be greater than or equal to ${baseFee} sats`
				);
			}
			if (!Number.isInteger(value)) {
				return err(`Output value for ${address} should be an integer`);
			}
		}

		const inputsReduce = reduceValue({
			arr: inputs,
			value: 'value'
		});
		if (inputsReduce.isErr()) {
			return err(inputsReduce.error.message);
		}
		//Remove the change address from the outputs array, if any.
		let filteredOutputs = outputs;
		if (transaction.changeAddress) {
			filteredOutputs = outputs.filter((output) => {
				return output.address !== transaction.changeAddress;
			});
		}
		const outputsReduce = reduceValue({
			arr: filteredOutputs,
			value: 'value'
		});
		if (outputsReduce.isErr()) {
			return err(outputsReduce.error.message);
		}

		return ok('Transaction is valid.');
	} catch (e) {
		return err(e);
	}
};

/**
 * Attempts to decode a raw tx hex.
 * Source: https://github.com/bitcoinjs/bitcoinjs-lib/issues/1606#issuecomment-664740672
 * @param {string} hex
 * @param {EAvailableNetworks} [_network]
 * @returns {Result<TDecodeRawTx>}
 */
export const decodeRawTransaction = (
	hex: string,
	_network: EAvailableNetworks
): Result<TDecodeRawTx> => {
	try {
		const network = networks[_network];
		const tx = bitcoin.Transaction.fromHex(hex);
		return ok({
			txid: tx.getId(),
			tx_hash: tx.getHash(true).toString('hex'),
			size: tx.byteLength(),
			vsize: tx.virtualSize(),
			weight: tx.weight(),
			version: tx.version,
			locktime: tx.locktime,
			vin: tx.ins.map((input) => ({
				txid: Buffer.from(input.hash).reverse().toString('hex'),
				vout: input.index,
				scriptSig: {
					asm: bitcoin.script.toASM(input.script),
					hex: input.script.toString('hex')
				},
				txinwitness: input.witness.map((b) => b.toString('hex')),
				sequence: input.sequence
			})),
			vout: tx.outs.map((output, i) => {
				let address;
				try {
					address = bitcoin.address.fromOutputScript(output.script, network);
				} catch (e) {}
				return {
					value: output.value,
					n: i,
					scriptPubKey: {
						asm: bitcoin.script.toASM(output.script),
						hex: output.script.toString('hex'),
						address
					}
				};
			})
		});
	} catch (e) {
		return err(e);
	}
};

/**
 * Quickly attempts to determine if the provided address is a valid p2tr/taproot address prefix.
 * For a more robust check, use isValidBech32mEncodedString.
 * @param {string} address
 * @returns {boolean}
 */
export const isP2trPrefix = (address: string): boolean => {
	try {
		return (
			address.startsWith('bc1p') ||
			address.startsWith('tb1p') ||
			address.startsWith('bcrt1p')
		);
	} catch {
		return false;
	}
};
