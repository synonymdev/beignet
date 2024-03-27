export const EXPECTED_WALLET_RESULTS = {
	addressHistory: [
		{
			height: 2472352,
			tx_hash:
				'e12dec55bd19c709ed5cc3213aab814315fd9716afc99dfe914b9190fdcb8452'
		},
		{
			height: 2539267,
			tx_hash:
				'01a98e4ad0ce6b3e1eb4a3a5357bdaaadc15b47bcd4349944ea541adfc8f3f39'
		}
	],
	transactionDetails: {
		blockhash:
			'0000000000002081fe416979b95a9ae8d8ea325a3f8d6312d042da93f7a0e0fb',
		blocktime: 1691862473,
		//confirmations: 111366,
		hash: '7e771ebf5319ae710aaeeefea2cc1d385e86d4fd65325769fe39362e142679bb',
		hex: '02000000000101789f9ab5a8785f96f44e2f0a4bed3daedc0b513e5a7953bb53d6cb829ea5a5230000000000fdffffff02eb641f00000000001600149e329eb9f21c670ed6fad5df00cb818bd61fdd54e803000000000000160014dcba53dacda55e05e612037b34a1e4775103d68c024730440220275de890d1ebfa5c2445bfccbabe79b3ebe3ef27d7cb80133a839c1c97dbd0c50220465ce4e432f44fdce720cb639f2115f09a8a9de222407e3083a40a6b3ef13c44012103caa7816e40f0762ca6ed49fb64b0aca8d427dd314f482c8de5685baae8e1ece89fb92500',
		locktime: 2472351,
		size: 222,
		time: 1691862473,
		txid: 'e12dec55bd19c709ed5cc3213aab814315fd9716afc99dfe914b9190fdcb8452',
		version: 2,
		vin: [
			{
				scriptSig: { asm: '', hex: '' },
				sequence: 4294967293,
				txid: '23a5a59e82cbd653bb53795a3e510bdcae3ded4b0a2f4ef4965f78a8b59a9f78',
				txinwitness: [
					'30440220275de890d1ebfa5c2445bfccbabe79b3ebe3ef27d7cb80133a839c1c97dbd0c50220465ce4e432f44fdce720cb639f2115f09a8a9de222407e3083a40a6b3ef13c4401',
					'03caa7816e40f0762ca6ed49fb64b0aca8d427dd314f482c8de5685baae8e1ece8'
				],
				vout: 0
			}
		],
		vout: [
			{
				n: 0,
				scriptPubKey: {
					address: 'tb1qncefaw0jr3nsa4h66h0spjup30tplh25lpavsr',
					asm: '0 9e329eb9f21c670ed6fad5df00cb818bd61fdd54',
					desc: 'addr(tb1qncefaw0jr3nsa4h66h0spjup30tplh25lpavsr)#lfwshpn4',
					hex: '00149e329eb9f21c670ed6fad5df00cb818bd61fdd54',
					type: 'witness_v0_keyhash'
				},
				value: 0.02057451
			},
			{
				n: 1,
				scriptPubKey: {
					address: 'tb1qmja98kkd540qtesjqdanfg0ywags845vehfg66',
					asm: '0 dcba53dacda55e05e612037b34a1e4775103d68c',
					desc: 'addr(tb1qmja98kkd540qtesjqdanfg0ywags845vehfg66)#4tsskq5x',
					hex: '0014dcba53dacda55e05e612037b34a1e4775103d68c',
					type: 'witness_v0_keyhash'
				},
				value: 0.00001
			}
		],
		vsize: 141,
		weight: 561
	}
};

export const EXPECTED_TRANSACTION_RESULTS = {
	decodeRawTransaction: {
		txid: '5afdbcb5ffa6e1104c4a67e80e8fde2280cb615b70b33c99951debc2d5e5f500',
		tx_hash: '094e314cbab1a268950a47216293d6ed170133ad265389e8dde7babf5eebed51',
		size: 223,
		vsize: 141,
		weight: 562,
		version: 2,
		locktime: 0,
		vin: [
			{
				txid: '8d805dd2088da26440bcd515f04f89a4f7bbb820726fc2d100818ae479d3444b',
				vout: 0,
				scriptSig: { asm: '', hex: '' },
				txinwitness: [
					'3045022100dd709b656c271c7e2ab4c83e0245b9b8d9096a1c7a33eddc9a32113f436851d9022033f8e5cb016ae4c440badfa34e438ada7bea2cdd36e782c136e516350b502bca01',
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
				value: 74170,
				n: 1,
				scriptPubKey: {
					asm: 'OP_0 a6bd95db4dd6979189cad389daad006e236f4ba8',
					hex: '0014a6bd95db4dd6979189cad389daad006e236f4ba8',
					address: 'tb1q567etk6d66terzw26wya4tgqdc3k7jag0zcw3r'
				}
			}
		]
	},
	decodeRawSendManyTransaction: {
		txid: '3fb40fc55d80c46d08f412c2c9a6b18e6b46264a6ae6fd4be8409480d1a53b45',
		tx_hash: '6b124dc403f6db7ce9c7967b8b3b5b3223d4df98626ece3b5d253450c47c9b88',
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
	}
};

export const EXPECTED_SHARED_RESULTS = {
	getNextAvailableAddress: {
		addressIndex: {
			address: 'tb1qqcmg5vwk736mmr3fnkx5us9hq4czl6cx5w5g0x',
			path: "m/84'/1'/0'/0/5",
			publicKey:
				'0345f71b1a5f9ce1c08ef2dbb1fb1076296b0fdf1f09f6fe7f53ed22383ad9d1c9',
			index: 5,
			scriptHash:
				'448ae601fb40d7a6de824eb34479286a06d41015250fc75544dbb6d2893bd0e5'
		},
		lastUsedAddressIndex: {
			address: 'tb1qyxugs6zkcj3r4u09qks7khgf7hkktf8mnzz5ze',
			path: "m/84'/1'/0'/0/4",
			publicKey:
				'03f01a817e07ff424f00d6be3b93f7bec658aaf8fbfed5cd2c18f95f3cfd47f7a8',
			index: 4,
			scriptHash:
				'7f07103d4580005b27b856434bba9be63a7e58a83cb456b603f4af3ae88d1023'
		},
		changeAddressIndex: {
			address: 'tb1q32eaj0c805mry76wa0g6hlcunu7ttu96833072',
			path: "m/84'/1'/0'/1/10",
			publicKey:
				'038813820d10cca28ce1fdb6a8b346a4ab9de6b520adc46e2c4442a7ba94de10a1',
			index: 10,
			scriptHash:
				'3198ad3b2b39efcdeeb6b338c1f28ccede385c2092dbb9854e265b6eec8a0dab'
		},
		lastUsedChangeAddressIndex: {
			index: 9,
			path: "m/84'/1'/0'/1/9",
			address: 'tb1q926j5y9mwjc49axf5w25y2jrm0ew8w6uks0vdm',
			scriptHash:
				'640d69f5b22996bdc95dbac8863e9e94e198f40569c1ec46b6336edd740c0007',
			publicKey:
				'02e9085f8d23072244620f0549e6f1c6ff04c8c8b1dd238edce106ce6ef54b358e'
		}
	},
	getUtxos: {
		utxos: [
			{
				address: 'tb1qy45r5c84eh7tuke772lrvj2q5kqlylp2ghgdlk',
				path: "m/84'/1'/0'/0/1",
				publicKey:
					'03f8c98bf09b3e069714a05a530a735761453d94d1f4355239bfcb6b78c25a2592',
				index: 1,
				scriptHash:
					'bdb8f18267b816706378c2c9282e0be7b05dcc5a3e63dd2468f145c6431f2002',
				tx_hash:
					'7a6e9a985de1e5bed1138d1fe1bf2f169a4f838d802ecdf96d1376378391a350',
				tx_pos: 0,
				height: 2539268,
				value: 1000
			},
			{
				address: 'tb1q926j5y9mwjc49axf5w25y2jrm0ew8w6uks0vdm',
				path: "m/84'/1'/0'/1/9",
				publicKey:
					'02e9085f8d23072244620f0549e6f1c6ff04c8c8b1dd238edce106ce6ef54b358e',
				index: 9,
				scriptHash:
					'640d69f5b22996bdc95dbac8863e9e94e198f40569c1ec46b6336edd740c0007',
				tx_hash:
					'7a6e9a985de1e5bed1138d1fe1bf2f169a4f838d802ecdf96d1376378391a350',
				tx_pos: 1,
				height: 2539268,
				value: 3855
			}
		],
		balance: 4855
	}
};
