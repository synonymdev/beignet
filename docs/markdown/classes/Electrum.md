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
- [getAddressScriptHashesHistory](Electrum.md#getaddressscripthasheshistory)
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

[electrum/index.ts:78](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L78)

## Properties

### \_wallet

• `Private` `Readonly` **\_wallet**: [`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:64](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L64)

___

### batchDelay

• **batchDelay**: `number`

#### Defined in

[electrum/index.ts:77](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L77)

___

### batchLimit

• **batchLimit**: `number`

#### Defined in

[electrum/index.ts:76](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L76)

___

### connectedToElectrum

• **connectedToElectrum**: `boolean`

#### Defined in

[electrum/index.ts:74](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L74)

___

### connectionPollingInterval

• `Private` **connectionPollingInterval**: ``null`` \| `Timeout`

#### Defined in

[electrum/index.ts:67](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L67)

___

### electrumNetwork

• **electrumNetwork**: [`EElectrumNetworks`](../enums/EElectrumNetworks.md)

#### Defined in

[electrum/index.ts:73](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L73)

___

### latestConnectionState

• `Private` **latestConnectionState**: ``null`` \| `boolean` = `null`

#### Defined in

[electrum/index.ts:66](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L66)

___

### net

• `Private` **net**: `Server`

#### Defined in

[electrum/index.ts:69](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L69)

___

### network

• **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[electrum/index.ts:72](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L72)

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

[electrum/index.ts:75](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L75)

___

### sendMessage

• `Private` **sendMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[electrum/index.ts:65](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L65)

___

### servers

• `Optional` **servers**: [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[]

#### Defined in

[electrum/index.ts:71](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L71)

___

### tls

• `Private` **tls**: `TLSSocket`

#### Defined in

[electrum/index.ts:68](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L68)

## Accessors

### wallet

• `get` **wallet**(): [`Wallet`](Wallet.md)

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:119](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L119)

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

[electrum/index.ts:892](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L892)

___

### checkConnection

▸ `Private` **checkConnection**(): `Promise`<`void`\>

Attempts to check the current Electrum connection.

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:939](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L939)

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

[electrum/index.ts:123](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L123)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:977](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L977)

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

[electrum/index.ts:175](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L175)

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

[electrum/index.ts:263](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L263)

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

[electrum/index.ts:195](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L195)

___

### getAddressScriptHashesHistory

▸ **getAddressScriptHashesHistory**(`scriptHashes?`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressTxResponse`](../interfaces/IGetAddressTxResponse.md)\>\>

Returns an array of tx_hashes and their height for a given array of address script hashes.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scriptHashes` | `string`[] | `[]` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressTxResponse`](../interfaces/IGetAddressTxResponse.md)\>\>

#### Defined in

[electrum/index.ts:427](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L427)

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

[electrum/index.ts:690](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L690)

___

### getBlockHeader

▸ **getBlockHeader**(): [`IHeader`](../interfaces/IHeader.md)

Returns last known block height, and it's corresponding hex from local storage.

#### Returns

[`IHeader`](../interfaces/IHeader.md)

#### Defined in

[electrum/index.ts:706](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L706)

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

[electrum/index.ts:668](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L668)

___

### getConnectedPeer

▸ **getConnectedPeer**(): `Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

Returns currently connected peer.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

#### Defined in

[electrum/index.ts:208](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L208)

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

[electrum/index.ts:385](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L385)

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

[electrum/index.ts:746](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L746)

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

[electrum/index.ts:588](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L588)

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

[electrum/index.ts:715](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L715)

___

### getUtxos

▸ **getUtxos**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

Returns UTXO's for a given wallet and network along with the available balance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `addressIndex?` | `number` |
| › `addressTypesToCheck?` | [`EAddressType`](../enums/EAddressType.md)[] |
| › `changeAddressIndex?` | `number` |
| › `scanningStrategy?` | [`EScanningStrategy`](../enums/EScanningStrategy.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

#### Defined in

[electrum/index.ts:450](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L450)

___

### isConnected

▸ **isConnected**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[electrum/index.ts:165](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L165)

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

[electrum/index.ts:221](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L221)

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

[electrum/index.ts:966](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L966)

___

### startConnectionPolling

▸ **startConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:982](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L982)

___

### stopConnectionPolling

▸ **stopConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:990](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L990)

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

[electrum/index.ts:808](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L808)

___

### subscribeToHeader

▸ **subscribeToHeader**(): `Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

Subscribes to the current networks headers.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

#### Defined in

[electrum/index.ts:768](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L768)

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

[electrum/index.ts:645](https://github.com/synonymdev/beignet/blob/0e5dd24/src/electrum/index.ts#L645)
