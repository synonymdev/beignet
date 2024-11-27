import { expect } from 'chai';
import {
	EAddressType,
	EAvailableNetworks,
	getAddressTypeFromPath,
	getKeyDerivationPath,
	getKeyDerivationPathObject,
	getKeyDerivationPathString
} from '../src';

describe('Derivation Methods', () => {
	it('Should return default derivation path object for p2wpkh', () => {
		const pathRes = getKeyDerivationPath({
			addressType: EAddressType.p2wpkh,
			network: EAvailableNetworks.mainnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value.purpose).to.equal('84');
		expect(pathRes.value.coinType).to.equal('0');
		expect(pathRes.value.account).to.equal('0');
		expect(pathRes.value.change).to.equal('0');
		expect(pathRes.value.index).to.equal('0');
	});
	it('Should return default derivation path object for p2sh', () => {
		const pathRes = getKeyDerivationPath({
			addressType: EAddressType.p2sh,
			network: EAvailableNetworks.mainnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value.purpose).to.equal('49');
		expect(pathRes.value.coinType).to.equal('0');
		expect(pathRes.value.account).to.equal('0');
		expect(pathRes.value.change).to.equal('0');
		expect(pathRes.value.index).to.equal('0');
	});
	it('Should return default derivation path object for p2pkh', () => {
		const pathRes = getKeyDerivationPath({
			addressType: EAddressType.p2pkh,
			network: EAvailableNetworks.mainnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value.purpose).to.equal('44');
		expect(pathRes.value.coinType).to.equal('0');
		expect(pathRes.value.account).to.equal('0');
		expect(pathRes.value.change).to.equal('0');
		expect(pathRes.value.index).to.equal('0');
	});

	it('Should return a valid mainnet bech32 change address derivation string at index 0', () => {
		const pathRes = getKeyDerivationPathString({
			addressType: EAddressType.p2wpkh,
			changeAddress: true,
			index: 0,
			network: EAvailableNetworks.mainnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value).to.equal("m/84'/0'/0'/1/0");
	});
	it('Should return a valid testnet p2sh derivation string at index 40', () => {
		const pathRes = getKeyDerivationPathString({
			addressType: EAddressType.p2sh,
			changeAddress: false,
			index: '40',
			network: EAvailableNetworks.testnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value).to.equal("m/49'/1'/0'/0/40");
	});
	it('Should return a valid mainnet p2pkh derivation string at index 8', () => {
		const pathRes = getKeyDerivationPathString({
			addressType: EAddressType.p2pkh,
			changeAddress: false,
			index: 8,
			network: EAvailableNetworks.mainnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value).to.equal("m/44'/0'/0'/0/8");
	});

	it('Should return a valid mainnet bech32 change address derivation object at index 0', () => {
		const pathRes = getKeyDerivationPathObject({
			path: "m/84'/0'/0'/1/0",
			network: EAvailableNetworks.mainnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value.purpose).to.equal('84');
		expect(pathRes.value.coinType).to.equal('0');
		expect(pathRes.value.account).to.equal('0');
		expect(pathRes.value.change).to.equal('1');
		expect(pathRes.value.index).to.equal('0');
	});
	it('Should return a valid testnet p2sh derivation object at index 40', () => {
		const pathRes = getKeyDerivationPathObject({
			path: "m/49'/1'/0'/0/40",
			network: EAvailableNetworks.testnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value.purpose).to.equal('49');
		expect(pathRes.value.coinType).to.equal('1');
		expect(pathRes.value.account).to.equal('0');
		expect(pathRes.value.change).to.equal('0');
		expect(pathRes.value.index).to.equal('40');
	});
	it('Should return a valid mainnet p2pkh object at index 8', () => {
		const pathRes = getKeyDerivationPathObject({
			path: "m/44'/0'/0'/0/8",
			network: EAvailableNetworks.mainnet
		});
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value.purpose).to.equal('44');
		expect(pathRes.value.coinType).to.equal('0');
		expect(pathRes.value.account).to.equal('0');
		expect(pathRes.value.change).to.equal('0');
		expect(pathRes.value.index).to.equal('8');
	});

	it('Should return a valid address type from p2wpkh path', () => {
		const pathRes = getAddressTypeFromPath("m/84'/0'/0'/0/0");
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value).to.equal(EAddressType.p2wpkh);
	});
	it('Should return a valid address type from p2sh path', () => {
		const pathRes = getAddressTypeFromPath("m/49'/0'/0'/0/0");
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value).to.equal(EAddressType.p2sh);
	});
	it('Should return a valid address type from p2pkh path', () => {
		const pathRes = getAddressTypeFromPath("m/44'/0'/0'/0/0");
		if (pathRes.isErr()) throw pathRes.error;
		expect(pathRes.value).to.equal(EAddressType.p2pkh);
	});
});
