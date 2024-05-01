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
import { deleteDirectory, getData, servers, setData } from '../example/helpers';
import { EXPECTED_SHARED_RESULTS } from './expected-results';

const expect = chai.expect;

const testTimeout = 60000;

let wallet;
const WALLET_NAME = 'storagetestwallet0';

before(async function () {
	this.timeout(testTimeout);
	await deleteDirectory('example/walletData'); // Start test with clean slate.
	const res = await Wallet.create({
		mnemonic: TEST_MNEMONIC,
		network: EAvailableNetworks.testnet,
		name: WALLET_NAME,
		addressType: EAddressType.p2wpkh,
		storage: {
			getData,
			setData
		},
		electrumOptions: {
			servers: servers[EAvailableNetworks.testnet]
		}
	});
	if (res.isErr()) {
		console.log('error: ', res.error.message);
		//throw new Error(res.error.message);
		return;
	}
	wallet = res.value;
});

describe('Storage Test', async function (): Promise<void> {
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

	// it('Attempts to create a new wallet using the same name of an existing wallet in storage.', async () => {
	// 	const createRes = await Wallet.create({
	// 		mnemonic: generateMnemonic(),
	// 		network: EAvailableNetworks.testnet,
	// 		name: WALLET_NAME,
	// 		addressType: EAddressType.p2wpkh,
	// 		storage: {
	// 			getData,
	// 			setData
	// 		}
	// 	});
	// 	expect(createRes.isOk()).to.equal(false);
	// 	if (createRes.isOk()) return;
	// });
});
