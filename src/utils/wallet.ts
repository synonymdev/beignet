import { defaultWalletData } from '../shapes';
import cloneDeep from 'lodash.clonedeep';
import {
	EAddressType,
	EAvailableNetworks,
	IAddress,
	IAddresses,
	IIndexes,
	IKeyDerivationPath,
	IKeyDerivationPathData,
	ITxHashes,
	IUtxo,
	IWalletData,
	ObjectKeys,
	TGapLimitOptions,
	TGetData,
	TKeyDerivationPurpose
} from '../types';
import { err, ok, Result } from './result';
import {
	getAddressTypeFromPath,
	getKeyDerivationPathObject,
	getKeyDerivationPathString
} from './derivation-path';
import { bech32m } from 'bech32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import {
	BITKIT_WALLET_SEED_HASH_PREFIX,
	TRANSACTION_DEFAULTS,
	WALLET_ID_PREFIX
} from '../wallet/constants';
import { getAddressIndexDiff } from './helpers';

/**
 * Returns the default wallet data object.
 * @returns {IWalletData}
 */
export const getDefaultWalletData = (): IWalletData => {
	return cloneDeep(defaultWalletData);
};

/**
 * Returns the keys from the default wallet data object.
 * @returns {(keyof IWalletData)[]}
 */
export const getDefaultWalletDataKeys = (): (keyof IWalletData)[] => {
	return Object.keys(getDefaultWalletData()) as (keyof IWalletData)[];
};

/**
 * Returns last value between hyphens in a string.
 * @param {string} key
 * @returns {string}
 */
export const getKeyValue = (key: string): string => {
	const parts = key.split('-');
	return parts[parts.length - 1];
};

/**
 * Returns the keys of a given object.
 * @type {<Type extends object>(value: Type) => Array<ObjectKeys<Type>>}
 * @param {Type} value
 * @returns {Array<ObjectKeys<Type>>}
 */
export const objectKeys = Object.keys as <Type extends object>(
	value: Type
) => Array<ObjectKeys<Type>>;

/**
 * Formats and returns the provided derivation path string and object.
 * @param {IKeyDerivationPath} path
 * @param {TKeyDerivationPurpose | string} [purpose]
 * @param {boolean} [changeAddress]
 * @param {string} [addressIndex]
 * @param {EAvailableNetworks} [network]
 * @returns {Result<{IKeyDerivationPathData}>} Derivation Path Data
 */
export const formatKeyDerivationPath = ({
	path,
	purpose,
	network,
	changeAddress = false,
	index = '0',
	addressType = EAddressType.p2wpkh
}: {
	path: IKeyDerivationPath | string;
	purpose?: TKeyDerivationPurpose;
	network: EAvailableNetworks;
	changeAddress?: boolean;
	index?: string;
	addressType?: EAddressType;
}): Result<IKeyDerivationPathData> => {
	try {
		if (typeof path === 'string') {
			const derivationPathResponse = getKeyDerivationPathObject({
				path,
				purpose,
				network,
				changeAddress,
				index
			});
			if (derivationPathResponse.isErr()) {
				return err(derivationPathResponse.error.message);
			}
			path = derivationPathResponse.value;
		}
		const pathObject = path;

		const pathStringResponse = getKeyDerivationPathString({
			addressType,
			path: pathObject,
			purpose,
			network,
			changeAddress,
			index
		});
		if (pathStringResponse.isErr()) {
			return err(pathStringResponse.error.message);
		}
		const pathString = pathStringResponse.value;
		return ok({ pathObject, pathString });
	} catch (e) {
		return err(e);
	}
};

/**
 * Returns the highest used index from the provided txHashes.
 * @param {ITxHashes[]} txHashes
 * @param {IAddresses} addresses
 * @param {IAddresses} changeAddresses
 * @param {IAddress} addressIndex
 * @param {IAddress} changeAddressIndex
 * @returns {Result<IIndexes>}
 */
export const getHighestUsedIndexFromTxHashes = ({
	txHashes,
	addresses,
	changeAddresses,
	addressIndex,
	changeAddressIndex
}: {
	txHashes: ITxHashes[];
	addresses: IAddresses;
	changeAddresses: IAddresses;
	addressIndex: IAddress;
	changeAddressIndex: IAddress;
}): Result<IIndexes> => {
	try {
		let foundAddressIndex = false;
		let foundChangeAddressIndex = false;

		txHashes = txHashes.flat();
		txHashes.forEach(({ scriptHash }) => {
			if (
				scriptHash in addresses &&
				addresses[scriptHash].index >= addressIndex.index
			) {
				foundAddressIndex = true;
				addressIndex = addresses[scriptHash];
			} else if (
				scriptHash in changeAddresses &&
				changeAddresses[scriptHash].index >= changeAddressIndex.index
			) {
				foundChangeAddressIndex = true;
				changeAddressIndex = changeAddresses[scriptHash];
			}
		});

		const data = {
			addressIndex,
			changeAddressIndex,
			foundAddressIndex,
			foundChangeAddressIndex
		};

		return ok(data);
	} catch (e) {
		return err(e);
	}
};

/**
 * Returns if the provided string is a valid Bech32m encoded string (taproot/p2tr address).
 * @param {string} address
 * @returns { isValid: boolean; network: EAvailableNetworks }
 */
export const isValidBech32mEncodedString = (
	address: string
): { isValid: boolean; network: EAvailableNetworks } => {
	try {
		const decoded = bech32m.decode(address);
		if (decoded.prefix === 'bc') {
			return { isValid: true, network: EAvailableNetworks.bitcoin };
		} else if (decoded.prefix === 'tb') {
			return { isValid: true, network: EAvailableNetworks.bitcoinTestnet };
		} else if (decoded.prefix === 'bcrt') {
			return { isValid: true, network: EAvailableNetworks.bitcoinRegtest };
		}
	} catch (error) {
		return { isValid: false, network: EAvailableNetworks.bitcoin };
	}
	return { isValid: false, network: EAvailableNetworks.bitcoin };
};

/**
 * Returns an array of all available networks from the networks object.
 * @returns {EAvailableNetworks[]}
 */
export const availableNetworks = (): EAvailableNetworks[] =>
	Object.values(EAvailableNetworks);

/**
 * Sum a specific value in an array of objects.
 * @param {T[]} arr
 * @param {keyof T} value
 * @returns {Result<number>}
 */
export const reduceValue = <T>({
	arr,
	value
}: {
	arr: T[];
	value: keyof T;
}): Result<number> => {
	try {
		if (!value) {
			return err('No value specified.');
		}
		return ok(
			arr.reduce((acc, cur) => {
				return acc + Number(cur[value]);
			}, 0) || 0
		);
	} catch (e) {
		return err(e);
	}
};

/**
 * Shuffles a given array.
 * @param {T[]} array
 * @returns {T[]}
 */
export const shuffleArray = <T>(array: T[]): T[] => {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
};

export const getDataFallback: TGetData = async <K extends keyof IWalletData>(
	key: string
): Promise<Result<IWalletData[K]>> => {
	try {
		return ok(cloneDeep(defaultWalletData[getKeyValue(key)]));
	} catch (e) {
		return ok(getDefaultWalletData()[key]);
	}
};

//Returns an array of messages from an OP_RETURN message
export const decodeOpReturnMessage = (opReturn = ''): string[] => {
	const messages: string[] = [];
	try {
		//Remove OP_RETURN from the string & trim the string.
		if (opReturn.includes('OP_RETURN')) {
			opReturn = opReturn.replace('OP_RETURN', '');
			opReturn = opReturn.trim();
		}

		const regex = /[0-9A-Fa-f]{6}/g;
		//Separate the string into an array based upon a space and insert each message into an array to be returned
		const data = opReturn.split(' ');
		data.forEach((msg) => {
			try {
				//Ensure the message is in fact a hex
				if (regex.test(msg)) {
					const message = Buffer.from(msg, 'hex').toString();
					messages.push(message);
				}
			} catch {}
		});
		return messages;
	} catch {
		return messages;
	}
};

/**
 * Returns the seed for a given mnemonic and passphrase.
 * @param {string} mnemonic
 * @param {string} bip39Passphrase
 * @returns {Buffer}
 */
export const getSeed = (mnemonic, bip39Passphrase): Buffer => {
	return bip39.mnemonicToSeedSync(mnemonic, bip39Passphrase);
};

/**
 * Returns the seed hash for a given mnemonic and passphrase.
 * @param {Buffer} seed
 * @returns {string}
 */
export const getSeedHash = (seed: Buffer): string => {
	return bitcoin.crypto
		.sha256(Buffer.concat([BITKIT_WALLET_SEED_HASH_PREFIX, seed]))
		.toString('hex');
};

export const generateWalletId = (seed: Buffer): string => {
	return bitcoin.crypto
		.sha256(Buffer.concat([WALLET_ID_PREFIX, seed]))
		.toString('hex');
};

export const getWalletDataStorageKey = (
	name: string,
	network: EAvailableNetworks,
	key: keyof IWalletData
): string => {
	return `${name}-${network}-${key}`;
};

export const getStorageKeyValues = (
	storageKey: string
): {
	walletName: string;
	network: EAvailableNetworks;
	value: keyof IWalletData;
} => {
	const [walletName, network, value] = storageKey.split('-');
	return {
		walletName,
		network: network as EAvailableNetworks,
		value: value as keyof IWalletData
	};
};

/**
 * Returns the total fee in sats for a transaction at a given size (transactionByteCount) times the desired satsPerByte.
 * @param {number} satsPerByte
 * @param {number} transactionByteCount
 * @returns {number}
 */
export const getTxFee = ({
	satsPerByte,
	transactionByteCount
}: {
	satsPerByte: number;
	transactionByteCount: number;
}): number => transactionByteCount * satsPerByte;

export const filterAddressesForGapLimit = ({
	addresses,
	index,
	gapLimitOptions,
	change
}: {
	addresses: IAddress[];
	index: number;
	gapLimitOptions: TGapLimitOptions;
	change: boolean;
}): IAddress[] => {
	const lookBehind = change
		? gapLimitOptions.lookBehindChange
		: gapLimitOptions.lookBehind;
	const lookAhead = change
		? gapLimitOptions.lookAheadChange
		: gapLimitOptions.lookAhead;

	return addresses.filter((a) => {
		if (a.index >= index) {
			return getAddressIndexDiff(index, a.index) <= lookAhead;
		}
		return getAddressIndexDiff(index, a.index) <= lookBehind;
	});
};

export const filterAddressesObjForGapLimit = ({
	addresses,
	index,
	gapLimitOptions,
	change
}: {
	addresses: IAddresses;
	index: number;
	gapLimitOptions: TGapLimitOptions;
	change: boolean;
}): IAddresses => {
	const lookBehind = change
		? gapLimitOptions.lookBehindChange
		: gapLimitOptions.lookBehind;
	const lookAhead = change
		? gapLimitOptions.lookAheadChange
		: gapLimitOptions.lookAhead;

	const response: IAddresses = {};
	Object.values(addresses).map((a) => {
		if (a.index >= index) {
			if (getAddressIndexDiff(a.index, index) <= lookAhead) {
				response[a.scriptHash] = a;
			}
		} else {
			if (getAddressIndexDiff(a.index, index) <= lookBehind) {
				response[a.scriptHash] = a;
			}
		}
	});
	return response;
};

export const filterAddressesObjForStartingIndex = ({
	addresses,
	index
}: {
	addresses: IAddresses;
	index: number;
}): IAddresses => {
	const response: IAddresses = {};
	Object.values(addresses).map((a) => {
		if (a.index >= index) response[a.scriptHash] = a;
	});
	return response;
};

export const filterAddressesObjForSingleIndex = ({
	addresses,
	addressIndex
}: {
	addresses: IAddresses;
	addressIndex: number;
}): IAddresses => {
	const response: IAddresses = {};
	Object.values(addresses).map((a) => {
		if (a.index === addressIndex) response[a.scriptHash] = a;
	});
	return response;
};

/**
 * Removes dust utxos from an array of utxos.
 * @param {IUtxo[]} utxos
 * @returns {IUtxo[]}
 */
export const removeDustUtxos = (utxos: IUtxo[]): IUtxo[] => {
	//const dustLimits = DUST_LIMITS;
	const dustLimit = TRANSACTION_DEFAULTS.dustLimit;
	return utxos.filter((utxo) => {
		const { path, value } = utxo;
		const addressType = getAddressTypeFromPath(path);
		if (addressType.isErr()) return false;
		//const dustLimit = dustLimits[addressType.value];
		return value >= dustLimit;
	});
};
