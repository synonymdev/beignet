import { TMessageKeys } from '../types';

export const onMessageKeys: { [K in TMessageKeys]: K } = {
	newBlock: 'newBlock',
	transactionReceived: 'transactionReceived',
	transactionConfirmed: 'transactionConfirmed',
	transactionSent: 'transactionSent'
};
