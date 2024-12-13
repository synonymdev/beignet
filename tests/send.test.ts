import BitcoinJsonRpc from 'bitcoin-json-rpc';
import { expect } from 'chai';
import net from 'net';
import tls from 'tls';

import {
	EAddressType,
	EAvailableNetworks,
	EProtocol,
	generateMnemonic,
	validateTransaction,
	Wallet
} from '../';
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

describe('Send', async function () {
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

		const res = await Wallet.create({
			mnemonic: generateMnemonic(),
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
		await wallet?.stop();
	});

	it('one input - one output transaction, no RBF', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const wAddress = r.value.addressIndex.address;
		await rpc.sendToAddress(wAddress, '0.1');
		await rpc.generateToAddress(3, await rpc.getNewAddress());
		await waitForElectrum();
		await wallet.refreshWallet();

		const address = await rpc.getNewAddress();

		const sendRes = await wallet.send({
			address,
			amount: 10000, // amount in sats
			satsPerByte: 1
		});
		if (sendRes.isErr()) throw sendRes.error;
		const txid = sendRes.value;

		await wallet.refreshWallet({});
		expect(wallet.data.transactions).to.have.property(txid);
		const tx = wallet.data.transactions[txid];
		// expect(tx.fee).to.equal(0.00000256);
		expect(tx.type).to.equal('sent');
		// expect(tx.value).to.equal(-0.00010256);
		expect(tx.txid).to.equal(txid);
		expect(tx.rbf).to.equal(false);
	});

	it('one input - one output transaction, with RBF', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const wAddress = r.value.addressIndex.address;
		await rpc.sendToAddress(wAddress, '0.1');
		await rpc.generateToAddress(3, await rpc.getNewAddress());
		await waitForElectrum();
		await wallet.refreshWallet();

		const address = await rpc.getNewAddress();

		const sendRes = await wallet.send({
			address,
			amount: 10000, // amount in sats
			satsPerByte: 10,
			rbf: true
		});
		if (sendRes.isErr()) throw sendRes.error;
		const txid = sendRes.value;

		await wallet.refreshWallet({});
		expect(wallet.data.transactions).to.have.property(txid);
		const tx = wallet.data.transactions[txid];
		// expect(tx.fee).to.equal(0.0000166);
		expect(tx.type).to.equal('sent');
		// expect(tx.value).to.equal(-0.0001166);
		expect(tx.txid).to.equal(txid);
		expect(tx.rbf).to.equal(true);
	});

	it('two inputs - two outputs, both inputs should be used', async () => {
		const [a1, a2] = Object.values(wallet.data.addresses.p2wpkh).map(
			(v) => v.address
		);
		await rpc.sendToAddress(a1, '0.0001');
		await rpc.sendToAddress(a2, '0.0001');
		await rpc.generateToAddress(3, await rpc.getNewAddress());
		await waitForElectrum();
		await wallet.refreshWallet();

		const resetRes = await wallet.resetSendTransaction();
		if (resetRes.isErr()) throw resetRes.error;
		const setupRes = await wallet.setupTransaction({});
		if (setupRes.isErr()) throw setupRes.error;
		const updateRes = wallet.transaction.updateSendTransaction({
			transaction: {
				outputs: [
					{
						index: 0,
						address: await rpc.getNewAddress(),
						value: 6000
					},
					{
						index: 1,
						address: await rpc.getNewAddress(),
						value: 6000
					}
				]
			}
		});
		if (updateRes.isErr()) throw updateRes.error;

		const validateRes = validateTransaction(wallet.transaction.data);
		if (validateRes.isErr()) throw validateRes.error;
		const createRes = await wallet.transaction.createTransaction();
		if (createRes.isErr()) throw createRes.error;
		const broadcastRes = await wallet.electrum.broadcastTransaction({
			rawTx: createRes.value.hex
		});
		const txid = createRes.value.id;
		if (broadcastRes.isErr()) throw broadcastRes.error;

		await rpc.generateToAddress(3, await rpc.getNewAddress());
		await wallet.refreshWallet({});
		expect(wallet.data.transactions).to.have.property(txid);

		// TODO: check tx inputs and outputs
	});

	it.only('two inputs - two outputs, only one input should be used', async () => {
		const [a1, a2] = Object.values(wallet.data.addresses.p2wpkh).map(
			(v) => v.address
		);
		await rpc.sendToAddress(a1, '0.0001');
		await rpc.sendToAddress(a2, '0.0001');
		await rpc.generateToAddress(3, await rpc.getNewAddress());
		await waitForElectrum();
		await wallet.refreshWallet();

		const resetRes = await wallet.resetSendTransaction();
		if (resetRes.isErr()) throw resetRes.error;
		const setupRes = await wallet.setupTransaction({});
		if (setupRes.isErr()) throw setupRes.error;
		const updateRes = wallet.transaction.updateSendTransaction({
			transaction: {
				outputs: [
					{
						index: 0,
						address: await rpc.getNewAddress(),
						value: 500
					},
					{
						index: 1,
						address: await rpc.getNewAddress(),
						value: 500
					}
				]
			}
		});
		if (updateRes.isErr()) throw updateRes.error;
		const feeRes = wallet.transaction.updateFee({ satsPerByte: 1 });
		if (feeRes.isErr()) throw feeRes.error;
		const validateRes = validateTransaction(wallet.transaction.data);
		if (validateRes.isErr()) throw validateRes.error;
		const createRes = await wallet.transaction.createTransaction();
		if (createRes.isErr()) throw createRes.error;
		const broadcastRes = await wallet.electrum.broadcastTransaction({
			rawTx: createRes.value.hex
		});
		const txid = createRes.value.id;
		if (broadcastRes.isErr()) throw broadcastRes.error;

		await rpc.generateToAddress(3, await rpc.getNewAddress());
		await wallet.refreshWallet({});
		expect(wallet.data.transactions).to.have.property(txid);

		const txRes = await wallet.electrum.getTransactions({
			txHashes: [{ tx_hash: txid }]
		});
		if (txRes.isErr()) throw txRes.error;
		const txData = txRes.value.data[0].result;
		expect(txData.vin.length).to.equal(1);
	});

	it('should fail to send with insufficient balance', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const address = r.value.addressIndex.address;

		const sendRes = await wallet.send({
			address,
			amount: 1000000000,
			satsPerByte: 1
		});
		expect(sendRes.isErr()).to.be.true;
	});
});
