import BitcoinJsonRpc from 'bitcoin-json-rpc';
import { expect } from 'chai';
import net from 'net';
import tls from 'tls';

import {
	EAddressType,
	EAvailableNetworks,
	EBoostType,
	EProtocol,
	generateMnemonic,
	Wallet
} from '../src';
import {
	bitcoinURL,
	electrumHost,
	electrumPort,
	initWaitForElectrumToSync,
	TWaitForElectrum
} from './utils';

const testTimeout = 60000;
let wallet: Wallet;
let waitForElectrum: TWaitForElectrum;
const rpc = new BitcoinJsonRpc(bitcoinURL);
const failure = { canBoost: false, rbf: false, cpfp: false };

describe('Boost', async function () {
	this.timeout(testTimeout);

	beforeEach(async function () {
		this.timeout(testTimeout);

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
			rbf: true,
			mnemonic,
			// mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
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
			}
		});
		if (res.isErr()) {
			throw res.error;
		}
		wallet = res.value;
		await wallet.refreshWallet({});
	});

	afterEach(async function () {
		await wallet?.electrum?.disconnect();
	});

	it('Should fail in some cases.', async () => {
		// tx not found
		const b1 = wallet.canBoost('fake-txid');
		expect(b1).to.deep.equal(failure);

		// balance is 0
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const a1 = r.value.addressIndex.address;
		await rpc.sendToAddress(a1, '1');
		await rpc.generateToAddress(1, await rpc.getNewAddress());
		await waitForElectrum();
		await wallet.refreshWallet({});
		expect(wallet.data.balance).to.equal(100000000);
		const s1 = await wallet.send({
			address: 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk',
			amount: 99999743,
			satsPerByte: 1
		});
		if (s1.isErr()) throw s1.error;
		await wallet.refreshWallet({});
		expect(wallet.data.balance).to.be.below(256);
		const b2 = wallet.canBoost(s1.value);
		expect(b2).to.deep.equal(failure);

		// tx is already confirmed
		await rpc.sendToAddress(a1, '1');
		await rpc.generateToAddress(1, await rpc.getNewAddress());
		await waitForElectrum();
		await wallet.refreshWallet({});
		const s2 = await wallet.send({
			address: 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk',
			amount: 10000000
		});
		if (s2.isErr()) throw s2.error;
		await rpc.generateToAddress(1, await rpc.getNewAddress()); // confirm tx
		await wallet.refreshWallet({});
		const b3 = wallet.canBoost(s2.value);
		expect(b3).to.deep.equal(failure);
	});

	it('Should generate CPFP for send transaction', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const a1 = r.value.addressIndex.address;
		await rpc.sendToAddress(a1, '1');
		await rpc.generateToAddress(1, await rpc.getNewAddress());

		await waitForElectrum();
		await wallet.refreshWallet({});
		expect(wallet.data.balance).to.equal(100000000);

		const s1 = await wallet.send({
			address: 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk',
			amount: 10000000,
			satsPerByte: 1,
			rbf: false
		});
		if (s1.isErr()) throw s1.error;
		const oldTxId = s1.value;
		await wallet.refreshWallet({});
		const b1 = wallet.canBoost(oldTxId);
		expect(b1).to.deep.equal({ canBoost: true, rbf: false, cpfp: true });

		const setup = await wallet.transaction.setupCpfp({ txid: oldTxId });
		if (setup.isErr()) throw setup.error;
		expect(setup.value.inputs.length).to.equal(1);
		expect(setup.value.outputs.length).to.equal(1);
		expect(setup.value.boostType).to.equal(EBoostType.cpfp);
		expect(setup.value.minFee).to.be.above(1);
		expect(setup.value.max).to.equal(true);
		// with parent tx at 1 sat/vbyte, and high fee at 4, child tx fee should be around 8
		expect(setup.value.satsPerByte).to.be.above(6);

		const createRes = await wallet.transaction.createTransaction();
		if (createRes.isErr()) throw createRes.error;
		const newTxId = createRes.value.id;
		wallet.electrum.broadcastTransaction({ rawTx: createRes.value.hex });

		const addBoost = await wallet.addBoostedTransaction({
			oldTxId,
			newTxId,
			type: EBoostType.cpfp,
			fee: setup.value.fee
		});
		if (addBoost.isErr()) throw addBoost.error;
		const boosted = wallet.getBoostedTransactions();
		expect(boosted).to.deep.equal({
			[oldTxId]: {
				parentTransactions: [oldTxId],
				childTransaction: newTxId,
				type: EBoostType.cpfp,
				fee: setup.value.fee
			}
		});

		await wallet.refreshWallet({});
		expect(Object.keys(wallet.transactions).length).to.equal(3);

		// FIXME: Broadcasted tx fee and setup fee should be the same
		// expect(wallet.transactions[newTxId].satsPerByte).to.equal(
		// 	setup.value.satsPerByte
		// );
	});

	it('Should generate RBF for send transaction', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		const a1 = r.value.addressIndex.address;
		await rpc.sendToAddress(a1, '0.0001'); // 10000 sats
		await rpc.generateToAddress(1, await rpc.getNewAddress());

		await waitForElectrum();
		const r1 = await wallet.refreshWallet({});
		if (r1.isErr()) throw r1.error;
		expect(wallet.data.balance).to.equal(10000);

		// create and send original transaction
		const s1 = await wallet.send({
			address: 'bcrt1q6rz28mcfaxtmd6v789l9rrlrusdprr9pz3cppk',
			amount: 1000,
			satsPerByte: 1,
			rbf: true
		});
		if (s1.isErr()) throw s1.error;
		const oldTxId = s1.value;
		const r2 = await wallet.refreshWallet({});
		if (r2.isErr()) throw r2.error;
		const b1 = wallet.canBoost(oldTxId);
		expect(b1).to.deep.equal({ canBoost: true, rbf: true, cpfp: true });

		// replace original transaction using RBF
		const setup = await wallet.transaction.setupRbf({ txid: oldTxId });
		if (setup.isErr()) throw setup.error;
		expect(setup.value.boostType).to.equal(EBoostType.rbf);
		expect(setup.value.minFee).to.be.above(1);
		const createRes = await wallet.transaction.createTransaction();
		if (createRes.isErr()) throw createRes.error;
		const newTxId = createRes.value.id;
		const broadcastResp = await wallet.electrum.broadcastTransaction({
			rawTx: createRes.value.hex
		});
		if (broadcastResp.isErr()) throw broadcastResp.error;

		const addBoost = await wallet.addBoostedTransaction({
			oldTxId,
			newTxId,
			type: EBoostType.rbf,
			fee: setup.value.fee
		});
		if (addBoost.isErr()) throw addBoost.error;
		const boosted = wallet.getBoostedTransactions();
		expect(boosted).to.deep.equal({
			[oldTxId]: {
				parentTransactions: [oldTxId],
				childTransaction: newTxId,
				type: EBoostType.rbf,
				fee: setup.value.fee
			}
		});

		const r3 = await wallet.refreshWallet({});
		if (r3.isErr()) throw r3.error;

		expect(Object.keys(wallet.transactions).length).to.equal(2);
		expect(wallet.transactions).not.to.have.property(oldTxId);
		expect(wallet.transactions).to.have.property(newTxId);
	});
});
