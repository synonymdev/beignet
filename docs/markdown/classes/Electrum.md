[beignet](../README.md) / Electrum

# Class: Electrum

## Table of contents

### Constructors

- [constructor](Electrum.md#constructor)

### Properties

- [\_wallet](Electrum.md#_wallet)
- [batchDelay](Electrum.md#batchdelay)
- [batchLimit](Electrum.md#batchlimit)
- [connectedToElectrum](Electrum.md#connectedtoelectrum)
- [connectionPollingInterval](Electrum.md#connectionpollinginterval)
- [electrumNetwork](Electrum.md#electrumnetwork)
- [latestConnectionState](Electrum.md#latestconnectionstate)
- [net](Electrum.md#net)
- [network](Electrum.md#network)
- [onReceive](Electrum.md#onreceive)
- [sendMessage](Electrum.md#sendmessage)
- [servers](Electrum.md#servers)
- [tls](Electrum.md#tls)

### Accessors

- [wallet](Electrum.md#wallet)

### Methods

- [broadcastTransaction](Electrum.md#broadcasttransaction)
- [checkConnection](Electrum.md#checkconnection)
- [connectToElectrum](Electrum.md#connecttoelectrum)
- [disconnect](Electrum.md#disconnect)
- [getAddressBalance](Electrum.md#getaddressbalance)
- [getAddressHistory](Electrum.md#getaddresshistory)
- [getAddressScriptHashBalances](Electrum.md#getaddressscripthashbalances)
- [getBlockHashFromHex](Electrum.md#getblockhashfromhex)
- [getBlockHeader](Electrum.md#getblockheader)
- [getBlockHex](Electrum.md#getblockhex)
- [getConnectedPeer](Electrum.md#getconnectedpeer)
- [getScriptPubKeyHistory](Electrum.md#getscriptpubkeyhistory)
- [getTransactionMerkle](Electrum.md#gettransactionmerkle)
- [getTransactions](Electrum.md#gettransactions)
- [getTransactionsFromInputs](Electrum.md#gettransactionsfrominputs)
- [getUtxos](Electrum.md#getutxos)
- [isConnected](Electrum.md#isconnected)
- [listUnspentAddressScriptHashes](Electrum.md#listunspentaddressscripthashes)
- [publishConnectionChange](Electrum.md#publishconnectionchange)
- [startConnectionPolling](Electrum.md#startconnectionpolling)
- [stopConnectionPolling](Electrum.md#stopconnectionpolling)
- [subscribeToAddresses](Electrum.md#subscribetoaddresses)
- [subscribeToHeader](Electrum.md#subscribetoheader)
- [transactionExists](Electrum.md#transactionexists)

## Constructors

### constructor

• **new Electrum**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `batchDelay?` | `number` |
| › `batchLimit?` | `number` |
| › `net?` | `Server` |
| › `network` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |
| › `onReceive?` | (`data`: `unknown`) => `void` |
| › `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |
| › `tls?` | `TLSSocket` |
| › `wallet` | [`Wallet`](Wallet.md) |

#### Defined in

[electrum/index.ts:73](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L73)

## Properties

### \_wallet

• `Private` `Readonly` **\_wallet**: [`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:59](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L59)

___

### batchDelay

• **batchDelay**: `number`

#### Defined in

[electrum/index.ts:72](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L72)

___

### batchLimit

• **batchLimit**: `number`

#### Defined in

[electrum/index.ts:71](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L71)

___

### connectedToElectrum

• **connectedToElectrum**: `boolean`

#### Defined in

[electrum/index.ts:69](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L69)

___

### connectionPollingInterval

• `Private` **connectionPollingInterval**: ``null`` \| `Timeout`

#### Defined in

[electrum/index.ts:62](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L62)

___

### electrumNetwork

• **electrumNetwork**: [`EElectrumNetworks`](../enums/EElectrumNetworks.md)

#### Defined in

[electrum/index.ts:68](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L68)

___

### latestConnectionState

• `Private` **latestConnectionState**: ``null`` \| `boolean` = `null`

#### Defined in

[electrum/index.ts:61](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L61)

___

### net

• `Private` **net**: `Server`

#### Defined in

[electrum/index.ts:64](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L64)

___

### network

• **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[electrum/index.ts:67](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L67)

___

### onReceive

• `Optional` **onReceive**: (`data`: `unknown`) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `unknown` |

##### Returns

`void`

#### Defined in

[electrum/index.ts:70](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L70)

___

### sendMessage

• `Private` **sendMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[electrum/index.ts:60](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L60)

___

### servers

• `Optional` **servers**: [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[]

#### Defined in

[electrum/index.ts:66](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L66)

___

### tls

• `Private` **tls**: `TLSSocket`

#### Defined in

[electrum/index.ts:63](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L63)

## Accessors

### wallet

• `get` **wallet**(): [`Wallet`](Wallet.md)

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:114](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L114)

## Methods

### broadcastTransaction

▸ **broadcastTransaction**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `rawTx` | `string` |
| › `subscribeToOutputAddress?` | `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[electrum/index.ts:763](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L763)

___

### checkConnection

▸ `Private` **checkConnection**(): `Promise`<`void`\>

Attempts to check the current Electrum connection.

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:810](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L810)

___

### connectToElectrum

▸ **connectToElectrum**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `disableRegtestCheck?` | `boolean` |
| › `network?` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |
| › `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[electrum/index.ts:118](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L118)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:848](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L848)

___

### getAddressBalance

▸ **getAddressBalance**(`scriptHash`): `Promise`<[`IElectrumGetAddressBalanceRes`](../interfaces/IElectrumGetAddressBalanceRes.md)\>

Returns the balance in sats for a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`Promise`<[`IElectrumGetAddressBalanceRes`](../interfaces/IElectrumGetAddressBalanceRes.md)\>

#### Defined in

[electrum/index.ts:170](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L170)

___

### getAddressHistory

▸ **getAddressHistory**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressHistoryResponse`](../interfaces/IGetAddressHistoryResponse.md)[]\>\>

Returns the available history for the provided address script hashes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `scanAllAddresses?` | `boolean` |
| › `scriptHashes?` | [`IAddress`](../interfaces/IAddress.md)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressHistoryResponse`](../interfaces/IGetAddressHistoryResponse.md)[]\>\>

#### Defined in

[electrum/index.ts:258](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L258)

___

### getAddressScriptHashBalances

▸ **getAddressScriptHashBalances**(`scriptHashes`): `Promise`<[`IGetAddressScriptHashBalances`](../interfaces/IGetAddressScriptHashBalances.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHashes` | `string`[] |

#### Returns

`Promise`<[`IGetAddressScriptHashBalances`](../interfaces/IGetAddressScriptHashBalances.md)\>

#### Defined in

[electrum/index.ts:190](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L190)

___

### getBlockHashFromHex

▸ **getBlockHashFromHex**(`«destructured»?`): `string`

Returns the block hash given a block hex.
Leaving blockHex empty will return the last known block hash from storage.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `blockHex?` | `string` |

#### Returns

`string`

#### Defined in

[electrum/index.ts:594](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L594)

___

### getBlockHeader

▸ **getBlockHeader**(): [`IHeader`](../interfaces/IHeader.md)

Returns last known block height, and it's corresponding hex from local storage.

#### Returns

[`IHeader`](../interfaces/IHeader.md)

#### Defined in

[electrum/index.ts:610](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L610)

___

### getBlockHex

▸ **getBlockHex**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Returns the block hex of the provided block height.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `height?` | `number` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[electrum/index.ts:572](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L572)

___

### getConnectedPeer

▸ **getConnectedPeer**(): `Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

Returns currently connected peer.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

#### Defined in

[electrum/index.ts:203](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L203)

___

### getScriptPubKeyHistory

▸ **getScriptPubKeyHistory**(`scriptPubkey`): `Promise`<[`TGetAddressHistory`](../README.md#tgetaddresshistory)[]\>

Used to retrieve scriptPubkey history for LDK.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptPubkey` | `string` |

#### Returns

`Promise`<[`TGetAddressHistory`](../README.md#tgetaddresshistory)[]\>

#### Defined in

[electrum/index.ts:374](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L374)

___

### getTransactionMerkle

▸ **getTransactionMerkle**(`«destructured»`): `Promise`<{ `block_height`: `number` ; `merkle`: `string`[] ; `pos`: `number`  }\>

Returns the merkle branch to a confirmed transaction given its hash and height.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `height` | `number` |
| › `tx_hash` | `string` |

#### Returns

`Promise`<{ `block_height`: `number` ; `merkle`: `string`[] ; `pos`: `number`  }\>

#### Defined in

[electrum/index.ts:649](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L649)

___

### getTransactions

▸ **getTransactions**(`txHashes`): `Promise`<[`Result`](../README.md#result)<[`IGetTransactions`](../interfaces/IGetTransactions.md)\>\>

Returns available transactions from electrum based on the provided txHashes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHashes` | `Object` |
| `txHashes.txHashes` | [`ITxHash`](../interfaces/ITxHash.md)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetTransactions`](../interfaces/IGetTransactions.md)\>\>

#### Defined in

[electrum/index.ts:492](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L492)

___

### getTransactionsFromInputs

▸ **getTransactionsFromInputs**(`txHashes`): `Promise`<[`Result`](../README.md#result)<[`IGetTransactionsFromInputs`](../interfaces/IGetTransactionsFromInputs.md)\>\>

Returns transactions associated with the provided transaction hashes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHashes` | `Object` |
| `txHashes.txHashes` | [`ITxHash`](../interfaces/ITxHash.md)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetTransactionsFromInputs`](../interfaces/IGetTransactionsFromInputs.md)\>\>

#### Defined in

[electrum/index.ts:619](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L619)

___

### getUtxos

▸ **getUtxos**(`scanAllAddresses?`): `Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

Returns UTXO's for a given wallet and network along with the available balance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scanAllAddresses?` | `Object` |
| `scanAllAddresses.scanAllAddresses?` | `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

#### Defined in

[electrum/index.ts:416](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L416)

___

### isConnected

▸ **isConnected**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[electrum/index.ts:160](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L160)

___

### listUnspentAddressScriptHashes

▸ **listUnspentAddressScriptHashes**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

Queries Electrum to return the available UTXO's and balance of the provided addresses.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `addresses` | [`TUnspentAddressScriptHashData`](../README.md#tunspentaddressscripthashdata) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

#### Defined in

[electrum/index.ts:216](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L216)

___

### publishConnectionChange

▸ `Private` **publishConnectionChange**(`isConnected`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `isConnected` | `boolean` |

#### Returns

`void`

#### Defined in

[electrum/index.ts:837](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L837)

___

### startConnectionPolling

▸ **startConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:853](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L853)

___

### stopConnectionPolling

▸ **stopConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:861](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L861)

___

### subscribeToAddresses

▸ **subscribeToAddresses**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Subscribes to a number of address script hashes for receiving.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `onReceive?` | (`data`: [`TSubscribedReceive`](../README.md#tsubscribedreceive)) => `void` |
| › `scriptHashes?` | `string`[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[electrum/index.ts:706](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L706)

___

### subscribeToHeader

▸ **subscribeToHeader**(): `Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

Subscribes to the current networks headers.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

#### Defined in

[electrum/index.ts:671](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L671)

___

### transactionExists

▸ **transactionExists**(`txData`): `boolean`

Determines whether a transaction exists based on the transaction response from electrum.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`ITransaction`](../interfaces/ITransaction.md)<[`IUtxo`](../interfaces/IUtxo.md)\> |

#### Returns

`boolean`

#### Defined in

[electrum/index.ts:549](https://github.com/synonymdev/beignet/blob/05d5011/src/electrum/index.ts#L549)
