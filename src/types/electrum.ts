import {
	EAvailableNetworks,
	IAddress,
	IGetAddressBalanceRes,
	ITransaction,
	IUtxo
} from './wallet';

export type TElectrumNetworks = 'bitcoin' | 'bitcoinTestnet' | 'bitcoinRegtest';
export enum EElectrumNetworks {
	bitcoin = 'bitcoin',
	bitcoinTestnet = 'bitcoinTestnet',
	bitcoinRegtest = 'bitcoinRegtest'
}
export type TConnectToElectrumRes = string;

export interface IElectrumGetAddressBalanceRes extends IGetAddressBalanceRes {
	error: boolean;
}

export type TServer = {
	host: string;
	ssl: number;
	tcp: number;
	protocol: EProtocol;
};
export type TProtocol = 'tcp' | 'ssl';
export enum EProtocol {
	tcp = 'tcp',
	ssl = 'ssl'
}

export enum EScanningStrategy {
	all = 'all', // Scan all addresses/scripthashes
	gapLimit = 'gapLimit', // Adhere to the gap limit within range of the provided index when scanning addresses/scripthashes. If higher than the current index, it will be ignored
	startingIndex = 'startingIndex', // Scan all addresses/scripthashes starting from the provided index. If higher than the current index, it will be ignored
	singleIndex = 'singleIndex' // Scan the single provided address/scripthash
}

export interface IGetUtxosResponse {
	utxos: IUtxo[];
	balance: number;
}

export type TUnspentAddressScriptHashData = {
	[x: string]: IUtxo | IAddress;
};

export type TTxResult = {
	tx_hash: string;
	height: number;
};

export interface IGetAddressScriptHashesHistoryResponse {
	data: TTxResponse[];
	error: boolean;
	id: number;
	method: string;
	network: string;
}

export type TTxResponse = {
	data: IAddress;
	id: number;
	jsonrpc: string;
	param: string;
	result: TTxResult[];
};

export interface IGetAddressTxResponse {
	data: TAddressTxResponse[];
	error: boolean;
	id: number;
	method: string;
	network: string;
}
export type TAddressTxResponse = {
	data: string;
	id: number;
	jsonrpc: string;
	param: string;
	result: TTxResult[];
	error?: { code: number; message: string };
};

export interface IGetAddressScriptHashBalances {
	error: boolean;
	data:
		| Array<{
				id: number;
				jsonrpc: string;
				result: {
					confirmed: number;
					unconfirmed: number;
				};
				param: string;
				data: Record<string, unknown>;
		  }>
		| string;
	id: number;
	method: string;
	network: EElectrumNetworks;
}

export interface IGetAddressHistoryResponse extends TTxResult, IAddress {}

export interface IHeader {
	height: number;
	hash: string;
	hex: string;
}

export interface INewBlock {
	height: number;
	hex: string;
}

export interface IGetHeaderResponse {
	id: number;
	error: boolean;
	method: 'getHeader';
	data: string;
	network: EAvailableNetworks;
}

export interface IGetTransactionsFromInputs {
	error: boolean;
	id: number;
	method: string;
	network: string;
	data: ITransaction<{
		tx_hash: string;
		vout: number;
	}>[];
}

export interface ISubscribeToHeader {
	data: {
		height: number;
		hex: string;
	};
	error: boolean;
	id: string;
	method: string;
}

export interface ISubscribeToAddress {
	data: {
		id: number;
		jsonrpc: string;
		result: null;
	};
	error: boolean;
	id: number;
	method: string;
}

export type TSubscribedReceive = [string, string];

export interface IFormattedPeerData {
	ip?: string;
	host: string;
	version?: string;
	ssl: string | number;
	tcp: string | number;
}

export interface IPeerData {
	host: string;
	port: string;
	protocol: TProtocol;
}

export type ElectrumConnectionPubSub = {
	publish: (isConnected: boolean) => void;
	subscribe: (
		callback: (isConnected: boolean) => void
	) => ElectrumConnectionSubscription;
};

export type ElectrumConnectionSubscription = {
	remove(): void;
};

export type TGetAddressHistory = { txid: string; height: number };

export type TUnspentAddressScriptHash = {
	height: number;
	tx_hash: string;
	tx_pos: number;
	value: number;
};

export type TUnspentAddressScriptHashResult = {
	id: number;
	jsonrpc: string;
	result: TUnspentAddressScriptHash[];
	param: string;
	data: IAddress;
};

export type TUnspentAddressScriptHashResponse = {
	id: number;
	error: boolean;
	method: string;
	data: TUnspentAddressScriptHashResult[];
	network: string;
};
