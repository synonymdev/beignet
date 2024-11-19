import * as chai from 'chai';
import net from 'net';
import tls from 'tls';

import { Wallet } from '../';
import { EAvailableNetworks, EAddressType, IGetUtxosResponse } from '../src';
import { TEST_MNEMONIC } from './constants';
import { Result } from '../src';
import { servers } from '../example/helpers';
import { EXPECTED_SHARED_RESULTS } from './expected-results';

const expect = chai.expect;

const testTimeout = 60000;

let wallet: Wallet;

before(async function () {
	this.timeout(testTimeout);
	const res = await Wallet.create({
		mnemonic: TEST_MNEMONIC,
		network: EAvailableNetworks.testnet,
		addressType: EAddressType.p2wpkh,
		electrumOptions: {
			servers: servers[EAvailableNetworks.testnet],
			net,
			tls
		}
	});
	if (res.isErr()) {
		console.log('error: ', res.error.message);
		//throw new Error(res.error.message);
		return;
	}
	wallet = res.value;
	await wallet.refreshWallet({});
});

describe('Electrum Methods', async function (): Promise<void> {
	this.timeout(testTimeout);
	it('connectToElectrum: Should connect to a random Electrum server', async () => {
		const connectResponse = await wallet.connectToElectrum();
		expect(connectResponse.isErr()).to.equal(false);
		if (connectResponse.isErr()) return;
		expect(connectResponse.value).to.equal('Connected to Electrum server.');
	});

	it('isConnected: Should return true if connected to an Electrum server', async () => {
		const isConnected = await wallet.electrum.isConnected();
		expect(isConnected).to.equal(true);
	});

	it('getAddressBalance: Should return the balance (in sats) of the provided address', async () => {
		const addressBalance = await wallet.getAddressBalance(
			'tb1qyvc8r7338383xjshqsz38mfn2eql879nhrf8y0'
		);
		expect(addressBalance.isErr()).to.equal(false);
		if (addressBalance.isErr()) return;
		expect(addressBalance.value.confirmed).to.equal(20000);
	});

	it('getNextAvailableAddress: Should return the next available address/change index and the last used address/change index', async () => {
		const r = await wallet.getNextAvailableAddress();
		expect(r.isErr()).to.equal(false);
		if (r.isErr()) return;
		expect(r.value).to.deep.equal(
			EXPECTED_SHARED_RESULTS.getNextAvailableAddress
		);
	});

	it("Should return available UTXO's", async () => {
		const getUtxosRes: Result<IGetUtxosResponse> = await wallet.getUtxos({});
		expect(getUtxosRes.isErr()).to.equal(false);
		if (getUtxosRes.isErr()) return;
		expect(Array.isArray(getUtxosRes.value.utxos)).to.equal(true);
		expect(getUtxosRes.value.utxos.length).to.equal(3);
		expect(getUtxosRes.value.balance).to.equal(5855);
		const sortedUtxos = getUtxosRes.value.utxos.sort((a, b) => {
			if (a.height !== b.height) {
				return a.height - b.height;
			}
			return a.index - b.index;
		});
		expect({ ...getUtxosRes.value, utxos: sortedUtxos }).to.deep.equal(
			EXPECTED_SHARED_RESULTS.getUtxos
		);
	});
});
