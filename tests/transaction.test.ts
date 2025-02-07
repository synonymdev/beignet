import { expect } from 'chai';
import net from 'net';
import tls from 'tls';

import {
	decodeRawTransaction,
	IPrivateKeyInfo,
	ISweepPrivateKeyRes,
	Wallet,
	IUtxo,
	IOutput,
	ECoinSelectPreference,
	Transaction
} from '../';
import { servers } from '../example/helpers';
import { EAvailableNetworks, Result } from '../src';
import { TRANSACTION_TEST_MNEMONIC } from './constants';
import { EXPECTED_TRANSACTION_RESULTS } from './expected-results';

const testTimeout = 60000;

let wallet: Wallet;

describe('Transaction Test', async function (): Promise<void> {
	this.timeout(testTimeout);

	before(async function () {
		this.timeout(testTimeout);
		const res = await Wallet.create({
			mnemonic: TRANSACTION_TEST_MNEMONIC,
			network: EAvailableNetworks.testnet,
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

	it('Should successfully create a wallet.', (): void => {
		expect(wallet).not.to.be.null;
	});

	it('Should successfully return correct balance.', (): void => {
		const balance = wallet.getBalance();
		expect(balance).not.to.be.null;
		expect(balance).to.equal(80000);
	});

	it('Should successfully return fee information.', (): void => {
		const feeInfo = wallet.getFeeInfo({ satsPerByte: 5 });
		if (feeInfo.isErr()) throw feeInfo.error;
		expect(feeInfo.value.satsPerByte).to.equal(5);
		expect(feeInfo.value.totalFee).to.equal(830);
		expect(feeInfo.value.transactionByteCount).to.equal(166);
		expect(feeInfo.value.maxSatPerByte).to.equal(240);
	});

	it('Should successfully create and decode a transaction.', async (): Promise<void> => {
		// Get a receiving address.
		const sendRes = await wallet.send({
			address: 'tb1q8ud85xqzudmaq9sz4ncu44qrx68d8wuf2cwdqg',
			amount: 5000,
			satsPerByte: 5,
			broadcast: false,
			shuffleOutputs: false,
			rbf: true
		});
		if (sendRes.isErr()) throw sendRes.error;
		expect(sendRes.value).to.equal(
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d0000000000000000000288130000000000001600143f1a7a1802e377d01602acf1cad403368ed3bb89ba21010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba802483045022100dd709b656c271c7e2ab4c83e0245b9b8d9096a1c7a33eddc9a32113f436851d9022033f8e5cb016ae4c440badfa34e438ada7bea2cdd36e782c136e516350b502bca012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendRes.value, wallet.network);
		if (decodeRes.isErr()) throw decodeRes.error;
		expect(decodeRes.value).to.deep.equal(
			EXPECTED_TRANSACTION_RESULTS.decodeRawTransaction
		);
	});

	it('Should successfully create and decode a sendMany transaction.', async (): Promise<void> => {
		// Get a receiving address.
		const sendManyRes = await wallet.sendMany({
			txs: [
				{
					address: 'tb1q56mkp64fd2d6jxawj3jal382hec3u8t8af83d7',
					amount: 5000
				},
				{
					address: 'tb1qd08eypv4uzd4mrmm35pmx6226vzh2u5fqkpeyd',
					amount: 6000
				}
			],
			broadcast: false,
			shuffleOutputs: false,
			satsPerByte: 5,
			rbf: true
		});
		if (sendManyRes.isErr()) throw sendManyRes.error;
		expect(sendManyRes.value).to.equal(
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d000000000000000000038813000000000000160014a6b760eaa96a9ba91bae9465dfc4eabe711e1d6770170000000000001600146bcf920595e09b5d8f7b8d03b3694ad3057572892c0a010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba80247304402207e7b5de41cb9bf33e434c2136390bf40d6b6552b69234a62f6bf48b89f0d44ac022056121c9a9d79d9d84896c9896a6fddb358b48667021ff2832b5c5871d90b701a012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendManyRes.value, wallet.network);
		if (decodeRes.isErr()) throw decodeRes.error;
		expect(decodeRes.value).to.deep.equal(
			EXPECTED_TRANSACTION_RESULTS.decodeRawSendManyTransaction
		);
	});

	it('Should successfully sweep from a private key.', async (): Promise<void> => {
		const sweepPrivateKey: Result<ISweepPrivateKeyRes> =
			await wallet.sweepPrivateKey({
				privateKey: 'cUVwTLfHYrF7KGdTVU4AcP4yjtRTH3Y2BbTKHJbp2tsHDfpE8Zq5',
				toAddress: 'tb1qaq7jszepjuntxx494xhwrxs746v94583ls02ke',
				satsPerByte: 5,
				broadcast: false
			});
		if (sweepPrivateKey.isErr()) throw sweepPrivateKey.error;
		expect(sweepPrivateKey.value.id).to.equal(
			'7fbef762e16676715bc94693a495923273259aa1190a5bf97bf18ab676393af5'
		);
		expect(sweepPrivateKey.value.balance).to.equal(99170);
		expect(sweepPrivateKey.value.hex).to.equal(
			'02000000000101a501e33469d9c408f8825511ed98dfffc99625e003eb76b804ab4de61eb9f6490000000000ffffffff012480010000000000160014e83d280b219726b31aa5a9aee19a1eae985ad0f10247304402201748d26e4a1b49ac0fc3351fc23a02af7fb3d5c0cf30e026cd44f0014cb3b623022074702ba358169c8ac4792fbe962426046684dc152171168d16b90ed272657421012103eb5e83e7992a936edb19b18e4743047ef0f7aba4f469d8d3da1a2f0c514c7dab00000000'
		);
	});

	it('Should successfully sweep from a private key along with our existing utxos.', async (): Promise<void> => {
		const sweepPrivateKey: Result<ISweepPrivateKeyRes> =
			await wallet.sweepPrivateKey({
				privateKey: 'cUVwTLfHYrF7KGdTVU4AcP4yjtRTH3Y2BbTKHJbp2tsHDfpE8Zq5',
				toAddress: 'tb1qaq7jszepjuntxx494xhwrxs746v94583ls02ke',
				satsPerByte: 5,
				broadcast: false,
				combineWithWalletUtxos: true
			});
		if (sweepPrivateKey.isErr()) throw sweepPrivateKey.error;
		expect(sweepPrivateKey.value.id).to.equal(
			'ea6677d40bbf44dbc2d19d3765fd440aa2344f928d724dc021884fc5984e91ff'
		);
		expect(sweepPrivateKey.value.balance).to.equal(99170);
		expect(sweepPrivateKey.value.hex).to.equal(
			'020000000001024b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d0000000000ffffffffa501e33469d9c408f8825511ed98dfffc99625e003eb76b804ab4de61eb9f6490000000000ffffffff0168b8020000000000160014e83d280b219726b31aa5a9aee19a1eae985ad0f102483045022100e9143b3939cf6bece6f0ec809299b8d30333713ebb98832b0ba96418c270048d02200b0adbb27999dab3a0e24948b65fec4a42ebacfa339062f888f674f554754344012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff902483045022100ecdc33cc3688ee777a794eb9720789bee92ab675b897d3e920fa32d6247d6f9702200eb45dbd5eda97aa93a29bdec83032eabb3d0a2fa6b5b8b6f0bdf2321fdad989012103eb5e83e7992a936edb19b18e4743047ef0f7aba4f469d8d3da1a2f0c514c7dab00000000'
		);
	});

	it('Should successfully add external inputs to an existing transaction.', async (): Promise<void> => {
		await wallet.transaction.resetSendTransaction();
		const setupResponse = await wallet.transaction.setupTransaction({
			outputs: [
				{
					index: 0,
					address: 'tb1qaq7jszepjuntxx494xhwrxs746v94583ls02ke',
					value: 5000
				}
			]
		});
		if (setupResponse.isErr()) throw setupResponse.error;

		const privateKeyInfo: Result<IPrivateKeyInfo> =
			await wallet.getPrivateKeyInfo(
				'cUVwTLfHYrF7KGdTVU4AcP4yjtRTH3Y2BbTKHJbp2tsHDfpE8Zq5'
			);
		if (privateKeyInfo.isErr()) throw privateKeyInfo.error;
		const utxos = privateKeyInfo.value.utxos;
		const keyPair = privateKeyInfo.value.keyPair;
		expect(Array.isArray(utxos)).to.equal(true);
		expect(keyPair).not.to.be.null;
		expect(keyPair.publicKey.toString('hex')).to.equal(
			'03eb5e83e7992a936edb19b18e4743047ef0f7aba4f469d8d3da1a2f0c514c7dab'
		);
		const addExternRes = wallet.transaction.addExternalInputs({
			inputs: utxos,
			keyPair
		});
		if (addExternRes.isErr()) throw addExternRes.error;
		const createTransaction = await wallet.transaction.createTransaction({
			shuffleOutputs: false
		});
		if (createTransaction.isErr()) throw createTransaction.error;
		expect(createTransaction.value.id).to.equal(
			'c0b4a54d9b4f88a32c7d7349f03c71c84a16b99b5c82159474768e734afecd81'
		);
		expect(createTransaction.value.hex).to.equal(
			'020000000001024b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d0000000000ffffffffa501e33469d9c408f8825511ed98dfffc99625e003eb76b804ab4de61eb9f6490000000000ffffffff028813000000000000160014e83d280b219726b31aa5a9aee19a1eae985ad0f15aa7020000000000160014a6bd95db4dd6979189cad389daad006e236f4ba802483045022100abfaa0cde11801d6fa70f1d7a462d9b53d0424728dd4be184c350c9fa1024a6f022049b3d50457f4639330dd5a77597ced98956462c066ba42dc28f4790939b07ad0012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff902473044022051ce04d1be481bed6323a581a04b7798afd6d18808f9e147fcb17da9eef763a202203f9526411d968c775e606dbc92fea1610b65fdc6a32d7331a58d7631f97f41a1012103eb5e83e7992a936edb19b18e4743047ef0f7aba4f469d8d3da1a2f0c514c7dab00000000'
		);
	});
});

describe('Transaction CoinSelect Test', function (): void {
	const testInputs: IUtxo[] = [
		{
			address: 'bc1qrmnjd99e52g8pgevmnv9970fyu6hcaw6ejz8yn',
			index: 0,
			path: "m/84'/0'/0'/0/0",
			scriptHash:
				'a532a02196ec5213c7c2add2ea1bd4ef8904ad7fa5d4886e7a634c44de4687da',
			height: 750000,
			tx_hash:
				'7f3a06b2b842d5946f4737865bd42a9c9a4203d6f9c06d9e943139831c359cd4',
			tx_pos: 1,
			value: 10000,
			publicKey:
				'0374f4eac0a9f8de35e6d1fa6ab66c03f0c51c1dba8aa038c944ebce8398a3fe39'
		},
		{
			address: 'bc1q5dtmqaadlw0cft5q698wm93rdkc7hqfn6nrgk0',
			index: 1,
			path: "m/84'/0'/0'/0/1",
			scriptHash:
				'b642a02196ec5213c7c2add2ea1bd4ef8904ad7fa5d4886e7a634c44de4687cc',
			height: 750001,
			tx_hash:
				'8e4b06b2b842d5946f4737865bd42a9c9a4203d6f9c06d9e943139831c359ee5',
			tx_pos: 0,
			value: 20000,
			publicKey:
				'02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9'
		},
		{
			address: 'bc1qurz0qnhsmaptexjcmh4k5q78fyq0nteafspcxf',
			index: 2,
			path: "m/84'/0'/0'/0/2",
			scriptHash:
				'c753a02196ec5213c7c2add2ea1bd4ef8904ad7fa5d4886e7a634c44de4687bb',
			height: 750002,
			tx_hash:
				'9f5c06b2b842d5946f4737865bd42a9c9a4203d6f9c06d9e943139831c359ff6',
			tx_pos: 2,
			value: 30000,
			publicKey:
				'03cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a7'
		},
		{
			address: 'bc1qlupxcmlzdxu6dfu6ztakmpaysqx32azm7s9cu4',
			index: 3,
			path: "m/84'/0'/0'/0/3",
			scriptHash:
				'd864a02196ec5213c7c2add2ea1bd4ef8904ad7fa5d4886e7a634c44de4687aa',
			height: 750003,
			tx_hash:
				'af6d06b2b842d5946f4737865bd42a9c9a4203d6f9c06d9e943139831c359gg7',
			tx_pos: 1,
			value: 40000,
			publicKey:
				'02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0'
		},
		{
			address: 'bc1qere9mw0pqamhpr7ucq5s0e39uxaansry30gpl2',
			index: 4,
			path: "m/84'/0'/0'/0/4",
			scriptHash:
				'e975a02196ec5213c7c2add2ea1bd4ef8904ad7fa5d4886e7a634c44de4687f9',
			height: 750004,
			tx_hash:
				'bf7e06b2b842d5946f4737865bd42a9c9a4203d6f9c06d9e943139831c359hh8',
			tx_pos: 0,
			value: 50000,
			publicKey:
				'03fff97bd5755eeea420453a14355235d382f6472f8568a18b2f057a1460297556'
		}
	];

	const testOutputs: IOutput[] = [
		{
			address: 'bc1ququnvd7swf3s95ghtpuxn3rz3dyfhz99vplyv7',
			value: 10000,
			index: 0
		}
	];

	this.timeout(testTimeout);

	before(async function () {
		this.timeout(testTimeout);
		const res = await Wallet.create({
			mnemonic: TRANSACTION_TEST_MNEMONIC,
			network: EAvailableNetworks.testnet,
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

	const transaction = new Transaction({ wallet });

	it('Should select smallest UTXOs first when using small preference', () => {
		const result = transaction.autoCoinSelect({
			inputs: testInputs,
			outputs: testOutputs,
			satsPerByte: 1,
			coinSelectPreference: ECoinSelectPreference.small
		});

		expect(result.isOk()).to.be.true;
		if (result.isOk()) {
			const selectedInputs = result.value.inputs;
			// We need at least two inputs because of fees
			expect(selectedInputs).to.have.length.at.least(1);
			// Verify the first selected input is the smallest one
			expect(selectedInputs[0].value).to.equal(10000);
		}
	});

	it('Should select largest UTXOs first when using large preference', () => {
		const result = transaction.autoCoinSelect({
			inputs: testInputs,
			outputs: testOutputs,
			satsPerByte: 1,
			coinSelectPreference: ECoinSelectPreference.large
		});

		expect(result.isOk()).to.be.true;
		if (result.isOk()) {
			const selectedInputs = result.value.inputs;
			expect(selectedInputs).to.have.length.at.least(1);
			// Verify the first selected input is the largest one
			expect(selectedInputs[0].value).to.equal(50000);
		}
	});

	it('Should select oldest UTXOs first when using firstInFirstOut preference', () => {
		const result = transaction.autoCoinSelect({
			inputs: testInputs,
			outputs: testOutputs,
			satsPerByte: 1,
			coinSelectPreference: ECoinSelectPreference.firstInFirstOut
		});

		expect(result.isOk()).to.be.true;
		if (result.isOk()) {
			const selectedInputs = result.value.inputs;
			expect(selectedInputs).to.have.length.at.least(1);
			// Verify the first selected input has the lowest height (oldest)
			expect(selectedInputs[0].height).to.equal(750000);
		}
	});

	it('Should select newest UTXOs first when using lastInFirstOut preference', () => {
		const result = transaction.autoCoinSelect({
			inputs: testInputs,
			outputs: testOutputs,
			satsPerByte: 1,
			coinSelectPreference: ECoinSelectPreference.lastInFirstOut
		});

		expect(result.isOk()).to.be.true;
		if (result.isOk()) {
			const selectedInputs = result.value.inputs;
			expect(selectedInputs).to.have.length.at.least(1);
			// Verify the first selected input has the highest height (newest)
			expect(selectedInputs[0].height).to.equal(750004);
		}
	});

	it('Should select all UTXOs when using consolidate preference', () => {
		const result = transaction.autoCoinSelect({
			inputs: testInputs,
			outputs: testOutputs,
			satsPerByte: 1,
			coinSelectPreference: ECoinSelectPreference.consolidate
		});

		expect(result.isOk()).to.be.true;
		if (result.isOk()) {
			const selectedInputs = result.value.inputs;
			expect(selectedInputs).to.have.lengthOf(testInputs.length);
			const totalValue = selectedInputs.reduce(
				(sum, input) => sum + input.value,
				0
			);
			expect(totalValue).to.equal(150000);
		}
	});

	it('Should handle insufficient funds scenario', () => {
		const largeOutput: IOutput[] = [
			{
				address: 'bc1ququnvd7swf3s95ghtpuxn3rz3dyfhz99vplyv7',
				value: 1000000,
				index: 0
			}
		];

		const result = transaction.autoCoinSelect({
			inputs: testInputs,
			outputs: largeOutput,
			satsPerByte: 1,
			coinSelectPreference: ECoinSelectPreference.small
		});

		expect(result.isErr()).to.be.true;
		if (result.isErr()) {
			expect(result.error.message).to.equal('Not enough funds.');
		}
	});

	it('Should handle fee calculation correctly', () => {
		const result = transaction.autoCoinSelect({
			inputs: testInputs,
			outputs: testOutputs,
			satsPerByte: 5,
			coinSelectPreference: ECoinSelectPreference.small
		});

		expect(result.isOk()).to.be.true;
		if (result.isOk()) {
			expect(result.value.fee).to.be.greaterThan(0);
		}
	});

	it('Should handle empty inputs scenario', () => {
		const result = transaction.autoCoinSelect({
			inputs: [],
			outputs: testOutputs,
			satsPerByte: 1,
			coinSelectPreference: ECoinSelectPreference.small
		});

		expect(result.isErr()).to.be.true;
		if (result.isErr()) {
			expect(result.error.message).to.equal('No inputs provided');
		}
	});
});
