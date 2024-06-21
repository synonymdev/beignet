import * as chai from 'chai';
import { validateMnemonic } from 'bip39';
import net from 'net';
import tls from 'tls';

import {
	filterAddressesObjForGapLimit,
	IAddress,
	IAddresses,
	Wallet
} from '../';
import {
	EAddressType,
	EAvailableNetworks,
	filterAddressesForGapLimit,
	filterAddressesObjForSingleIndex,
	filterAddressesObjForStartingIndex,
	generateMnemonic,
	IGetUtxosResponse,
	Result
} from '../src';
import { TEST_MNEMONIC } from './constants';
import { servers } from '../example/helpers';
import {
	EXPECTED_SHARED_RESULTS,
	EXPECTED_WALLET_RESULTS
} from './expected-results';

const expect = chai.expect;

const testTimeout = 60000;

let wallet;

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
});

describe('Wallet Library', async function () {
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

	it('Should create a wallet name based on the seed hash when none is provided.', () => {
		expect(wallet.name).to.equal(
			'7b4534b23017b8174ac0083bb7baa2f2cf3fb553f165e13485f2ca1a4cef883e'
		);
	});

	it('Should generate a taproot address at index 1', async () => {
		const address = await wallet.getAddress({
			addressType: EAddressType.p2tr,
			changeAddress: false,
			index: '1'
		});
		expect(address).to.equal(
			'tb1pejvld85wlxqtv0e4ff0r6u49cv5s9wl88xxv5clkvu64y8w28rwstn9490'
		);
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

	it('Should return addresses in range of the provided gap limit', async () => {
		const gapLimitOptions = {
			lookAhead: 2,
			lookBehind: 2,
			lookAheadChange: 1,
			lookBehindChange: 1
		};
		const addressesObj = wallet.data.addresses[EAddressType.p2wpkh];
		const addresses: IAddress[] = Object.values(addressesObj);
		const index: number = wallet.data.addressIndex[EAddressType.p2wpkh].index;
		expect(addresses.length).to.equal(25);
		expect(index).to.equal(5);
		expect(Math.min(...addresses.map((a) => a.index))).to.equal(0);
		expect(Math.max(...addresses.map((a) => a.index))).to.equal(24);

		const filteredAddresses = filterAddressesForGapLimit({
			addresses,
			index,
			gapLimitOptions,
			change: false
		});
		let indexes = filteredAddresses.map((a) => a.index);
		let minIndex = Math.min(...indexes);
		let maxIndex = Math.max(...indexes);
		expect(filteredAddresses.length).to.equal(5);
		expect(minIndex).to.equal(3);
		expect(maxIndex).to.equal(7);

		const filteredAddressesObj = filterAddressesObjForGapLimit({
			addresses: addressesObj,
			index,
			gapLimitOptions,
			change: false
		});
		indexes = Object.values(filteredAddressesObj).map((a: IAddress) => a.index);
		minIndex = Math.min(...indexes);
		maxIndex = Math.max(...indexes);
		expect(indexes.length).to.equal(5);
		expect(minIndex).to.equal(3);
		expect(maxIndex).to.equal(7);

		const filteredStartingAddresses = filterAddressesObjForStartingIndex({
			addresses: addressesObj,
			index
		});
		indexes = Object.values(filteredStartingAddresses).map(
			(a: IAddress) => a.index
		);
		minIndex = Math.min(...indexes);
		maxIndex = Math.max(...indexes);
		expect(indexes.length).to.equal(20);
		expect(minIndex).to.equal(5);
		expect(maxIndex).to.equal(24);

		const filteredSingleAddress = filterAddressesObjForSingleIndex({
			addresses: addressesObj,
			addressIndex: index
		});
		const singleAddress = Object.values(filteredSingleAddress);
		minIndex = Math.min(...singleAddress.map((a: IAddress) => a.index));
		maxIndex = Math.max(...singleAddress.map((a: IAddress) => a.index));
		expect(singleAddress.length).to.equal(1);
		expect(minIndex).to.equal(5);
		expect(maxIndex).to.equal(5);
	});

	it('Should successfully return the private testnet key for a given path', async () => {
		const addresses: IAddresses = wallet.data.addresses['p2wpkh'];

		const addressData1 = Object.values(addresses).find(
			(a: IAddress) => a.index === 0
		);
		expect(addressData1).to.not.be.undefined;
		if (!addressData1) return;
		const privateKey1: string = await wallet.getPrivateKey(addressData1.path);
		expect(typeof privateKey1).to.equal('string');
		expect(privateKey1).to.equal(
			'cSkdqJTnvZ56deaW5PpVJPeUCAQfPV7xJocfiZxdgm9UHHmXuXzY'
		);

		const privateKey2: string = await wallet.getPrivateKey("m/84'/1'/0'/0/19");
		expect(typeof privateKey2).to.equal('string');
		expect(privateKey2).to.equal(
			'cUcpwVpcwvVz17qnBzwNfNQpp9FsfXH1ogjKCkxgbB2ZzGGjrK2r'
		);
	});

	it('Should successfully return the tx history for a given address', async () => {
		const address = 'tb1qmja98kkd540qtesjqdanfg0ywags845vehfg66';
		const history = await wallet.getAddressHistory(address);
		expect(history.isErr()).to.equal(false);
		if (history.isErr()) return;
		expect(history.value).to.deep.equal(EXPECTED_WALLET_RESULTS.addressHistory);
	});

	it('Should successfully return the tx details for a given transaction', async () => {
		const tx =
			'e12dec55bd19c709ed5cc3213aab814315fd9716afc99dfe914b9190fdcb8452';
		const txDetails = await wallet.getTransactionDetails(tx);
		expect(txDetails.isErr()).to.equal(false);
		if (txDetails.isErr()) return;
		expect(txDetails.value.confirmations).to.be.a('number');
		delete txDetails.value.confirmations;
		expect(txDetails.value).to.deep.equal(
			EXPECTED_WALLET_RESULTS.transactionDetails
		);
	});

	it('Should successfully switch from testnet to regtest', async () => {
		expect(wallet.network).to.equal(EAvailableNetworks.testnet);
		await wallet.switchNetwork(EAvailableNetworks.regtest, servers.regtest);
		it('Should successfully create a wallet for the new network.', () => {
			expect(wallet).not.to.be.null;
		});
		const address = await wallet.getAddress({
			addressType: EAddressType.p2wpkh,
			changeAddress: false,
			index: '0'
		});
		expect(address).to.equal('bcrt1qmja98kkd540qtesjqdanfg0ywags845vm7s9dn');
		expect(wallet.data.utxos.length).to.equal(0);
		expect(wallet.data.balance).to.equal(0);
		const expectedAddressIndex = {
			address: 'bcrt1qmja98kkd540qtesjqdanfg0ywags845vm7s9dn',
			path: "m/84'/1'/0'/0/0",
			publicKey:
				'02189e644b5fe9acf24374b35f01f652e011867568b6e01765cace9b7ef07809cc',
			index: 0,
			scriptHash:
				'1cc3af572e4c847a1adf7ab3658fa7ae36926088c762821930dadc60e41217c2'
		};
		expect(wallet.data.addressIndex[wallet.data.addressType]).to.deep.equal(
			expectedAddressIndex
		);
		expect(wallet.network).to.equal(EAvailableNetworks.regtest);
	});

	it('Should successfully switch from regtest to mainnet', async () => {
		expect(wallet.network).to.equal(EAvailableNetworks.regtest);
		await wallet.switchNetwork(
			EAvailableNetworks.mainnet,
			servers[EAvailableNetworks.mainnet]
		);
		it('Should successfully create a wallet for the new network.', () => {
			expect(wallet).not.to.be.null;
		});
		const address = await wallet.getAddress({
			addressType: EAddressType.p2wpkh,
			changeAddress: false,
			index: '0'
		});
		expect(address).to.equal('bc1qreygjcarrm68vjg4fkx04qj70g04c5ttjyfkpj');
		expect(wallet.data.utxos.length).to.equal(0);
		expect(wallet.data.balance).to.equal(0);
		const expectedAddressIndex = {
			address: 'bc1qreygjcarrm68vjg4fkx04qj70g04c5ttjyfkpj',
			path: "m/84'/0'/0'/0/0",
			publicKey:
				'028b5c7c4c8650f229b5b89dfe4c9a7b37c1da8ecd75b38eb8a08e460c4ebf5e10',
			index: 0,
			scriptHash:
				'28f2ce1db4fd99ead11e0f5d165247c40999f52a899f8c02f1476c8541bd2fc5'
		};
		expect(wallet.data.addressIndex[wallet.data.addressType]).to.deep.equal(
			expectedAddressIndex
		);
		expect(wallet.network).to.equal(EAvailableNetworks.mainnet);
	});

	it('Should successfully return the private mainnet key for a given path', async () => {
		const addresses: IAddresses = wallet.data.addresses['p2wpkh'];

		const addressData1 = Object.values(addresses).find(
			(a: IAddress) => a.index === 0
		);
		expect(addressData1).to.not.be.undefined;
		if (!addressData1) return;
		const privateKey1: string = await wallet.getPrivateKey(addressData1.path);
		expect(typeof privateKey1).to.equal('string');
		expect(privateKey1).to.equal(
			'L2iqFGgLkMzQossGaQ9B2tmhSsLq3vgunnHb8vnLavXUh54GSLnK'
		);

		const privateKey2: string = await wallet.getPrivateKey("m/84'/0'/0'/0/19");
		expect(typeof privateKey2).to.equal('string');
		expect(privateKey2).to.equal(
			'L2cB657yFF88YEebxoad3YgeezYKAu61AhmnDHMFo7GjjpPqBZG1'
		);
	});
});
