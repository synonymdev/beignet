[beignet](../README.md) / Electrum

# Class: Electrum

## Table of contents

### Constructors

- [constructor](Electrum.md#constructor)

### Properties

- [connectedToElectrum](Electrum.md#connectedtoelectrum)
- [electrumNetwork](Electrum.md#electrumnetwork)
- [network](Electrum.md#network)
- [onReceive](Electrum.md#onreceive)
- [servers](Electrum.md#servers)
- [wallet](Electrum.md#wallet)

### Methods

- [broadcastTransaction](Electrum.md#broadcasttransaction)
- [connectToElectrum](Electrum.md#connecttoelectrum)
- [getAddressBalance](Electrum.md#getaddressbalance)
- [getAddressHistory](Electrum.md#getaddresshistory)
- [getBlockHashFromHex](Electrum.md#getblockhashfromhex)
- [getBlockHeader](Electrum.md#getblockheader)
- [getBlockHex](Electrum.md#getblockhex)
- [getElectrumNetwork](Electrum.md#getelectrumnetwork)
- [getTransactions](Electrum.md#gettransactions)
- [getTransactionsFromInputs](Electrum.md#gettransactionsfrominputs)
- [getUtxos](Electrum.md#getutxos)
- [isConnected](Electrum.md#isconnected)
- [listUnspentAddressScriptHashes](Electrum.md#listunspentaddressscripthashes)
- [onReceiveAddress](Electrum.md#onreceiveaddress)
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

[electrum/index.ts:57](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L57)

## Properties

### connectedToElectrum

• **connectedToElectrum**: `boolean`

#### Defined in

[electrum/index.ts:55](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L55)

___

### electrumNetwork

• **electrumNetwork**: [`TElectrumNetworks`](../README.md#telectrumnetworks)

#### Defined in

[electrum/index.ts:54](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L54)

___

### network

• **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[electrum/index.ts:53](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L53)

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

[electrum/index.ts:56](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L56)

___

### servers

• `Optional` **servers**: [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[]

#### Defined in

[electrum/index.ts:52](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L52)

___

### wallet

• `Private` **wallet**: [`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:50](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L50)

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

[electrum/index.ts:701](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L701)

___

### connectToElectrum

▸ **connectToElectrum**(`«destructured»`): `Promise`<[`IConnectToElectrumRes`](../interfaces/IConnectToElectrumRes.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `network` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |
| › `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Returns

`Promise`<[`IConnectToElectrumRes`](../interfaces/IConnectToElectrumRes.md)\>

#### Defined in

[electrum/index.ts:87](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L87)

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

[electrum/index.ts:123](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L123)

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

[electrum/index.ts:209](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L209)

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

[electrum/index.ts:513](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L513)

___

### getBlockHeader

▸ **getBlockHeader**(): [`IHeader`](../interfaces/IHeader.md)

Returns last known block height, and it's corresponding hex from local storage.

#### Returns

[`IHeader`](../interfaces/IHeader.md)

#### Defined in

[electrum/index.ts:529](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L529)

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

[electrum/index.ts:491](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L491)

___

### getElectrumNetwork

▸ **getElectrumNetwork**(`network?`): [`TElectrumNetworks`](../README.md#telectrumnetworks)

Returns the network string for use with Electrum methods.

#### Parameters

| Name | Type |
| :------ | :------ |
| `network?` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |

#### Returns

[`TElectrumNetworks`](../README.md#telectrumnetworks)

#### Defined in

[electrum/index.ts:148](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L148)

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

[electrum/index.ts:415](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L415)

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

[electrum/index.ts:538](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L538)

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

[electrum/index.ts:338](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L338)

___

### isConnected

▸ **isConnected**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[electrum/index.ts:113](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L113)

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

[electrum/index.ts:166](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L166)

___

### onReceiveAddress

▸ `Private` **onReceiveAddress**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:662](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L662)

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

[electrum/index.ts:602](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L602)

___

### subscribeToHeader

▸ **subscribeToHeader**(): `Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

Subscribes to the current networks headers.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

#### Defined in

[electrum/index.ts:567](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L567)

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

[electrum/index.ts:468](https://github.com/synonymdev/beignet/blob/6c60ef8/src/electrum/index.ts#L468)
