import { expect } from 'chai';
import net from 'net';
import tls from 'tls';

import { Wallet } from '../';
import { servers } from '../example/helpers';
import {
	EAddressType,
	EAvailableNetworks,
	IGetUtxosResponse,
	Result
} from '../src';
import { TEST_MNEMONIC } from './constants';
import { EXPECTED_SHARED_RESULTS } from './expected-results';

const testTimeout = 60000;

let wallet: Wallet;

describe('Electrum Methods', async function (): Promise<void> {
	this.timeout(testTimeout);

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
		if (res.isErr()) throw res.error;
		wallet = res.value;
		await wallet.refreshWallet({});
	});

	after(async function () {
		await wallet?.electrum?.disconnect();
	});

	it('connectToElectrum: Should connect to a random Electrum server', async () => {
		const connectResponse = await wallet.connectToElectrum();
		if (connectResponse.isErr()) throw connectResponse.error;
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
		if (addressBalance.isErr()) throw addressBalance.error;
		expect(addressBalance.value.confirmed).to.equal(20000);
	});

	it('getNextAvailableAddress: Should return the next available address/change index and the last used address/change index', async () => {
		const r = await wallet.getNextAvailableAddress();
		if (r.isErr()) throw r.error;
		expect(r.value).to.deep.equal(
			EXPECTED_SHARED_RESULTS.getNextAvailableAddress
		);
	});

	it("Should return available UTXO's", async () => {
		const getUtxosRes: Result<IGetUtxosResponse> = await wallet.getUtxos({});
		if (getUtxosRes.isErr()) throw getUtxosRes.error;
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
