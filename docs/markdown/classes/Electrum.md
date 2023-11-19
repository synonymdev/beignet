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
- [network](Electrum.md#network)
- [onElectrumConnectionChange](Electrum.md#onelectrumconnectionchange)
- [onMessage](Electrum.md#onmessage)
- [onReceive](Electrum.md#onreceive)
- [servers](Electrum.md#servers)

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
- [onReceiveAddress](Electrum.md#onreceiveaddress)
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

[electrum/index.ts:64](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L64)

## Properties

### \_wallet

• `Private` `Readonly` **\_wallet**: [`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:53](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L53)

___

### connectedToElectrum

• **connectedToElectrum**: `boolean`

#### Defined in

[electrum/index.ts:61](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L61)

___

### connectionPollingInterval

• `Private` **connectionPollingInterval**: ``null`` \| `Timeout`

#### Defined in

[electrum/index.ts:56](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L56)

___

### electrumNetwork

• `Readonly` **electrumNetwork**: [`TElectrumNetworks`](../README.md#telectrumnetworks)

#### Defined in

[electrum/index.ts:60](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L60)

___

### latestConnectionState

• `Private` **latestConnectionState**: ``null`` \| `boolean` = `null`

#### Defined in

[electrum/index.ts:55](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L55)

___

### network

• `Readonly` **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[electrum/index.ts:59](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L59)

___

### onElectrumConnectionChange

• `Optional` **onElectrumConnectionChange**: (`isConnected`: `boolean`) => `void`

#### Type declaration

▸ (`isConnected`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `isConnected` | `boolean` |

##### Returns

`void`

#### Defined in

[electrum/index.ts:63](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L63)

___

### onMessage

• `Private` **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[electrum/index.ts:54](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L54)

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

[electrum/index.ts:62](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L62)

___

### servers

• `Optional` **servers**: [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[]

#### Defined in

[electrum/index.ts:58](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L58)

## Accessors

### wallet

• `get` **wallet**(): [`Wallet`](Wallet.md)

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[electrum/index.ts:99](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L99)

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

[electrum/index.ts:782](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L782)

___

### checkConnection

▸ `Private` **checkConnection**(): `Promise`<`void`\>

Attempts to check the current Electrum connection.

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:824](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L824)

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

[electrum/index.ts:103](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L103)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[electrum/index.ts:856](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L856)

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

[electrum/index.ts:143](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L143)

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

[electrum/index.ts:247](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L247)

___

### getAddressScriptHashBalances

▸ **getAddressScriptHashBalances**(`scriptHashes`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHashes` | `string`[] |

#### Returns

`Promise`<`any`\>

#### Defined in

[electrum/index.ts:163](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L163)

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

[electrum/index.ts:573](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L573)

___

### getBlockHeader

▸ **getBlockHeader**(): [`IHeader`](../interfaces/IHeader.md)

Returns last known block height, and it's corresponding hex from local storage.

#### Returns

[`IHeader`](../interfaces/IHeader.md)

#### Defined in

[electrum/index.ts:589](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L589)

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

[electrum/index.ts:551](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L551)

___

### getConnectedPeer

▸ **getConnectedPeer**(): `Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

Returns currently connected peer.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IPeerData`](../interfaces/IPeerData.md)\>\>

#### Defined in

[electrum/index.ts:174](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L174)

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

[electrum/index.ts:187](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L187)

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

[electrum/index.ts:358](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L358)

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

[electrum/index.ts:628](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L628)

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

[electrum/index.ts:476](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L476)

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

[electrum/index.ts:598](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L598)

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

[electrum/index.ts:400](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L400)

___

### isConnected

▸ **isConnected**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[electrum/index.ts:133](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L133)

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

[electrum/index.ts:205](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L205)

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

[electrum/index.ts:743](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L743)

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

[electrum/index.ts:844](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L844)

___

### startConnectionPolling

▸ **startConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:861](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L861)

___

### stopConnectionPolling

▸ **stopConnectionPolling**(): `void`

#### Returns

`void`

#### Defined in

[electrum/index.ts:869](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L869)

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

[electrum/index.ts:685](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L685)

___

### subscribeToHeader

▸ **subscribeToHeader**(): `Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

Subscribes to the current networks headers.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IHeader`](../interfaces/IHeader.md)\>\>

#### Defined in

[electrum/index.ts:650](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L650)

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

[electrum/index.ts:528](https://github.com/synonymdev/beignet/blob/e4162f7/src/electrum/index.ts#L528)
