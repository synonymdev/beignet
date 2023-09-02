import { Result } from '../utils';
import {
	IHeader,
	INewBlock,
	TElectrumNetworks,
	TServer,
	TTxResult
} from './electrum';
import { EFeeId } from './transaction';
import { TLSSocket } from 'tls';
import { Server } from 'net';

export type TAvailableNetworks = 'bitcoin' | 'testnet' | 'regtest';
export type TAddressType = 'p2wpkh' | 'p2sh' | 'p2pkh';
export type TAddressLabel = 'bech32' | 'segwit' | 'legacy';
export type TKeyDerivationPurpose = '84' | '49' | '44' | string; //"p2wpkh" | "p2sh" | "p2pkh";
export type TKeyDerivationCoinType = '0' | '1' | string; //"mainnet" | "testnet";
export type TKeyDerivationAccount = '0' | string;
export type TKeyDerivationChange = '0' | '1'; //"Receiving Address" | "Change Address";
export type TKeyDerivationIndex = string;
export type TAddressTypes = {
	[key in EAddressType]: Readonly<IAddressTypeData>;
};
export enum EAvailableNetworks {
	bitcoin = 'bitcoin',
	mainnet = 'bitcoin',
	bitcoinMainnet = 'bitcoin',
	testnet = 'testnet',
	bitcoinTestnet = 'testnet',
	regtest = 'regtest',
	bitcoinRegtest = 'regtest'
}
export enum EAddressType {
	p2wpkh = 'p2wpkh',
	p2sh = 'p2sh',
	p2pkh = 'p2pkh'
	// p2wsh = 'p2wsh',
	// p2tr = 'p2tr',
}

export enum EPaymentType {
	sent = 'sent',
	received = 'received'
}

export type TAddressTypeContent<T> = {
	[key in EAddressType]: T;
};

export interface IAddressTypeData {
	type: EAddressType;
	path: string;
	name: string;
	shortName: string;
	description: string;
	example: string;
}

export interface IUtxo {
	address: string;
	index: number;
	path: string;
	scriptHash: string;
	height: number;
	tx_hash: string;
	tx_pos: number;
	value: number;
}

export interface IVin {
	scriptSig: {
		asm: string;
		hex: string;
	};
	sequence: number;
	txid: string;
	txinwitness: string[];
	vout: number;
}

export interface IFormattedTransaction {
	address: string;
	height: number;
	scriptHash: string;
	totalInputValue: number;
	matchedInputValue: number;
	totalOutputValue: number;
	matchedOutputValue: number;
	fee: number;
	satsPerByte: number;
	type: EPaymentType;
	value: number;
	txid: string;
	messages: string[];
	vin: IVin[];
	timestamp: number;
	confirmTimestamp?: number;
	exists?: boolean;
	rbf?: boolean;
}

export interface IFormattedTransactions {
	[key: string]: IFormattedTransaction;
}

export interface IOutput {
	address: string; // Address to send to.
	value: number; // Amount denominated in sats.
	index: number; // Used to specify which output to update or edit when using updateSendTransaction.
}

export enum EBoostType {
	rbf = 'rbf',
	cpfp = 'cpfp'
}

export interface ISendTransaction {
	outputs: IOutput[];
	inputs: IUtxo[];
	changeAddress: string;
	fiatAmount: number;
	fee: number; //Total fee in sats
	satsPerByte: number;
	selectedFeeId: EFeeId;
	message: string; // OP_RETURN data for a given transaction.
	label: string; // User set label for a given transaction.
	rbf: boolean;
	boostType: EBoostType;
	minFee: number; // (sats) Used for RBF/CPFP transactions where the fee needs to be greater than the original.
	max: boolean; // If the user intends to send the max amount.
	tags: string[];
	slashTagsUrl?: string;
	lightningInvoice?: string;
}

export interface IAddresses {
	[scriptHash: string]: IAddress;
}

export interface IAddress {
	index: number;
	path: string;
	address: string;
	scriptHash: string;
	publicKey: string;
}

export interface IWalletData {
	addressType: EAddressType;
	header: IHeader;
	addresses: TAddressTypeContent<IAddresses>;
	changeAddresses: TAddressTypeContent<IAddresses>;
	addressIndex: TAddressTypeContent<IAddress>;
	changeAddressIndex: TAddressTypeContent<IAddress>;
	lastUsedAddressIndex: TAddressTypeContent<IAddress>;
	lastUsedChangeAddressIndex: TAddressTypeContent<IAddress>;
	utxos: IUtxo[];
	blacklistedUtxos: IUtxo[];
	unconfirmedTransactions: IFormattedTransactions;
	transactions: IFormattedTransactions;
	boostedTransactions: IBoostedTransactions;
	transaction: ISendTransaction;
	balance: number;
	exchangeRates: IExchangeRates;
}

export type TWalletDataKeys = keyof IWalletData;

export type TGetData = <K extends keyof IWalletData>(
	key: string
) => Promise<Result<IWalletData[K]>>;
export type TSetData = <K extends keyof IWalletData>(
	key: string,
	value: IWalletData[K]
) => Promise<Result<boolean>>;

export interface IWallet {
	mnemonic: string;
	name?: string;
	passphrase?: string;
	network?: EAvailableNetworks;
	addressType?: EAddressType;
	data?: IWalletData;
	storage?: TStorage;
	electrumOptions?: {
		servers?: TServer | TServer[];
		tls?: TLSSocket;
		net?: Server;
	};
	remainOffline?: boolean;
	onMessage?: TOnMessage;
	customGetAddress?: (
		data: ICustomGetAddress
	) => Promise<Result<IGetAddressResponse>>;
	customGetScriptHash?: (data: ICustomGetScriptHash) => Promise<string>;
	rbf?: boolean;
	selectedFeeId?: EFeeId;
}

export interface IAddressData {
	path: string;
	type: 'p2wpkh' | 'p2sh' | 'p2pkh';
	label: string;
}

export interface IAddressType {
	[key: string]: IAddressData;
}

// m / purpose' / coin_type' / account' / change / index
export interface IKeyDerivationPath {
	purpose?: TKeyDerivationPurpose;
	coinType?: TKeyDerivationCoinType;
	account?: TKeyDerivationAccount;
	change?: TKeyDerivationChange;
	index?: TKeyDerivationIndex;
}

export interface IGetDerivationPath extends IKeyDerivationPath {
	addressType?: EAddressType;
}

export interface IGetAddress {
	index?: TKeyDerivationIndex;
	changeAddress?: boolean;
	addressType?: EAddressType;
}

export interface ICustomGetAddress {
	path: string;
	type: EAddressType;
	selectedNetwork?: TElectrumNetworks;
}

export interface ICustomGetScriptHash {
	address: string;
	selectedNetwork?: TElectrumNetworks;
}

export interface IGetAddressByPath {
	path: string;
	addressType?: EAddressType;
}

export interface IGetAddressBalanceRes {
	confirmed: number;
	unconfirmed: number;
}

export interface IUtxo {
	address: string;
	index: number;
	path: string;
	scriptHash: string;
	height: number;
	tx_hash: string;
	tx_pos: number;
	value: number;
}

export interface IGenerateAddresses {
	addressAmount?: number;
	changeAddressAmount?: number;
	addressIndex?: number;
	changeAddressIndex?: number;
	keyDerivationPath?: IKeyDerivationPath;
	addressType?: EAddressType;
}

export interface IKeyDerivationPathData {
	pathString: string;
	pathObject: IKeyDerivationPath;
}

export interface IGenerateAddressesResponse {
	addresses: IAddresses;
	changeAddresses: IAddresses;
}

export interface IGetAddressResponse {
	address: string;
	path: string;
	publicKey: string;
}

export interface IGetNextAvailableAddressResponse {
	addressIndex: IAddress;
	lastUsedAddressIndex: IAddress;
	changeAddressIndex: IAddress;
	lastUsedChangeAddressIndex: IAddress;
}

export interface ITxHashes extends TTxResult {
	scriptHash: string;
}

export interface IIndexes {
	addressIndex: IAddress;
	changeAddressIndex: IAddress;
	foundAddressIndex: boolean;
	foundChangeAddressIndex: boolean;
}

export interface ITxHash {
	tx_hash: string;
}

export interface IGetTransactions {
	error: boolean;
	id: number;
	method: string;
	network: string;
	data: ITransaction<IUtxo>[];
}

export interface ITransaction<T> {
	id: number;
	jsonrpc: string;
	param: string;
	data: T;
	result: {
		blockhash: string;
		confirmations: number;
		hash: string;
		hex: string;
		locktime: number;
		size: number;
		txid: string;
		version: number;
		vin: IVin[];
		vout: IVout[];
		vsize: number;
		weight: number;
		blocktime?: number;
		time?: number;
	};
}

export interface IVout {
	n: number; //0
	scriptPubKey: {
		addresses?: string[];
		address?: string;
		asm: string;
		hex: string;
		reqSigs?: number;
		type?: string;
	};
	value: number;
}

export type TProcessUnconfirmedTransactions = {
	unconfirmedTxs: IFormattedTransactions; // zero-conf transactions
	outdatedTxs: IUtxo[]; // Transactions that are no longer confirmed.
	ghostTxs: string[]; // Transactions that have been removed from the mempool.
};

export enum EUnit {
	satoshi = 'satoshi',
	BTC = 'BTC',
	fiat = 'fiat'
}

export interface IExchangeRates {
	[key: string]: {
		currencySymbol: string;
		quote: string;
		quoteName: string;
		rate: number;
		lastUpdatedAt: number;
	};
}

export type InputData = {
	[key: string]: {
		addresses: string[];
		value: number;
	};
};

export type TGetByteCountInputs = {
	[key in TGetByteCountInput]?: number;
};

export type TGetByteCountOutputs = {
	[key in TGetByteCountOutput]?: number;
};

export type TGetByteCountInput =
	| `MULTISIG-P2SH:${number}-${number}`
	| `MULTISIG-P2WSH:${number}-${number}`
	| `MULTISIG-P2SH-P2WSH:${number}-${number}`
	| 'P2SH-P2WPKH'
	| 'P2PKH'
	| 'p2pkh'
	| 'P2WPKH'
	| 'p2wpkh'
	| 'P2SH'
	| 'p2sh'
	| 'P2TR'
	| 'p2tr';

export type TGetByteCountOutput =
	| 'P2SH'
	| 'P2PKH'
	| 'P2WPKH'
	| 'P2WSH'
	| 'p2wpkh'
	| 'p2sh'
	| 'p2pkh'
	| 'P2TR'
	| 'p2tr';

export interface IGetFeeEstimatesResponse {
	fastestFee: number;
	halfHourFee: number;
	hourFee: number;
	minimumFee: number;
}

//On-chain fee estimates in sats/vbyte
export interface IFees {
	fast: number; // 10-20 mins
	normal: number; // 20-60 mins
	slow: number; // 1-2 hrs
	minimum: number;
	timestamp: number;
}

export type TMessageDataMap = {
	newBlock: INewBlock;
	transactionReceived: TTransactionMessage;
	transactionConfirmed: TTransactionMessage;
	transactionSent: TTransactionMessage;
	reorg: IUtxo[];
	rbf: string[];
};

export type TTransactionMessage = {
	address: IAddress;
	balance: IGetAddressBalanceRes;
	txs: TTxResult[];
};

// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// https://github.com/sindresorhus/ts-extras
export type ObjectKeys<T extends object> = `${Exclude<keyof T, symbol>}`;

// Define the type of the onMessage function
export type TOnMessage = <K extends keyof TMessageDataMap>(
	key: K,
	data: TMessageDataMap[K]
) => void;

export type TMessageKeys = keyof TMessageDataMap;

export interface ISendTx {
	address: string;
	amount: number;
	message?: string;
}

export interface ISend {
	txs: ISendTx | ISendTx[];
	satsPerByte?: number;
}

export type TAddressIndexInfo = {
	addressIndex: IAddress;
	changeAddressIndex: IAddress;
	lastUsedAddressIndex: IAddress;
	lastUsedChangeAddressIndex: IAddress;
};

export type TStorage = {
	getData: TGetData;
	setData: TSetData;
};

export interface IRbfData {
	outputs: IOutput[];
	balance: number;
	addressType: EAddressType;
	fee: number; // Total fee in sats.
	inputs: IUtxo[];
	message: string;
}

export interface IBoostedTransaction {
	parentTransactions: string[]; // Array of parent txids to the currently boosted transaction.
	childTransaction: string; // Child txid of the currently boosted transaction.
	type: EBoostType;
	fee: number;
}

export interface IBoostedTransactions {
	[txId: string]: IBoostedTransaction;
}
