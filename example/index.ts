import { EAvailableNetworks, generateMnemonic, Wallet } from '../src';
import { getData, onMessage, servers, setData } from './helpers';
import * as repl from 'repl';

const mnemonic = generateMnemonic();

const network: EAvailableNetworks = EAvailableNetworks.mainnet;

const runExample = async (): Promise<void> => {
	// Create Wallet
	const createWalletResponse = await Wallet.create({
		mnemonic,
		onMessage,
		network,
		storage: {
			getData,
			setData
		},
		electrumOptions: {
			servers: servers[network]
		}
	});
	if (createWalletResponse.isErr()) return;
	const wallet = createWalletResponse.value;

	// Get the wallet's balance.
	const balance = wallet.getBalance();
	console.log('\nBalance: ', balance);

	// Get a receiving address.
	const address = await wallet.getAddress();
	console.log('\nAddress:', address);

	// Get fee information to perform a transaction.
	// const feeInfo = wallet.getFeeInfo({ satsPerByte: 5 });
	// if (feeInfo.isErr()) return;
	// console.log('\nFee Info:', feeInfo.value);

	// Get fee estimate in sats for a given satsPerByte to perform a transaction.
	// This is useful for quickly calculating how many sats are needed to perform a transaction when using a slider.
	// const txFeeInSats = getTxFee({
	// 	satsPerByte: 5,
	// 	transactionByteCount: feeInfo.value.transactionByteCount
	// });
	// console.log('\nFee In Sats:', txFeeInSats);

	// Create a transaction.
	// const sendRes = await wallet.send({
	// 	address,
	// 	amount: 5000,
	// 	satsPerByte: 5,
	// 	broadcast: false // Mostly set to false for testing, but can also be used to return the raw transaction hex.
	// });
	// if (sendRes.isErr()) return;
	// console.log('\nSend Res:', sendRes.value);

	// Decode the transaction to verify prior to broadcasting.
	// const decodeRes = decodeRawTransaction(sendRes.value, network);
	// if (decodeRes.isErr()) return;
	// console.log('\nDecode Transaction:');
	// console.dir(decodeRes.value, { depth: null });

	// Broadcast the transaction.
	// const broadcastRes = await wallet.electrum.broadcastTransaction({
	// 	rawTx: createRes.value.hex
	// });
	// console.log('\nBroadcast Response:', broadcastRes);
	// if (broadcastRes.isErr()) return;

	const r = repl.start('> ');
	r.context.wallet = wallet;
};

runExample().then();
