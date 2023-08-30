import * as chai from 'chai';
import { Wallet } from '../';
import { EAvailableNetworks, EAddressType, IGetUtxosResponse } from '../src';
import { TEST_MNEMONIC } from './constants';
import { Result } from '../src';
const expect = chai.expect;

const testTimeout = 60000;

let wallet;

before(async function () {
	this.timeout(testTimeout);
	const res = await Wallet.create({
		mnemonic: TEST_MNEMONIC,
		network: EAvailableNetworks.testnet,
		walletName: 'wallet0',
		addressType: EAddressType.p2wpkh
	});
	if (res.isErr()) {
		console.log('error: ', res.error.message);
		//throw new Error(res.error.message);
		return;
	}
	wallet = res.value;
});

describe('Electrum Methods', async function (): Promise<void> {
	this.timeout(testTimeout);
	it('connectToElectrum: Should connect to a random Electrum server', async () => {
		const connectResponse = await wallet.connectToElectrum();
		expect(connectResponse.isErr()).to.equal(false);
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
		const expectedResult = {
			addressIndex: {
				address: 'tb1qy45r5c84eh7tuke772lrvj2q5kqlylp2ghgdlk',
				path: "m/84'/1'/0'/0/1",
				publicKey:
					'03f8c98bf09b3e069714a05a530a735761453d94d1f4355239bfcb6b78c25a2592',
				index: 1,
				scriptHash:
					'bdb8f18267b816706378c2c9282e0be7b05dcc5a3e63dd2468f145c6431f2002'
			},
			lastUsedAddressIndex: {
				address: 'tb1qmja98kkd540qtesjqdanfg0ywags845vehfg66',
				path: "m/84'/1'/0'/0/0",
				publicKey:
					'02189e644b5fe9acf24374b35f01f652e011867568b6e01765cace9b7ef07809cc',
				index: 0,
				scriptHash:
					'1cc3af572e4c847a1adf7ab3658fa7ae36926088c762821930dadc60e41217c2'
			},
			changeAddressIndex: {
				address: 'tb1qlqdamfznwfnua735a8jke9ll20dl86aryvuyt9',
				path: "m/84'/1'/0'/1/0",
				publicKey:
					'034c1f4a8447bad5a722aade11d241d5fb69558968b395a5de785faf2f15adca2e',
				index: 0,
				scriptHash:
					'7f5e750ae4d8d24a86659461b8f1140243f41e28b9bcfed229930b20e3273e2a'
			},
			lastUsedChangeAddressIndex: {
				index: -1,
				path: '',
				address: '',
				scriptHash: '',
				publicKey: ''
			}
		};
		const r = await wallet.getNextAvailableAddress();
		expect(r.isErr()).to.equal(false);
		if (r.isErr()) return;
		expect(r.value).to.deep.equal(expectedResult);
	});

	it("Should return available UTXO's", async () => {
		const expectedResult = {
			utxos: [
				{
					address: 'tb1qmja98kkd540qtesjqdanfg0ywags845vehfg66',
					path: "m/84'/1'/0'/0/0",
					publicKey:
						'02189e644b5fe9acf24374b35f01f652e011867568b6e01765cace9b7ef07809cc',
					index: 0,
					scriptHash:
						'1cc3af572e4c847a1adf7ab3658fa7ae36926088c762821930dadc60e41217c2',
					tx_hash:
						'e12dec55bd19c709ed5cc3213aab814315fd9716afc99dfe914b9190fdcb8452',
					tx_pos: 1,
					height: 2472352,
					value: 1000
				}
			],
			balance: 1000
		};

		const getUtxosRes: Result<IGetUtxosResponse> = await wallet.getUtxos({});
		expect(getUtxosRes.isErr()).to.equal(false);
		if (getUtxosRes.isErr()) return;
		expect(Array.isArray(getUtxosRes.value.utxos)).to.equal(true);
		expect(getUtxosRes.value.utxos.length).to.equal(1);
		expect(getUtxosRes.value.balance).to.equal(1000);
		expect(getUtxosRes.value).to.deep.equal(expectedResult);
	});
});
