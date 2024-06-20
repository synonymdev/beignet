import * as chai from 'chai';
import net from 'net';
import tls from 'tls';

import {
	decodeRawTransaction,
	IPrivateKeyInfo,
	ISweepPrivateKeyRes,
	Wallet
} from '../';
import { EAvailableNetworks, Result } from '../src';
import { TRANSACTION_TEST_MNEMONIC } from './constants';
import { servers } from '../example/helpers';
import { EXPECTED_TRANSACTION_RESULTS } from './expected-results';

const expect = chai.expect;

const testTimeout = 60000;

let wallet;

before(async function () {
	this.timeout(testTimeout);
	const res = await Wallet.create({
		mnemonic: TRANSACTION_TEST_MNEMONIC,
		network: EAvailableNetworks.testnet,
		electrumOptions: {
			servers: servers[EAvailableNetworks.testnet],
			net,
			tls,
		}
	});
	if (res.isErr()) {
		console.log('error: ', res.error.message);
		return;
	}
	wallet = res.value;
});

describe('Transaction Test', async function (): Promise<void> {
	this.timeout(testTimeout);

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
		expect(feeInfo.isErr()).to.equal(false);
		if (feeInfo.isErr()) return;
		expect(feeInfo).not.to.be.null;
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
		expect(sendRes.isErr()).to.equal(false);
		if (sendRes.isErr()) return;
		expect(sendRes.value).to.equal(
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d0000000000000000000288130000000000001600143f1a7a1802e377d01602acf1cad403368ed3bb89ba21010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba802483045022100dd709b656c271c7e2ab4c83e0245b9b8d9096a1c7a33eddc9a32113f436851d9022033f8e5cb016ae4c440badfa34e438ada7bea2cdd36e782c136e516350b502bca012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendRes.value, wallet.network);
		expect(decodeRes.isErr()).to.equal(false);
		if (decodeRes.isErr()) return;
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
		expect(sendManyRes.isErr()).to.equal(false);
		if (sendManyRes.isErr()) return;
		expect(sendManyRes.value).to.equal(
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d000000000000000000038813000000000000160014a6b760eaa96a9ba91bae9465dfc4eabe711e1d6770170000000000001600146bcf920595e09b5d8f7b8d03b3694ad3057572892c0a010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba80247304402207e7b5de41cb9bf33e434c2136390bf40d6b6552b69234a62f6bf48b89f0d44ac022056121c9a9d79d9d84896c9896a6fddb358b48667021ff2832b5c5871d90b701a012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendManyRes.value, wallet.network);
		expect(decodeRes.isErr()).to.equal(false);
		if (decodeRes.isErr()) return;
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
		if (sweepPrivateKey.isErr()) return;
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
		if (sweepPrivateKey.isErr()) return;
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
				{ address: 'tb1qaq7jszepjuntxx494xhwrxs746v94583ls02ke', value: 5000 }
			]
		});
		expect(setupResponse.isErr()).to.equal(false);
		if (setupResponse.isErr()) return;
		const privateKeyInfo: Result<IPrivateKeyInfo> =
			await wallet.getPrivateKeyInfo(
				'cUVwTLfHYrF7KGdTVU4AcP4yjtRTH3Y2BbTKHJbp2tsHDfpE8Zq5'
			);
		expect(privateKeyInfo.isErr()).to.equal(false);
		if (privateKeyInfo.isErr()) return;
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
		expect(addExternRes.isErr()).to.equal(false);
		if (addExternRes.isErr()) return;
		const createTransaction = await wallet.transaction.createTransaction({
			shuffleOutputs: false
		});
		expect(createTransaction.isErr()).to.equal(false);
		if (createTransaction.isErr()) return;
		expect(createTransaction.value.id).to.equal(
			'c0b4a54d9b4f88a32c7d7349f03c71c84a16b99b5c82159474768e734afecd81'
		);
		expect(createTransaction.value.hex).to.equal(
			'020000000001024b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d0000000000ffffffffa501e33469d9c408f8825511ed98dfffc99625e003eb76b804ab4de61eb9f6490000000000ffffffff028813000000000000160014e83d280b219726b31aa5a9aee19a1eae985ad0f15aa7020000000000160014a6bd95db4dd6979189cad389daad006e236f4ba802483045022100abfaa0cde11801d6fa70f1d7a462d9b53d0424728dd4be184c350c9fa1024a6f022049b3d50457f4639330dd5a77597ced98956462c066ba42dc28f4790939b07ad0012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff902473044022051ce04d1be481bed6323a581a04b7798afd6d18808f9e147fcb17da9eef763a202203f9526411d968c775e606dbc92fea1610b65fdc6a32d7331a58d7631f97f41a1012103eb5e83e7992a936edb19b18e4743047ef0f7aba4f469d8d3da1a2f0c514c7dab00000000'
		);
	});
});
