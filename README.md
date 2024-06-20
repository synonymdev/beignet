# Beignet

:warning: This is pre-alpha software and not suitable for production apps yet.

## Description

An instant, self-custodial Bitcoin wallet for JS devs.

This Typescript library offers JS developers a way to incorporate an on-chain, self-custodial Bitcoin wallet into their projects.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Running Tests & Examples](#running-tests--examples)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies & Build](#install-dependencies--build)
  - [Run Tests](#run-tests)
  - [Run Example Project](#run-example-project)
3. [Implementation](#implementation)
4. [Advanced Usage](#advanced-usage)
5. [Documentation](#documentation)
6. [Support](#support)

## Getting Started

```bash
# Using Yarn
yarn add beignet

# Or, using NPM
npm i -S beignet
```

## Running Tests & Examples

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
const createWalletRes = await Wallet.create({ mnemonic });
if (createWalletRes.isErr()) return;
const wallet = createWalletRes.value;

// View wallet data (addresses, indexes, utxos, transactions, etc.)
const walletData = wallet.data;
  
// Get receiving address
const address = await wallet.getAddress();

// Get address balance
const addressBalanceRes = await wallet.getAddressBalance(address);
if (addressBalance.isErr()) return;
const addressBalance = addressBalanceRes.value;

// Get wallet balance
const walletBalance = wallet.getBalance();

// Refresh Wallet
const walletRefresh = await wallet.refreshWallet();

// Get fee information to perform a transaction.
const feeInfo = wallet.getFeeInfo();

// Send sats
const sendRes = await wallet.send({ address: 'address to send sats to', amount: 1000, satPerByte: 2 });

// Send all sats to an address
const sendMaxRes = await wallet.sendMax({ address: 'address to send sats to', satPerByte: 2 });
```

## Advanced Usage

```typescript
import { Wallet, generateMnemonic } from 'beignet';
import net from 'net'
import tls from 'tls'
import { TStorage } from './wallet';

// Generate a mnemonic phrase
const mnemonic = generateMnemonic();

// Add a bip39 passphrase
const passphrase = 'passphrase';

// Connect to custom electrum server
const servers: TServer = {
	host: '35.233.47.252',
	ssl: 18484,
	tcp: 18483,
	protocol: EProtocol.ssl,
};

// Use a specific network (Defaults to mainnet)
const network = ENetworks.mainnet;

// Use a specific address type. (Defaults to EAddressType.p2wpkh)
const addressType = EAddressType.p2tr;

// Monitor certain address types. (Defaults to Object.values(EAddressType))
const addressTypesToMonitor = [EAddressType.p2tr, EAddressType.p2wpkh];

// Subscribe to server messages (TOnMessage)
const onMessage: TOnMessage = (id, data) => {
	console.log(id);
	console.dir(data, { depth: null });
}

// Disable startup messages. Messages resume once startup is complete. (Defaults to false)
const disableMessagesOnCreate = true;

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
const createWalletRes = await Wallet.create({
	mnemonic,
	passphrase,
	electrumOptions: {
		servers,
		net,
		tls
	},
	network,
	onMessage,
	storage, 
    addressType,
	addressTypesToMonitor,
	disableMessagesOnCreate
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

// Sweep from a private key
const sweepPrivateKeyRes = await wallet.sweepPrivateKey({
	privateKey: 'privateKey',
	toAddress: 'toAddress',
	satsPerByte: 5,
	broadcast: false
});

// Get tx history for a given address. { tx_hash: string; height: number; }[]
const history = await wallet.getAddressHistory('address');

// Get transaction details for a given transaction id. TTxDetails
const txDetails = await wallet.getTransactionDetails('txid');
```

## React Native

You can use `react-native-tcp-socket` as a drop in replacement for `net` & `tls` in a react-native environment. In `package.json`:

```json
"react-native": {
	"net": "react-native-tcp-socket",
	"tls": "react-native-tcp-socket"
}
```

## Documentation
- [HTML](docs/html/classes/Wallet.html)
- [Markdown](docs/markdown/classes/Wallet.md)

## Support

If you are experiencing any problems, please open an issue or reach out to us on [Telegram](https://t.me/bitkitchat).
