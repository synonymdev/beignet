import BitcoinJsonRpc from 'bitcoin-json-rpc';
import { expect } from 'chai';
import net from 'net';
import tls from 'tls';

import {
	EAddressType,
	EAvailableNetworks,
	EProtocol,
	generateMnemonic,
	sleep,
	Wallet
} from '../src';
import {
	bitcoinURL,
	electrumHost,
	electrumPort,
	initWaitForElectrumToSync,
	MessageListener,
	TWaitForElectrum
} from './utils';

const testTimeout = 60000;
let wallet: Wallet;
let waitForElectrum: TWaitForElectrum;
const rpc = new BitcoinJsonRpc(bitcoinURL);
const ml = new MessageListener();

describe('Receive', async function () {
	this.timeout(testTimeout);

	beforeEach(async function () {
		this.timeout(testTimeout);
		ml.clear();

		// Ensure sufficient balance in regtest
		let balance = await rpc.getBalance();
		const address = await rpc.getNewAddress();
		await rpc.generateToAddress(1, address);

		while (balance < 10) {
			await rpc.generateToAddress(10, address);
			balance = await rpc.getBalance();
		}

		waitForElectrum = await initWaitForElectrumToSync(
			{ host: electrumHost, port: electrumPort },
			bitcoinURL
		);

		await waitForElectrum();

		const mnemonic = generateMnemonic();

		const res = await Wallet.create({
			mnemonic,
			network: EAvailableNetworks.regtest,
			addressType: EAddressType.p2wpkh,
			electrumOptions: {
				servers: [
					{
						host: '127.0.0.1',
						ssl: 60002,
						tcp: 60001,
						protocol: EProtocol.tcp
					}
				],
				net,
				tls
			},
			// reduce gap limit to speed up tests
			gapLimitOptions: {
				lookAhead: 2,
				lookBehind: 2,
				lookAheadChange: 2,
				lookBehindChange: 2
			},
			addressTypesToMonitor: [EAddressType.p2wpkh],
			onMessage: ml.onMessage
		});
		if (res.isErr()) throw res.error;
		wallet = res.value;
		await wallet.refreshWallet({});
	});

	afterEach(async function () {
		await wallet?.electrum?.disconnect();
	});

	it('Should generate new receiving address', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const address = r.value.addressIndex.address;
		expect(address).to.be.a('string');
		expect(address).to.match(/^bcrt1/); // Regtest bech32 prefix
	});

	it('Should receive funds and update balance', async () => {
		expect(wallet.data.balance).to.equal(0);

		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const address = r.value.addressIndex.address;
		expect(address).to.be.a('string');
		expect(address).to.match(/^bcrt1/); // Regtest bech32 prefix

		const amount = 0.1;
		const amountSats = amount * 10e7;
		await rpc.sendToAddress(address, amount.toString());

		await rpc.generateToAddress(1, await rpc.getNewAddress());
		await waitForElectrum();

		await wallet.refreshWallet({});
		expect(wallet.getBalance()).to.equal(amountSats);
		expect(wallet.balance).to.equal(amountSats);
		expect(wallet.utxos.length).to.equal(1);
	});

	it('Should track multiple receiving addresses', async () => {
		const r1 = await wallet.getNextAvailableAddress();
		if (r1.isErr()) throw r1.error;
		const address1 = r1.value.addressIndex.address;
		const r2 = await wallet.getNextAvailableAddress();
		if (r2.isErr()) throw r2.error;
		const address2 = r2.value.addressIndex.address;

		// Without any transactions addresses should match
		expect(address1).to.equal(address2);

		// Send funds, get new address
		await rpc.sendToAddress(address1, '0.1');
		await rpc.generateToAddress(1, await rpc.getNewAddress());
		await waitForElectrum();
		const r3 = await wallet.getNextAvailableAddress();
		if (r3.isErr()) throw r3.error;
		const address3 = r3.value.addressIndex.address;

		// After a transaction, addresses should differ
		expect(address1).to.not.equal(address3);

		// Second transaction
		const receivePromise = ml.waitFor('transactionReceived');
		await rpc.sendToAddress(address3, '0.2');
		await receivePromise;

		// unfortinately it is possible that Electrum server still does not
		// have second transaction parsed so we need to wait a bit
		while (wallet.data.utxos.length === 1) {
			await sleep(100);
			await wallet.refreshWallet();
		}

		// Check balances
		expect(wallet.balance).to.equal(0.3 * 10e7); // 0.3 BTC in sats

		// Test getAddressBalance
		const balance1 = await wallet.getAddressBalance(address1);
		if (balance1.isErr()) throw balance1.error;
		expect(balance1.value.confirmed).to.equal(0.1 * 10e7);
		const balance3 = await wallet.getAddressBalance(address3);
		if (balance3.isErr()) throw balance3.error;
		expect(balance3.value.unconfirmed).to.equal(0.2 * 10e7);

		// Test getAddressesBalance
		const combinedBalance = await wallet.getAddressesBalance([
			address1,
			address3
		]);
		if (combinedBalance.isErr()) throw combinedBalance.error;
		expect(combinedBalance.value).to.equal(0.3 * 10e7);
	});

	it('Should handle unconfirmed transactions', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const address = r.value.addressIndex.address;

		await rpc.sendToAddress(address, '0.1');
		await waitForElectrum();

		// Refresh wallet and check unconfirmed transactions
		await wallet.refreshWallet({});
		expect(Object.keys(wallet.data.unconfirmedTransactions)).to.have.length(1);
		expect(Object.keys(wallet.data.transactions)).to.have.length(1);

		// Generate blocks to confirm transaction
		await rpc.generateToAddress(10, await rpc.getNewAddress());
		await waitForElectrum();

		// Refresh and check confirmed status
		await wallet.refreshWallet({});
		expect(Object.keys(wallet.data.unconfirmedTransactions)).to.have.length(0);
		expect(Object.keys(wallet.data.transactions)).to.have.length(1);
	});

	it('Should receive transaction and emit correct messages', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const address = r.value.addressIndex.address;

		// test transactionReceived message
		const receivePromise = ml.waitFor('transactionReceived');
		const amount = 0.1;
		await rpc.sendToAddress(address, amount.toString());
		const txReceivedMessage = await receivePromise;
		expect(txReceivedMessage.transaction.value).to.equal(0.1);

		// test transactionConfirmed message
		const confirmedPromise = ml.waitFor('transactionConfirmed');
		await rpc.generateToAddress(1, await rpc.getNewAddress());
		await waitForElectrum();
		const txConfirmedMessage = await confirmedPromise;
		expect(txConfirmedMessage.transaction.height).to.be.greaterThan(0);
	});
});
