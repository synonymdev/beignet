import { ISendTransaction, IUtxo } from './wallet';
import { BIP32Interface } from 'bip32';
import { Psbt } from 'bitcoinjs-lib';
import { Result } from '../utils';

export interface ICreateTransaction {
	transactionData?: ISendTransaction;
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
	fast = 'fast',
	normal = 'normal',
	slow = 'slow',
	minimum = 'minimum'
}

export type TSetupTransactionResponse = Promise<
	Result<Partial<ISendTransaction>>
>;
