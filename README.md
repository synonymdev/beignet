# Beignet

:warning: This is pre-alpha software and not suitable for production apps yet.

## Description

A self-custodial, JS Bitcoin wallet management library.

## Table of Contents

1. [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies & Build](#install-dependencies--build)
  - [Run Tests](#run-tests)
  - [Run Example Project](#run-example-project)
2. [Implementation](#implementation)
3. [Advanced Usage](#advanced-usage)
3. [Documentation](#documentation)
4. [Support](#support)

## Installation

### Clone the Repository

```bash
git clone git@github.com:synonymdev/beignet.git && cd beignet
```

### Install Dependencies & Build

```bash
npm i && npm run build
```

### Run tests:

```bash
npm run test
```

### Run example project:
```bash
npm run example
```

## Implementation
```javascript
import { Wallet, generateMnemonic } from 'beignet';

// Generate a mnemonic phrase
const mnemonic = generateMnemonic();

// Create a wallet instance
const createWalletRes = new Wallet({ mnemonic });
if (createWalletRes.isErr()) return;
const wallet = createWalletRes.value;
  
// Get receiving address
const address = wallet.getAddress();

// Get wallet balance
const walletBalance = wallet.getBalance();

// Send sats
const sendRes = await wallet.send({ address, amount: 1000 });

// Get address balance
const addressBalanceRes = await wallet.getAddressBalance(address);
if (addressBalance.isErr()) return;
const addressBalance = addressBalanceRes.value;
```

## Advanced Usage

```typescript
import { Wallet, generateMnemonic } from 'beignet';
import { TStorage } from './wallet';

// Generate a mnemonic phrase
const mnemonic = generateMnemonic();

// Add a bip39 passphrase
const passphrase = 'passphrase';

// Connect to custom electrum server
const server: TServer = {
	host: '35.233.47.252',
	ssl: 18484,
	tcp: 18483,
	protocol: EProtocol.ssl,
};

// Use testnet (Defaults to mainnet)
const network = ENetworks.testnet;

// Use a specific address type. (Defaults to EAddressType.p2wpkh)
const addressType = EAddressType.p2sh;

// Subscribe to server messages (TOnMessage)
const onMessage: TOnMessage = (id, data) => {
	console.log(id);
	console.dir(data, { depth: null });
}

// Persist sessions by getting and setting data from storage
const storage: TStorage = {
	async getData<K extends keyof IWalletData>(
		key: string
	): Promise<Result<IWalletData[K]>> {
		// Add your logic here
	},
	async setData<K extends keyof IWalletData>(
		key: string,
		value: IWalletData[K]
	): Promise<Result<boolean>> {
		// Add your logic here
	}
};

// Create a wallet instance
const createWalletRes = new Wallet({
	mnemonic,
	passphrase,
	electrumOptions: { server },
	network,
	onMessage,
	storage
});
if (createWalletRes.isErr()) return;
const wallet = createWalletRes.value;

// List UTXO's
const utxos = wallet.listUtxos();

// Send sats to multiple outputs
const txs = [
	{ address: 'address1', amount: 1000 },
	{ address: 'address2', amount: 2000 },
	{ address: 'address3', amount: 3000 },
];
const sendManyRes = await wallet.sendMany({ txs });
```

## Documentation
- [HTML](docs/html/classes/Wallet.html)
- [Markdown](docs/markdown/classes/Wallet.md)

## Support

If you are experiencing any problems, please open an issue and use the template provided, or reach out to us on [Telegram](https://t.me/bitkitchat).
