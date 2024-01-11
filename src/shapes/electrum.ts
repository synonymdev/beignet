import { TMessageKeys } from '../types';

export const onMessageKeys: { [K in TMessageKeys]: K } = {
	newBlock: 'newBlock',
	transactionReceived: 'transactionReceived',
	transactionConfirmed: 'transactionConfirmed',
	transactionSent: 'transactionSent',
	rbf: 'rbf',
	reorg: 'reorg',
	connectedToElectrum: 'connectedToElectrum'
};

export const POLLING_INTERVAL = 1000 * 10;
