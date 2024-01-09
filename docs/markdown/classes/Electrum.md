[beignet](../README.md) / Electrum

# Class: Electrum

## Table of contents

### Constructors

- [constructor](Electrum.md#constructor)

### Properties

- [\_wallet](Electrum.md#_wallet)
- [connectedToElectrum](Electrum.md#connectedtoelectrum)
- [connectionPollingInterval](Electrum.md#connectionpollinginterval)
- [electrumNetwork](Electrum.md#electrumnetwork)
- [latestConnectionState](Electrum.md#latestconnectionstate)
- [net](Electrum.md#net)
- [network](Electrum.md#network)
- [onMessage](Electrum.md#onmessage)
- [onReceive](Electrum.md#onreceive)
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
- [getElectrumNetwork](Electrum.md#getelectrumnetwork)
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
| › `net?` | `Server` |
| › `network` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |
| › `onReceive?` | (`data`: `unknown`) => `void` |
| › `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |
| › `tls?` | `TLSSocket` |
| › `wallet` | [`Wallet`](Wallet.md) |

#### Defined in

[electrum/index.ts:65](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L65)

## Properties

### \_wallet

• `Private` `Readonly` **\_wallet**: [`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:53](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L53)

___

### connectedToElectrum

• **connectedToElectrum**: `boolean`

#### Defined in

[electrum/index.ts:63](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L63)

___

### connectionPollingInterval

• `Private` **connectionPollingInterval**: ``null`` \| `Timeout`

#### Defined in

[electrum/index.ts:56](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L56)

___

### electrumNetwork

• `Readonly` **electrumNetwork**: [`EElectrumNetworks`](../enums/EElectrumNetworks.md)

#### Defined in

[electrum/index.ts:62](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L62)

___

### latestConnectionState

• `Private` **latestConnectionState**: ``null`` \| `boolean` = `null`

#### Defined in

[electrum/index.ts:55](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L55)

___

### net

• `Private` **net**: `Server`

#### Defined in

[electrum/index.ts:58](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L58)

___

### network

• `Readonly` **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[electrum/index.ts:61](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L61)

___

### onMessage

• `Private` **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[electrum/index.ts:54](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L54)

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

[electrum/index.ts:64](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L64)

___

### servers

• `Optional` **servers**: [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[]

#### Defined in

[electrum/index.ts:60](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L60)

___

### tls

• `Private` **tls**: `TLSSocket`

#### Defined in

[electrum/index.ts:57](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L57)

## Accessors

### wallet

• `get` **wallet**(): [`Wallet`](Wallet.md)

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:100](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L100)

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

[electrum/index.ts:753](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L753)

___

### checkConnection

▸ `Private` **checkConnection**(): `Promise`<`void`\>

Attempts to check the current Electrum connection.

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:800](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L800)

___

### connectToElectrum

▸ **connectToElectrum**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `network?` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |
| › `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[electrum/index.ts:104](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L104)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:838](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L838)

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

[electrum/index.ts:145](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L145)

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

[electrum/index.ts:251](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L251)

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

[electrum/index.ts:165](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L165)

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

[electrum/index.ts:584](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L584)

___

### getBlockHeader

▸ **getBlockHeader**(): [`IHeader`](../interfaces/IHeader.md)

Returns last known block height, and it's corresponding hex from local storage.

#### Returns

[`IHeader`](../interfaces/IHeader.md)

#### Defined in

[electrum/index.ts:600](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L600)

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

[electrum/index.ts:562](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L562)

___

### getConnectedPeer

▸ **getConnectedPeer**(): `Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

Returns currently connected peer.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

#### Defined in

[electrum/index.ts:178](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L178)

___

### getElectrumNetwork

▸ **getElectrumNetwork**(`network?`): [`EElectrumNetworks`](../enums/EElectrumNetworks.md)

Returns the network string for use with Electrum methods.

#### Parameters

| Name | Type |
| :------ | :------ |
| `network?` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |

#### Returns

[`EElectrumNetworks`](../enums/EElectrumNetworks.md)

#### Defined in

[electrum/index.ts:191](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L191)

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

[electrum/index.ts:365](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L365)

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

[electrum/index.ts:639](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L639)

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

[electrum/index.ts:483](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L483)

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

[electrum/index.ts:609](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L609)

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

[electrum/index.ts:407](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L407)

___

### isConnected

▸ **isConnected**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[electrum/index.ts:135](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L135)

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

[electrum/index.ts:209](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L209)

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

[electrum/index.ts:827](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L827)

___

### startConnectionPolling

▸ **startConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:843](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L843)

___

### stopConnectionPolling

▸ **stopConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:851](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L851)

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

[electrum/index.ts:696](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L696)

___

### subscribeToHeader

▸ **subscribeToHeader**(): `Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

Subscribes to the current networks headers.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

#### Defined in

[electrum/index.ts:661](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L661)

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

[electrum/index.ts:539](https://github.com/synonymdev/beignet/blob/583604f/src/electrum/index.ts#L539)
