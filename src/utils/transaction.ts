import * as bitcoin from 'bitcoinjs-lib';
import { Psbt } from 'bitcoinjs-lib';
import { Result, ok, err } from './result';
import {
	EAvailableNetworks,
	IOutput,
	TGetByteCountInput,
	TGetByteCountInputs,
	TGetByteCountOutput,
	TGetByteCountOutputs
} from '../types';
import { objectKeys } from './wallet';
import validate, { getAddressInfo } from 'bitcoin-address-validation';
import * as bip21 from 'bip21';
import { TRANSACTION_DEFAULTS } from '../wallet/constants';
import { validateAddress } from './helpers';

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
	} catch (e) {}
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
					sats: Number((amount * 100000000).toFixed(0)),
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
 * @returns {TGetByteCountInputs | TGetByteCountOutputs}y
 */
export const constructByteCountParam = (
	addresses: string[]
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
	@returns {number}
*/
export const getByteCount = (
	inputs: TGetByteCountInputs,
	outputs: TGetByteCountOutputs,
	message?: string
): number => {
	try {
		// Base transaction weight
		let totalWeight = 40;
		let hasWitness = false;

		const types: {
			inputs: {
				[key in TGetByteCountInput]: number;
			};
			multiSigInputs: {
				'MULTISIG-P2SH': number;
				'MULTISIG-P2WSH': number;
				'MULTISIG-P2SH-P2WSH': number;
			};
			outputs: {
				[key in TGetByteCountOutput]: number;
			};
		} = {
			inputs: {
				P2WPKH: 108 + 41 * 4,
				p2wpkh: 108 + 41 * 4 + 1,
				P2PKH: 148 * 4,
				p2pkh: 148 * 4 + 1,
				P2SH: 108 + 64 * 4,
				p2sh: 108 + 64 * 4 + 1,
				'P2SH-P2WPKH': 108 + 64 * 4,
				P2TR: 57.5 * 4,
				p2tr: 57.5 * 4 + 1
			},
			multiSigInputs: {
				'MULTISIG-P2SH': 49 * 4,
				'MULTISIG-P2WSH': 6 + 41 * 4,
				'MULTISIG-P2SH-P2WSH': 6 + 76 * 4
			},
			outputs: {
				P2SH: 32 * 4,
				P2PKH: 34 * 4,
				P2WPKH: 31 * 4,
				P2WSH: 43 * 4,
				p2wpkh: 31 * 4 + 1,
				p2sh: 32 * 4 + 1,
				p2pkh: 34 * 4 + 1,
				P2TR: 43 * 4,
				p2tr: 43 * 4 + 1
			}
		};

		const checkUInt53 = (n: number): void => {
			if (n < 0 || n > Number.MAX_SAFE_INTEGER || n % 1 !== 0) {
				throw new RangeError('value out of range');
			}
		};

		const inputKeys = objectKeys(inputs);
		inputKeys.forEach(function (key) {
			const input = inputs[key]!;
			checkUInt53(input);
			const addressTypeCount = input || 1;
			if (key.slice(0, 8) === 'MULTISIG') {
				// ex. "MULTISIG-P2SH:2-3" would mean 2 of 3 P2SH MULTISIG
				const keyParts = key.split(':');
				if (keyParts.length !== 2) {
					throw new Error('invalid input: ' + key);
				}
				const newKey = keyParts[0];
				const mAndN = keyParts[1].split('-').map((item) => parseInt(item, 10));

				totalWeight += types.multiSigInputs[newKey] * addressTypeCount;
				const multiplyer = newKey === 'MULTISIG-P2SH' ? 4 : 1;
				totalWeight +=
					(73 * mAndN[0] + 34 * mAndN[1]) * multiplyer * addressTypeCount;
			} else {
				totalWeight += types.inputs[key] * addressTypeCount;
			}
			if (['p2sh', 'P2SH', 'P2SH-P2WPKH', 'p2wpkh', 'P2WPKH'].includes(key)) {
				hasWitness = true;
			}
		});

		const outputKeys = objectKeys(outputs);
		outputKeys.forEach(function (key) {
			const output = outputs[key]!;
			checkUInt53(output);
			totalWeight += types.outputs[key] * output;
		});

		if (hasWitness) {
			totalWeight += 2;
		}

		if (message?.length) {
			// Multiply by 2 to help ensure Electrum servers will broadcast the tx.
			totalWeight += message.length * 2;
		}

		// Convert from Weight Units to virtual size
		return Math.ceil(totalWeight / 4);
	} catch (e) {
		return TRANSACTION_DEFAULTS.recommendedBaseFee;
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
