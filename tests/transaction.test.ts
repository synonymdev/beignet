import * as chai from 'chai';
import { decodeRawTransaction, Wallet } from '../';
import { EAvailableNetworks } from '../src';
import { TRANSACTION_TEST_MNEMONIC } from './constants';

const expect = chai.expect;

const testTimeout = 60000;

let wallet;

before(async function () {
	this.timeout(testTimeout);
	const res = await Wallet.create({
		mnemonic: TRANSACTION_TEST_MNEMONIC,
		network: EAvailableNetworks.testnet
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
		expect(feeInfo.value.totalFee).to.equal(1280);
		expect(feeInfo.value.transactionByteCount).to.equal(256);
		expect(feeInfo.value.maxSatPerByte).to.equal(156);
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
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d0000000000000000000288130000000000001600143f1a7a1802e377d01602acf1cad403368ed3bb89f81f010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba8024730440220561a041d420e89ca3efbcabf5ed2831c1d562ea363e8a16b2637aeb845f59a8602201d8d403658da4ec010c2de2e1399e591383059abe593fb5aa7bd2480b00b6749012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendRes.value, wallet.network);
		expect(decodeRes.isErr()).to.equal(false);
		if (decodeRes.isErr()) return;
		const expectedDecodeRes = {
			txid: 'd0fd72cb4e16d025b65ddac64cc02d702955ce3c2d76dcb0276392fb35b4a644',
			tx_hash:
				'80173ab787171855a84f568742f2fcce5456097bab27bfe654f339005584347c',
			size: 222,
			vsize: 141,
			weight: 561,
			version: 2,
			locktime: 0,
			vin: [
				{
					txid: '8d805dd2088da26440bcd515f04f89a4f7bbb820726fc2d100818ae479d3444b',
					vout: 0,
					scriptSig: { asm: '', hex: '' },
					txinwitness: [
						'30440220561a041d420e89ca3efbcabf5ed2831c1d562ea363e8a16b2637aeb845f59a8602201d8d403658da4ec010c2de2e1399e591383059abe593fb5aa7bd2480b00b674901',
						'02e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff9'
					],
					sequence: 0
				}
			],
			vout: [
				{
					value: 5000,
					n: 0,
					scriptPubKey: {
						asm: 'OP_0 3f1a7a1802e377d01602acf1cad403368ed3bb89',
						hex: '00143f1a7a1802e377d01602acf1cad403368ed3bb89',
						address: 'tb1q8ud85xqzudmaq9sz4ncu44qrx68d8wuf2cwdqg'
					}
				},
				{
					value: 73720,
					n: 1,
					scriptPubKey: {
						asm: 'OP_0 a6bd95db4dd6979189cad389daad006e236f4ba8',
						hex: '0014a6bd95db4dd6979189cad389daad006e236f4ba8',
						address: 'tb1q567etk6d66terzw26wya4tgqdc3k7jag0zcw3r'
					}
				}
			]
		};
		expect(decodeRes.value).to.deep.equal(expectedDecodeRes);
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
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d000000000000000000038813000000000000160014a6b760eaa96a9ba91bae9465dfc4eabe711e1d6770170000000000001600146bcf920595e09b5d8f7b8d03b3694ad3057572898808010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba802483045022100fefb3a9c8d08a24cc1d157f8d37a71d3f1ce32677af25186f292e37873bab32802207bae71c9b302a248ed5e0a86cfc14a433392f68ae1bd8f11ded3f73cc151dd27012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendManyRes.value, wallet.network);
		expect(decodeRes.isErr()).to.equal(false);
		if (decodeRes.isErr()) return;
		const expectedDecodeRes = {
			txid: 'ac0ba26aff1b867b5372aba1ad50ba8087d09c0b6533ca66b2f0cca033b72272',
			tx_hash:
				'734db30a11ba7d6170c611932692bc70285a3fa9f85629ad59a3148d9e410c58',
			size: 254,
			vsize: 172,
			weight: 686,
			version: 2,
			locktime: 0,
			vin: [
				{
					txid: '8d805dd2088da26440bcd515f04f89a4f7bbb820726fc2d100818ae479d3444b',
					vout: 0,
					scriptSig: { asm: '', hex: '' },
					txinwitness: [
						'3045022100fefb3a9c8d08a24cc1d157f8d37a71d3f1ce32677af25186f292e37873bab32802207bae71c9b302a248ed5e0a86cfc14a433392f68ae1bd8f11ded3f73cc151dd2701',
						'02e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff9'
					],
					sequence: 0
				}
			],
			vout: [
				{
					value: 5000,
					n: 0,
					scriptPubKey: {
						asm: 'OP_0 a6b760eaa96a9ba91bae9465dfc4eabe711e1d67',
						hex: '0014a6b760eaa96a9ba91bae9465dfc4eabe711e1d67',
						address: 'tb1q56mkp64fd2d6jxawj3jal382hec3u8t8af83d7'
					}
				},
				{
					value: 6000,
					n: 1,
					scriptPubKey: {
						asm: 'OP_0 6bcf920595e09b5d8f7b8d03b3694ad305757289',
						hex: '00146bcf920595e09b5d8f7b8d03b3694ad305757289',
						address: 'tb1qd08eypv4uzd4mrmm35pmx6226vzh2u5fqkpeyd'
					}
				},
				{
					value: 67720,
					n: 2,
					scriptPubKey: {
						asm: 'OP_0 a6bd95db4dd6979189cad389daad006e236f4ba8',
						hex: '0014a6bd95db4dd6979189cad389daad006e236f4ba8',
						address: 'tb1q567etk6d66terzw26wya4tgqdc3k7jag0zcw3r'
					}
				}
			]
		};
		expect(decodeRes.value).to.deep.equal(expectedDecodeRes);
	});
});
