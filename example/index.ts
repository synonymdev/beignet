import { Wallet } from '../src';
import { onMessage } from './helpers';
import { EXAMPLE_MNEMONIC } from '../tests/constants';
import * as repl from 'repl';

const mnemonic = EXAMPLE_MNEMONIC;

const runExample = async (): Promise<void> => {
	// Create Wallet
	const createWalletResponse = await Wallet.create({
		mnemonic,
		onMessage
	});
	if (createWalletResponse.isErr()) return;
	const wallet = createWalletResponse.value;

	// Get the wallet's balance.
	const balance = wallet.getBalance();
	console.log('Balance: ', balance);

	// Get a receiving address.
	const address = await wallet.getAddress();
	console.log('Address:', address);

	const r = repl.start('> ');
	r.context.wallet = wallet;
};

runExample().then();
