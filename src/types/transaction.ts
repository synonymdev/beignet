import { IOutput, ISendTransaction, IUtxo, IVin, IVout } from './wallet';
import { BIP32Interface } from 'bip32';
import { Psbt } from 'bitcoinjs-lib';
import { Result } from '../utils';
import { ECPairInterface } from 'ecpair';

export interface ICreateTransaction {
	transactionData?: ISendTransaction;
	shuffleOutputs?: boolean;
}

export interface IAddInput {
	psbt: Psbt;
	keyPair: BIP32Interface | ECPairInterface;
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
	satsPerByte?: number; // Used to specify the fee rate in sats per vbyte
	outputs?: IOutput[]; // Used to pre-specify outputs to use
}

export enum EFeeId {
	fast = 'fast',
	normal = 'normal',
	slow = 'slow',
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

export type TGapLimitOptions = {
	lookAhead: number;
	lookBehind: number;
	lookAheadChange: number;
	lookBehindChange: number;
};
