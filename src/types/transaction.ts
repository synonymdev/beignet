import { ISendTransaction, IUtxo, IVin, IVout } from './wallet';
import { BIP32Interface } from 'bip32';
import { Psbt } from 'bitcoinjs-lib';
import { Result } from '../utils';

export interface ICreateTransaction {
	transactionData?: ISendTransaction;
	shuffleOutputs?: boolean;
}

export interface IAddInput {
	psbt: Psbt;
	keyPair: BIP32Interface;
	input: IUtxo;
}

export interface ITargets {
	value: number; // Amount denominated in sats.
	index: number; // Used to specify which output to update or edit when using updateSendTransaction.
	address?: string; // Amount denominated in sats.
	script?: Buffer;
}

export interface ISetupTransaction {
	inputTxHashes?: string[]; // Used to pre-specify inputs to use by tx_hash
	utxos?: IUtxo[]; // Used to pre-specify utxos to use
	rbf?: boolean; // Enable or disable rbf
}

export enum EFeeId {
	instant = 'instant',
	fast = 'fast',
	normal = 'normal',
	slow = 'slow',
	minimum = 'minimum',
	custom = 'custom',
	none = 'none'
}

export type TSetupTransactionResponse = Result<Partial<ISendTransaction>>;

export type TDecodeRawTx = {
	txid: string;
	tx_hash: string;
	size: number;
	vsize: number;
	weight: number;
	version: number;
	locktime: number;
	vin: IVin[];
	vout: IVout[];
};

export type TGetTotalFeeObj = {
	totalFee: number;
	transactionByteCount: number;
	satsPerByte: number;
	maxSatPerByte: number; // Max sats per byte that can be used for a given transaction without exceeding 50% of the balance.
};
