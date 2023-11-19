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

	it('Should successfully return fee information.', (): void => {
		const feeInfo = wallet.getFeeInfo({ satsPerByte: 5 });
		expect(feeInfo.isErr()).to.equal(false);
		if (feeInfo.isErr()) return;
		expect(feeInfo).not.to.be.null;
		expect(feeInfo.value.satsPerByte).to.equal(5);
		expect(feeInfo.value.totalFee).to.equal(705);
		expect(feeInfo.value.transactionByteCount).to.equal(141);
		expect(feeInfo.value.maxSatPerByte).to.equal(283);
	});

	it('Should successfully create and decode a transaction.', async (): Promise<void> => {
		// Get a receiving address.
		const sendRes = await wallet.send({
			address: 'tb1q8ud85xqzudmaq9sz4ncu44qrx68d8wuf2cwdqg',
			amount: 5000,
			satsPerByte: 5,
			broadcast: false,
			shuffleOutputs: false
		});
		expect(sendRes.isErr()).to.equal(false);
		if (sendRes.isErr()) return;
		expect(sendRes.value).to.equal(
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d0000000000000000000288130000000000001600143f1a7a1802e377d01602acf1cad403368ed3bb893722010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba8024730440220078f087ba08b79c02e7cb97593d7e698670dd6e7537e3639dec70b4d354f8fa8022018a20a64618a405427eb2e0e67ef9ae2b89bfe1b51cdb365d44b5314b9728a06012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendRes.value, wallet.network);
		expect(decodeRes.isErr()).to.equal(false);
		if (decodeRes.isErr()) return;
		const expectedDecodeRes = {
			txid: '786c97889108849e7970651a0dbd10e08ffe7b4ddfd282be54e465441b985308',
			tx_hash:
				'a5ad458d02cc905593e4b6d3c88cdbedcfff31a192691f24abdab92b4cef74ea',
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
						'30440220078f087ba08b79c02e7cb97593d7e698670dd6e7537e3639dec70b4d354f8fa8022018a20a64618a405427eb2e0e67ef9ae2b89bfe1b51cdb365d44b5314b9728a0601',
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
					value: 74295,
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
			satsPerByte: 5
		});
		expect(sendManyRes.isErr()).to.equal(false);
		if (sendManyRes.isErr()) return;
		expect(sendManyRes.value).to.equal(
			'020000000001014b44d379e48a8100d1c26f7220b8bbf7a4894ff015d5bc4064a28d08d25d808d000000000000000000038813000000000000160014a6b760eaa96a9ba91bae9465dfc4eabe711e1d6770170000000000001600146bcf920595e09b5d8f7b8d03b3694ad3057572892c0a010000000000160014a6bd95db4dd6979189cad389daad006e236f4ba80247304402207e7b5de41cb9bf33e434c2136390bf40d6b6552b69234a62f6bf48b89f0d44ac022056121c9a9d79d9d84896c9896a6fddb358b48667021ff2832b5c5871d90b701a012102e86b90924963237c59e5389aab1cc5350c114549d1c5e7186a56ef33aea24ff900000000'
		);

		const decodeRes = decodeRawTransaction(sendManyRes.value, wallet.network);
		expect(decodeRes.isErr()).to.equal(false);
		if (decodeRes.isErr()) return;
		const expectedDecodeRes = {
			txid: '3fb40fc55d80c46d08f412c2c9a6b18e6b46264a6ae6fd4be8409480d1a53b45',
			tx_hash:
				'6b124dc403f6db7ce9c7967b8b3b5b3223d4df98626ece3b5d253450c47c9b88',
			size: 253,
			vsize: 172,
			weight: 685,
			version: 2,
			locktime: 0,
			vin: [
				{
					txid: '8d805dd2088da26440bcd515f04f89a4f7bbb820726fc2d100818ae479d3444b',
					vout: 0,
					scriptSig: { asm: '', hex: '' },
					txinwitness: [
						'304402207e7b5de41cb9bf33e434c2136390bf40d6b6552b69234a62f6bf48b89f0d44ac022056121c9a9d79d9d84896c9896a6fddb358b48667021ff2832b5c5871d90b701a01',
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
					value: 68140,
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
