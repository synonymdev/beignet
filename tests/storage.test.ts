import * as chai from 'chai';
import { validateMnemonic } from 'bip39';
import { Wallet } from '../';
import {
	EAddressType,
	EAvailableNetworks,
	IGetUtxosResponse,
	Result,
	generateMnemonic
} from '../src';
import { TEST_MNEMONIC } from './constants';
import { getData, setData } from '../example/helpers';

const expect = chai.expect;

const testTimeout = 60000;

let wallet;

before(async function () {
	this.timeout(testTimeout);
	const res = await Wallet.create({
		mnemonic: TEST_MNEMONIC,
		network: EAvailableNetworks.testnet,
		walletName: 'wallet0',
		addressType: EAddressType.p2wpkh,
		getData,
		setData
	});
	if (res.isErr()) {
		console.log('error: ', res.error.message);
		//throw new Error(res.error.message);
		return;
	}
	wallet = res.value;
});

describe('Wallet Library', async function (): Promise<void> {
	this.timeout(testTimeout);
	it('Should successfully create a wallet.', () => {
		expect(wallet).not.to.be.null;
	});

	it('Should generate a valid, random mnemonic', () => {
		const randomMnemonic = generateMnemonic();
		expect(validateMnemonic(randomMnemonic)).to.equal(true);
	});

	it('Should determine that the wallet mnemonic is invalid', () => {
		const invalidMnemonic =
			'corn core humor loud lady wealth avoid purse next subject focus dilemma';
		const isValid = wallet.isValid(invalidMnemonic);
		expect(isValid).to.equal(false);
	});

	it('Should determine that the current wallet instance is valid', () => {
		const isValid = wallet.isValid(TEST_MNEMONIC);
		expect(isValid).to.equal(true);
	});

	it('Should generate a bech32 receiving address at index 0', async () => {
		const address = await wallet.getAddress({
			addressType: EAddressType.p2wpkh,
			changeAddress: false,
			index: '0'
		});
		expect(address).to.equal('tb1qmja98kkd540qtesjqdanfg0ywags845vehfg66');
	});

	it('Should generate a segwit change address at index 1', async () => {
		const address = await wallet.getAddress({
			addressType: EAddressType.p2sh,
			changeAddress: true,
			index: '1'
		});
		expect(address).to.equal('2NDRG1ZGhWMGGNW7Mp58BKcyBs4Hyat8Law');
	});

	it('Should generate a legacy receiving address at index 5', async () => {
		const address = await wallet.getAddress({
			addressType: EAddressType.p2pkh,
			changeAddress: false,
			index: '5'
		});
		expect(address).to.equal('mohdq3fadTtT4uSH4oNr4F1Dp3YM4pR3VF');
	});

	it('Should generate a bech32 receiving address at index 0 via its path', async () => {
		const address = await wallet.getAddressByPath({ path: "m/84'/1'/0'/0/0" });
		expect(address.isErr()).to.equal(false);
		if (address.isErr()) return;
		expect(address.value.address).to.equal(
			'tb1qmja98kkd540qtesjqdanfg0ywags845vehfg66'
		);
	});

	it('Should generate a segwit change address at index 1 via its path', async () => {
		const address = await wallet.getAddressByPath({ path: "m/49'/1'/0'/1/1" });
		expect(address.isErr()).to.equal(false);
		if (address.isErr()) return;
		expect(address.value.address).to.equal(
			'2NDRG1ZGhWMGGNW7Mp58BKcyBs4Hyat8Law'
		);
	});

	it('Should generate a testnet legacy receiving address at index 5 via its path', async () => {
		const address = await wallet.getAddressByPath({ path: "m/44'/1'/0'/0/5" });
		expect(address.isErr()).to.equal(false);
		if (address.isErr()) return;
		expect(address.value.address).to.equal(
			'mohdq3fadTtT4uSH4oNr4F1Dp3YM4pR3VF'
		);
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
