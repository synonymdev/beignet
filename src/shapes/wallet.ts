import {
	IAddresses,
	TAddressTypeContent,
	IHeader,
	TAddressTypes,
	IOnchainFees
} from '../types';
import cloneDeep from 'lodash.clonedeep';
import {
	EBoostType,
	IAddress,
	ISendTransaction,
	IWalletData,
	EAddressType
} from '../types';
import { EFeeId } from '../types';

export const addressTypes: Readonly<TAddressTypes> = {
	[EAddressType.p2wpkh]: {
		type: EAddressType.p2wpkh,
		path: "m/84'/0'/0'/0/0",
		name: 'Native Segwit Bech32',
		shortName: 'Native Segwit',
		description: 'Pay-to-witness-public-key-hash',
		example: '(bc1x...)'
	},
	[EAddressType.p2sh]: {
		type: EAddressType.p2sh,
		path: "m/49'/0'/0'/0/0",
		name: 'Nested Segwit',
		shortName: 'Segwit',
		description: 'Pay-to-Script-Hash',
		example: '(3x...)'
	},
	[EAddressType.p2pkh]: {
		type: EAddressType.p2pkh,
		path: "m/44'/0'/0'/0/0",
		name: 'Legacy',
		shortName: 'Legacy',
		description: 'Pay-to-public-key-hash',
		example: '(1x...)'
	}
};

export const defaultAddressContent: Readonly<IAddress> = {
	index: -1,
	path: '',
	address: '',
	scriptHash: '',
	publicKey: ''
};

export const defaultSendTransaction: ISendTransaction = {
	outputs: [],
	inputs: [],
	changeAddress: '',
	fiatAmount: 0,
	fee: 512,
	satsPerByte: 2,
	message: '',
	label: '',
	rbf: false,
	boostType: EBoostType.cpfp,
	minFee: 1,
	max: false,
	tags: [],
	lightningInvoice: ''
};

export const getDefaultSendTransaction = (): ISendTransaction => {
	return cloneDeep(defaultSendTransaction);
};

export const getAddressTypeContent = <T>(
	data: T
): Readonly<TAddressTypeContent<T>> => {
	const addressTypeKeys = Object.values(EAddressType);
	const content = {} as TAddressTypeContent<T>;

	addressTypeKeys.forEach((addressType) => {
		content[addressType] = data;
	});

	return cloneDeep(content);
};

export const getDefaultHeader = (): IHeader => {
	return cloneDeep({
		height: 0,
		hash: '',
		hex: ''
	});
};

export const defaultWalletData: Readonly<IWalletData> = {
	id: '',
	addressType: EAddressType.p2wpkh,
	header: getDefaultHeader(),
	addresses: getAddressTypeContent<IAddresses>({}),
	changeAddresses: getAddressTypeContent<IAddresses>({}),
	addressIndex: getAddressTypeContent<IAddress>(defaultAddressContent),
	changeAddressIndex: getAddressTypeContent<IAddress>(defaultAddressContent),
	lastUsedAddressIndex: getAddressTypeContent<IAddress>(defaultAddressContent),
	lastUsedChangeAddressIndex: getAddressTypeContent<IAddress>(
		defaultAddressContent
	),
	utxos: [],
	blacklistedUtxos: [],
	unconfirmedTransactions: {},
	transactions: {},
	boostedTransactions: {},
	transaction: getDefaultSendTransaction(),
	balance: 0,
	selectedFeeId: EFeeId.normal
};

export const defaultFeesShape: IOnchainFees = {
	//On-chain fees in sats/vbyte
	fast: 4, // 10-20 mins
	normal: 3, // 20-60 mins
	slow: 2, // 1-2 hrs
	minimum: 1,
	timestamp: Date.now() - 60 * 30 * 1000 - 1
};
