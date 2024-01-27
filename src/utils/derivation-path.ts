import {
	EAddressType,
	EAvailableNetworks,
	IKeyDerivationPath,
	TKeyDerivationAccount,
	TKeyDerivationChange,
	TKeyDerivationCoinType,
	TKeyDerivationPurpose
} from '../types';
import { addressTypes } from '../shapes';
import { err, ok, Result } from './result';

/**
 * Parses a key derivation path in string format Ex: "m/84'/0'/0'/0/0" and returns IKeyDerivationPath.
 * @param {string} keyDerivationPath
 * @param {TKeyDerivationPurpose | string} [purpose]
 * @param {boolean} [changeAddress]
 * @param {string} [index]
 * @param {TAvailableNetworks} [network]
 * @returns {Result<IKeyDerivationPath>}
 */
export const getKeyDerivationPathObject = ({
	path = '',
	purpose,
	changeAddress,
	index,
	network
}: {
	path: string;
	purpose?: TKeyDerivationPurpose;
	changeAddress?: boolean;
	index?: string;
	network: EAvailableNetworks;
}): Result<IKeyDerivationPath> => {
	try {
		const parsedPath = path.replace(/'/g, '').split('/');

		if (!purpose) {
			purpose = parsedPath[1] as TKeyDerivationPurpose;
		}

		let coinType = parsedPath[2] as TKeyDerivationCoinType;
		if (network) {
			coinType =
				network.toLocaleLowerCase() === EAvailableNetworks.bitcoin ? '0' : '1';
		}

		const account = parsedPath[3] as TKeyDerivationAccount;

		let change = parsedPath[4] as TKeyDerivationChange;
		if (changeAddress !== undefined) {
			change = changeAddress ? '1' : '0';
		}

		if (!index) {
			index = parsedPath[5];
		}

		return ok({
			purpose,
			coinType,
			account,
			change,
			index
		});
	} catch (e) {
		return err(e);
	}
};

/**
 * Parses a key derivation path object and returns it in string format. Ex: "m/84'/0'/0'/0/0"
 * @param {IKeyDerivationPath} path
 * @param {TKeyDerivationPurpose | string} [purpose]
 * @param {boolean} [changeAddress]
 * @param {number} [accountType]
 * @param {string} [addressIndex]
 * @returns {Result<string>}
 */
export const getKeyDerivationPathString = ({
	addressType = EAddressType.p2wpkh,
	path,
	purpose,
	accountType,
	changeAddress = false,
	index = '0',
	network
}: {
	addressType: EAddressType;
	path?: IKeyDerivationPath;
	purpose?: TKeyDerivationPurpose;
	accountType?: string | number;
	changeAddress?: boolean;
	index?: string | number;
	network: EAvailableNetworks;
}): Result<string> => {
	try {
		if (!path) {
			// Get default path object for the network and set it from there.
			const str = addressTypes[addressType].path;
			const res = getKeyDerivationPathObject({ path: str, network });
			if (res.isErr()) {
				return err(res.error.message);
			}
			path = res.value;
		}
		//Specifically specifying purpose will override the default accountType purpose value.
		if (purpose !== undefined) {
			path.purpose = purpose;
		}

		path.coinType =
			network.toLocaleLowerCase() === EAvailableNetworks.bitcoin ? '0' : '1';

		if (accountType !== undefined) {
			if (typeof accountType === 'number') {
				path.account = String(accountType);
			}
			path.account =
				typeof accountType === 'number' ? String(accountType) : accountType;
		} else {
			path.account = '0';
		}

		path.change = changeAddress ? '1' : '0';

		if (!index) {
			index = '0';
		}
		if (typeof index === 'number') {
			index = String(index);
		}

		return ok(
			`m/${path.purpose}'/${path.coinType}'/${path.account}'/${path.change}/${index}`
		);
	} catch (e) {
		return err(e);
	}
};

/**
 * Returns the address type from the specified derivation path.
 * @param {string | IKeyDerivationPath} path
 * @returns {Result<EAddressType>}
 */
export const getAddressTypeFromPath = (
	path: string | IKeyDerivationPath
): Result<EAddressType> => {
	try {
		let purpose;
		if (typeof path === 'object') {
			purpose = path.purpose;
		} else if (typeof path === 'string') {
			const parsedPathString = path.replace(/'/g, '').split('/');
			purpose = parsedPathString[1];
		}
		switch (purpose) {
			case '44':
				return ok(EAddressType.p2pkh);
			case '49':
				return ok(EAddressType.p2sh);
			case '84':
				return ok(EAddressType.p2wpkh);
			case '86':
				return ok(EAddressType.p2tr);
			default:
				return err('Invalid path');
		}
	} catch (e) {
		return err(e);
	}
};
