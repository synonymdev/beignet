import { EAddressType, EAvailableNetworks, IKeyDerivationPath } from '../types';
import { address as bitcoinJSAddress, Network, networks } from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import { availableNetworks, isValidBech32mEncodedString } from './wallet';
import { err, ok, Result } from './result';
import { addressTypes } from '../shapes';
import { getKeyDerivationPathObject } from './derivation-path';

/**
 * Get address for a given scriptPubKey.
 * @param scriptPubKey
 * @param selectedNetwork
 * @returns {string}
 */
export const getAddressFromScriptPubKey = (
	scriptPubKey: string,
	selectedNetwork: EAvailableNetworks
): string => {
	const network = networks[selectedNetwork];
	return bitcoin.address.fromOutputScript(
		Buffer.from(scriptPubKey, 'hex'),
		network
	);
};

/**
 * Get sha256 hash of a given string.
 * @param {string} str
 * @returns {string}
 */
export const getSha256 = (str: string): string => {
	const buffer = Buffer.from(str, 'utf8');
	const hash = bitcoin.crypto.sha256(buffer);
	return hash.toString('hex');
};

/**
 * Validate address for a given network.
 * If no address is provided, it will attempt to validate the address for all available networks.
 * @param {string} address
 * @param {EAvailableNetworks} network
 * @returns {{isValid: boolean, network: EAvailableNetworks}}
 */
export const validateAddress = ({
	address,
	network
}: {
	address: string;
	network?: EAvailableNetworks;
}): {
	isValid: boolean;
	network: EAvailableNetworks;
} => {
	try {
		//Validate address for all available networks
		let isValid = false;
		const availableNetworksList = availableNetworks();

		//Validate address for a specific network
		if (network !== undefined) {
			try {
				bitcoinJSAddress.toOutputScript(address, networks[network]);
				return { isValid: true, network };
			} catch {
				// In the event the normal check fails, determine if this is a taproot address.
				const taprootRes = isValidBech32mEncodedString(address);
				if (taprootRes.isValid && taprootRes.network === network) {
					return { isValid: taprootRes.isValid, network: taprootRes.network };
				}
			}
			return { isValid: false, network };
		}

		for (let i = 0; i < availableNetworksList.length; i++) {
			const validateRes = validateAddress({
				address,
				network: availableNetworksList[i]
			});
			if (validateRes.isValid) {
				isValid = validateRes.isValid;
				network = validateRes.network;
				break;
			}
		}
		return { isValid, network: network ?? EAvailableNetworks.bitcoin };
	} catch {
		return { isValid: false, network: EAvailableNetworks.bitcoin };
	}
};

/**
 * Returns the derivation path object for the specified addressType and network.
 * @param {EAddressType} addressType
 * @param {EAvailableNetworks} [selectedNetwork]
 * @returns Result<IKeyDerivationPath>
 */
export const getKeyDerivationPath = ({
	addressType,
	network
}: {
	addressType: EAddressType;
	network: EAvailableNetworks;
}): Result<IKeyDerivationPath> => {
	try {
		const keyDerivationPathResponse = getKeyDerivationPathObject({
			network,
			path: addressTypes[addressType].path
		});
		if (keyDerivationPathResponse.isErr()) {
			return err(keyDerivationPathResponse.error.message);
		}
		return ok(keyDerivationPathResponse.value);
	} catch (e) {
		return err(e);
	}
};

/**
 * Get scriptHash for a given address
 * @param {string} address
 * @param {EAvailableNetworks} network
 * @returns {string}
 */
export const getScriptHash = ({
	address,
	network
}: {
	address: string;
	network: EAvailableNetworks;
}): string => {
	try {
		const _network: Network = bitcoin.networks[network];
		const script = bitcoin.address.toOutputScript(address, _network);
		const hash = bitcoin.crypto.sha256(script);
		const reversedHash = Buffer.from(hash.reverse());
		return reversedHash.toString('hex');
	} catch {
		return '';
	}
};

/**
 * Extends bip39's generateMnemonic function.
 * @param {number} [strength]
 * @param {(size: number) => Buffer} [rng]
 * @param {string[]} [wordlist]
 * @returns {string}
 */
export const generateMnemonic = (
	strength?: number,
	rng?: (size: number) => Buffer,
	wordlist?: string[]
): string => {
	return bip39.generateMnemonic(strength, rng, wordlist);
};

/**
 * Attempts to validate the provided mnemonic.
 * @param {string} mnemonic
 * @returns {boolean}
 */
export const validateMnemonic = (mnemonic = ''): boolean => {
	try {
		return bip39.validateMnemonic(mnemonic);
	} catch {
		return false;
	}
};

/**
 * Determines if the two objects passed as params match.
 * @param obj1
 * @param obj2
 * @returns boolean
 */
export const objectsMatch = (obj1, obj2): boolean => {
	if (!obj1 || !obj2) {
		return false;
	}
	const obj1Length = Object.keys(obj1).length;
	const obj2Length = Object.keys(obj2).length;

	if (obj1Length === obj2Length) {
		return Object.keys(obj1).every(
			(key) => key in obj2 && obj2[key] === obj1[key]
		);
	} else {
		return false;
	}
};
