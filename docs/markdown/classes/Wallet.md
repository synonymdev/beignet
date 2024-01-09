[beignet](../README.md) / Wallet

# Class: Wallet

## Table of contents

### Constructors

- [constructor](Wallet.md#constructor)

### Properties

- [\_customGetAddress](Wallet.md#_customgetaddress)
- [\_customGetScriptHash](Wallet.md#_customgetscripthash)
- [\_data](Wallet.md#_data)
- [\_getData](Wallet.md#_getdata)
- [\_mnemonic](Wallet.md#_mnemonic)
- [\_network](Wallet.md#_network)
- [\_passphrase](Wallet.md#_passphrase)
- [\_pendingRefreshPromises](Wallet.md#_pendingrefreshpromises)
- [\_root](Wallet.md#_root)
- [\_seed](Wallet.md#_seed)
- [\_setData](Wallet.md#_setdata)
- [electrum](Wallet.md#electrum)
- [electrumOptions](Wallet.md#electrumoptions)
- [exchangeRates](Wallet.md#exchangerates)
- [feeEstimates](Wallet.md#feeestimates)
- [id](Wallet.md#id)
- [isRefreshing](Wallet.md#isrefreshing)
- [isSwitchingNetworks](Wallet.md#isswitchingnetworks)
- [name](Wallet.md#name)
- [onMessage](Wallet.md#onmessage)
- [rbf](Wallet.md#rbf)
- [savingOperations](Wallet.md#savingoperations)
- [selectedFeeId](Wallet.md#selectedfeeid)
- [transaction](Wallet.md#transaction)

### Accessors

- [data](Wallet.md#data)
- [network](Wallet.md#network)

### Methods

- [\_getAddress](Wallet.md#_getaddress)
- [\_handleRefreshError](Wallet.md#_handlerefresherror)
- [\_resolveAllPendingRefreshPromises](Wallet.md#_resolveallpendingrefreshpromises)
- [addAddresses](Wallet.md#addaddresses)
- [addBoostedTransaction](Wallet.md#addboostedtransaction)
- [addGhostTransaction](Wallet.md#addghosttransaction)
- [addTxInput](Wallet.md#addtxinput)
- [addTxTag](Wallet.md#addtxtag)
- [addUnconfirmedTransactions](Wallet.md#addunconfirmedtransactions)
- [blockHeightToConfirmations](Wallet.md#blockheighttoconfirmations)
- [checkElectrumConnection](Wallet.md#checkelectrumconnection)
- [checkUnconfirmedTransactions](Wallet.md#checkunconfirmedtransactions)
- [clearAddresses](Wallet.md#clearaddresses)
- [clearTransactions](Wallet.md#cleartransactions)
- [clearUtxos](Wallet.md#clearutxos)
- [confirmationsToBlockHeight](Wallet.md#confirmationstoblockheight)
- [connectToElectrum](Wallet.md#connecttoelectrum)
- [deleteOnChainTransactionById](Wallet.md#deleteonchaintransactionbyid)
- [formatTransactions](Wallet.md#formattransactions)
- [generateAddresses](Wallet.md#generateaddresses)
- [generateNewReceiveAddress](Wallet.md#generatenewreceiveaddress)
- [getAddress](Wallet.md#getaddress)
- [getAddressBalance](Wallet.md#getaddressbalance)
- [getAddressByPath](Wallet.md#getaddressbypath)
- [getAddressFromScriptHash](Wallet.md#getaddressfromscripthash)
- [getAddressIndexInfo](Wallet.md#getaddressindexinfo)
- [getAddressesBalance](Wallet.md#getaddressesbalance)
- [getBalance](Wallet.md#getbalance)
- [getBip32Interface](Wallet.md#getbip32interface)
- [getBitcoinNetwork](Wallet.md#getbitcoinnetwork)
- [getBoostableTransactions](Wallet.md#getboostabletransactions)
- [getBoostedTransactionParents](Wallet.md#getboostedtransactionparents)
- [getBoostedTransactions](Wallet.md#getboostedtransactions)
- [getChangeAddress](Wallet.md#getchangeaddress)
- [getExchangeRate](Wallet.md#getexchangerate)
- [getFeeEstimates](Wallet.md#getfeeestimates)
- [getFeeInfo](Wallet.md#getfeeinfo)
- [getGapLimit](Wallet.md#getgaplimit)
- [getHighestStoredAddressIndex](Wallet.md#gethigheststoredaddressindex)
- [getInputData](Wallet.md#getinputdata)
- [getNextAvailableAddress](Wallet.md#getnextavailableaddress)
- [getPrivateKey](Wallet.md#getprivatekey)
- [getRbfData](Wallet.md#getrbfdata)
- [getReceiveAddress](Wallet.md#getreceiveaddress)
- [getScriptHash](Wallet.md#getscripthash)
- [getScriptHashBalance](Wallet.md#getscripthashbalance)
- [getUnconfirmedTransactions](Wallet.md#getunconfirmedtransactions)
- [getUtxos](Wallet.md#getutxos)
- [getWalletData](Wallet.md#getwalletdata)
- [getWalletDataKey](Wallet.md#getwalletdatakey)
- [isValid](Wallet.md#isvalid)
- [listUtxos](Wallet.md#listutxos)
- [processUnconfirmedTransactions](Wallet.md#processunconfirmedtransactions)
- [refreshWallet](Wallet.md#refreshwallet)
- [removeDuplicateAddresses](Wallet.md#removeduplicateaddresses)
- [removeTxInput](Wallet.md#removetxinput)
- [removeTxTag](Wallet.md#removetxtag)
- [rescanAddresses](Wallet.md#rescanaddresses)
- [resetAddressIndexes](Wallet.md#resetaddressindexes)
- [resetSendTransaction](Wallet.md#resetsendtransaction)
- [saveWalletData](Wallet.md#savewalletdata)
- [send](Wallet.md#send)
- [sendMany](Wallet.md#sendmany)
- [sendMax](Wallet.md#sendmax)
- [setWalletData](Wallet.md#setwalletdata)
- [setZeroIndexAddresses](Wallet.md#setzeroindexaddresses)
- [setupFeeForOnChainTransaction](Wallet.md#setupfeeforonchaintransaction)
- [setupTransaction](Wallet.md#setuptransaction)
- [storageIdCheck](Wallet.md#storageidcheck)
- [switchNetwork](Wallet.md#switchnetwork)
- [updateAddressIndex](Wallet.md#updateaddressindex)
- [updateAddressIndexes](Wallet.md#updateaddressindexes)
- [updateAddressType](Wallet.md#updateaddresstype)
- [updateAndSaveWalletData](Wallet.md#updateandsavewalletdata)
- [updateExchangeRates](Wallet.md#updateexchangerates)
- [updateFeeEstimates](Wallet.md#updatefeeestimates)
- [updateGhostTransactions](Wallet.md#updateghosttransactions)
- [updateHeader](Wallet.md#updateheader)
- [updateTransactionHeights](Wallet.md#updatetransactionheights)
- [updateTransactions](Wallet.md#updatetransactions)
- [updateWalletBalance](Wallet.md#updatewalletbalance)
- [validateAddress](Wallet.md#validateaddress)
- [create](Wallet.md#create)

## Constructors

### constructor

• `Private` **new Wallet**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IWallet`](../interfaces/IWallet.md) |

#### Defined in

[wallet/index.ts:138](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L138)

## Properties

### \_customGetAddress

• `Private` `Optional` **\_customGetAddress**: (`data`: [`ICustomGetAddress`](../interfaces/ICustomGetAddress.md)) => `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

#### Type declaration

▸ (`data`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetAddress`](../interfaces/ICustomGetAddress.md) |

##### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

#### Defined in

[wallet/index.ts:112](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L112)

___

### \_customGetScriptHash

• `Private` `Optional` **\_customGetScriptHash**: (`data`: [`ICustomGetScriptHash`](../interfaces/ICustomGetScriptHash.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`data`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetScriptHash`](../interfaces/ICustomGetScriptHash.md) |

##### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:115](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L115)

___

### \_data

• `Private` **\_data**: [`IWalletData`](../interfaces/IWalletData.md)

#### Defined in

[wallet/index.ts:109](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L109)

___

### \_getData

• `Private` **\_getData**: [`TGetData`](../README.md#tgetdata)

#### Defined in

[wallet/index.ts:110](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L110)

___

### \_mnemonic

• `Private` `Readonly` **\_mnemonic**: `string`

#### Defined in

[wallet/index.ts:105](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L105)

___

### \_network

• `Private` **\_network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[wallet/index.ts:104](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L104)

___

### \_passphrase

• `Private` `Readonly` **\_passphrase**: `string`

#### Defined in

[wallet/index.ts:106](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L106)

___

### \_pendingRefreshPromises

• `Private` **\_pendingRefreshPromises**: (`result`: [`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>) => `void`[] = `[]`

#### Defined in

[wallet/index.ts:118](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L118)

___

### \_root

• `Private` `Readonly` **\_root**: `BIP32Interface`

#### Defined in

[wallet/index.ts:108](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L108)

___

### \_seed

• `Private` `Readonly` **\_seed**: `Buffer`

#### Defined in

[wallet/index.ts:107](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L107)

___

### \_setData

• `Private` `Optional` **\_setData**: [`TSetData`](../README.md#tsetdata)

#### Defined in

[wallet/index.ts:111](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L111)

___

### electrum

• **electrum**: [`Electrum`](Electrum.md)

#### Defined in

[wallet/index.ts:131](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L131)

___

### electrumOptions

• `Optional` **electrumOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `net?` | `Server` |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |
| `tls?` | `TLSSocket` |

#### Defined in

[wallet/index.ts:126](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L126)

___

### exchangeRates

• **exchangeRates**: [`IExchangeRates`](../interfaces/IExchangeRates.md)

#### Defined in

[wallet/index.ts:132](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L132)

___

### feeEstimates

• **feeEstimates**: [`IOnchainFees`](../interfaces/IOnchainFees.md)

#### Defined in

[wallet/index.ts:135](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L135)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[wallet/index.ts:124](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L124)

___

### isRefreshing

• **isRefreshing**: `boolean`

#### Defined in

[wallet/index.ts:122](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L122)

___

### isSwitchingNetworks

• **isSwitchingNetworks**: `boolean`

#### Defined in

[wallet/index.ts:123](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L123)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[wallet/index.ts:125](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L125)

___

### onMessage

• **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[wallet/index.ts:133](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L133)

___

### rbf

• **rbf**: `boolean`

#### Defined in

[wallet/index.ts:136](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L136)

___

### savingOperations

• `Private` **savingOperations**: `Record`<`string`, `Promise`<`string`\>\> = `{}`

Saves the wallet data object to storage if able.

**`Async`**

**`Param`**

**`Param`**

#### Defined in

[wallet/index.ts:1673](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1673)

___

### selectedFeeId

• **selectedFeeId**: [`EFeeId`](../enums/EFeeId.md)

#### Defined in

[wallet/index.ts:137](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L137)

___

### transaction

• **transaction**: [`Transaction`](Transaction.md)

#### Defined in

[wallet/index.ts:134](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L134)

## Accessors

### data

• `get` **data**(): [`IWalletData`](../interfaces/IWalletData.md)

#### Returns

[`IWalletData`](../interfaces/IWalletData.md)

#### Defined in

[wallet/index.ts:191](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L191)

___

### network

• `get` **network**(): [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Returns

[`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[wallet/index.ts:195](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L195)

## Methods

### \_getAddress

▸ `Private` **_getAddress**(`path`, `addressType`): `Promise`<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>

Returns the address for the specified path and address type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `addressType` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>

#### Defined in

[wallet/index.ts:486](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L486)

___

### \_handleRefreshError

▸ `Private` **_handleRefreshError**(`errorMessage`): [`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorMessage` | `string` |

#### Returns

[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>

#### Defined in

[wallet/index.ts:310](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L310)

___

### \_resolveAllPendingRefreshPromises

▸ `Private` **_resolveAllPendingRefreshPromises**(`result`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | [`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\> |

#### Returns

`void`

#### Defined in

[wallet/index.ts:300](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L300)

___

### addAddresses

▸ `Private` **addAddresses**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<[`IGenerateAddressesResponse`](../interfaces/IGenerateAddressesResponse.md)\>\>

This method will generate addresses as specified and return an object of filtered addresses to ensure no duplicates are returned.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IGenerateAddresses`](../interfaces/IGenerateAddresses.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGenerateAddressesResponse`](../interfaces/IGenerateAddressesResponse.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1223](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1223)

___

### addBoostedTransaction

▸ **addBoostedTransaction**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<[`IBoostedTransaction`](../interfaces/IBoostedTransaction.md)\>\>

Adds a boosted transaction id to the boostedTransactions object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `fee` | `number` |
| › `newTxId` | `string` |
| › `oldTxId` | `string` |
| › `type?` | [`EBoostType`](../enums/EBoostType.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IBoostedTransaction`](../interfaces/IBoostedTransaction.md)\>\>

#### Defined in

[wallet/index.ts:3114](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3114)

___

### addGhostTransaction

▸ **addGhostTransaction**(`txid`): `Promise`<`void`\>

Sets "exists" to false for a given on-chain transaction id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `Object` |
| `txid.txid` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:3099](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3099)

___

### addTxInput

▸ **addTxInput**(`input`): [`Result`](../README.md#result)<[`IUtxo`](../interfaces/IUtxo.md)[]\>

Adds a specified input to the current transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.input` | [`IUtxo`](../interfaces/IUtxo.md) |

#### Returns

[`Result`](../README.md#result)<[`IUtxo`](../interfaces/IUtxo.md)[]\>

#### Defined in

[wallet/index.ts:3231](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3231)

___

### addTxTag

▸ **addTxTag**(`tag`): [`Result`](../README.md#result)<`string`\>

Adds a specified tag to the current transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Object` |
| `tag.tag` | `string` |

#### Returns

[`Result`](../README.md#result)<`string`\>

#### Defined in

[wallet/index.ts:3282](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3282)

___

### addUnconfirmedTransactions

▸ `Private` **addUnconfirmedTransactions**(`transactions`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Parses and adds unconfirmed transactions to the store.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `Object` |
| `transactions.transactions` | [`IFormattedTransactions`](../interfaces/IFormattedTransactions.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2141](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2141)

___

### blockHeightToConfirmations

▸ **blockHeightToConfirmations**(`«destructured»`): `number`

Returns the number of confirmations for a given block height.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `blockHeight?` | `number` |
| › `currentHeight?` | `number` |

#### Returns

`number`

#### Defined in

[wallet/index.ts:2183](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2183)

___

### checkElectrumConnection

▸ **checkElectrumConnection**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Ensures the connection to Electrum is still available.
Will attempt to reconnect if not initially available.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:851](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L851)

___

### checkUnconfirmedTransactions

▸ `Private` **checkUnconfirmedTransactions**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Checks existing unconfirmed transactions that have been received and removes any that have >= 6 confirmations.
If the tx is reorg'd or bumped from the mempool and no longer exists, the transaction
will be removed from the store and updated in the activity list.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1846](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1846)

___

### clearAddresses

▸ `Private` **clearAddresses**(): `Promise`<`string`\>

Clears the addresses and changeAddresses object for a given wallet and network.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:2101](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2101)

___

### clearTransactions

▸ `Private` **clearTransactions**(): `Promise`<`string`\>

Clears the transactions object for a given wallet and network from storage.

#### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:2089](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2089)

___

### clearUtxos

▸ **clearUtxos**(): `Promise`<`string`\>

Clears the UTXO array and balance from storage.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:2074](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2074)

___

### confirmationsToBlockHeight

▸ **confirmationsToBlockHeight**(`«destructured»`): `number`

Returns the block height for a given number of confirmations from storage.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `confirmations` | `number` |
| › `currentHeight?` | `number` |

#### Returns

`number`

#### Defined in

[wallet/index.ts:1969](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1969)

___

### connectToElectrum

▸ **connectToElectrum**(`servers?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Attempts to connect to the specified Electrum server(s).

#### Parameters

| Name | Type |
| :------ | :------ |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:612](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L612)

___

### deleteOnChainTransactionById

▸ **deleteOnChainTransactionById**(`txid`): `Promise`<`void`\>

Deletes a given on-chain transaction by id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `Object` |
| `txid.txid` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:3083](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3083)

___

### formatTransactions

▸ **formatTransactions**(`transactions`): `Promise`<[`Result`](../README.md#result)<[`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)\>\>

Formats the provided transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `Object` |
| `transactions.transactions` | [`ITransaction`](../interfaces/ITransaction.md)<[`IUtxo`](../interfaces/IUtxo.md)\>[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2209](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2209)

___

### generateAddresses

▸ **generateAddresses**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<[`IGenerateAddressesResponse`](../interfaces/IGenerateAddressesResponse.md)\>\>

Generates a series of addresses based on the specified params.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IGenerateAddresses`](../interfaces/IGenerateAddresses.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGenerateAddressesResponse`](../interfaces/IGenerateAddressesResponse.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:743](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L743)

___

### generateNewReceiveAddress

▸ **generateNewReceiveAddress**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

Generate a new receive address for the provided addresstype up to the set gap limit.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `addressType?` | [`EAddressType`](../enums/EAddressType.md) |
| › `keyDerivationPath?` | [`IKeyDerivationPath`](../interfaces/IKeyDerivationPath.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1515](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1515)

___

### getAddress

▸ **getAddress**(`«destructured»?`): `Promise`<`string`\>

Returns a single Bitcoin address based on the provided address type,
index and whether it is a change address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IGetAddress`](../interfaces/IGetAddress.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:552](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L552)

___

### getAddressBalance

▸ **getAddressBalance**(`address`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressBalanceRes`](../interfaces/IGetAddressBalanceRes.md)\>\>

Returns the address balance for the specified address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressBalanceRes`](../interfaces/IGetAddressBalanceRes.md)\>\>

#### Defined in

[wallet/index.ts:633](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L633)

___

### getAddressByPath

▸ **getAddressByPath**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

Get address for a given keyPair, network and type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IGetAddressByPath`](../interfaces/IGetAddressByPath.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

#### Defined in

[wallet/index.ts:586](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L586)

___

### getAddressFromScriptHash

▸ **getAddressFromScriptHash**(`scriptHash`): `undefined` \| [`IAddress`](../interfaces/IAddress.md)

Returns the address from a provided script hash in storage.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`undefined` \| [`IAddress`](../interfaces/IAddress.md)

#### Defined in

[wallet/index.ts:2715](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2715)

___

### getAddressIndexInfo

▸ **getAddressIndexInfo**(): [`TAddressIndexInfo`](../README.md#taddressindexinfo)

Returns current address index information.

#### Returns

[`TAddressIndexInfo`](../README.md#taddressindexinfo)

#### Defined in

[wallet/index.ts:2831](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2831)

___

### getAddressesBalance

▸ **getAddressesBalance**(`addresses?`): `Promise`<[`Result`](../README.md#result)<`number`\>\>

Returns combined balance of provided addresses.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `addresses` | `string`[] | `[]` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`number`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:651](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L651)

___

### getBalance

▸ **getBalance**(): `number`

Returns the known balance from storage.

#### Returns

`number`

#### Defined in

[wallet/index.ts:727](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L727)

___

### getBip32Interface

▸ **getBip32Interface**(): `Promise`<[`Result`](../README.md#result)<`BIP32Interface`\>\>

Creates a BIP32Interface from the selected wallet's mnemonic and passphrase

#### Returns

`Promise`<[`Result`](../README.md#result)<`BIP32Interface`\>\>

#### Defined in

[wallet/index.ts:3215](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3215)

___

### getBitcoinNetwork

▸ `Private` **getBitcoinNetwork**(`network?`): `Network`

Returns the Network object of the currently selected network (bitcoin or testnet).

#### Parameters

| Name | Type |
| :------ | :------ |
| `network?` | [`TAvailableNetworks`](../README.md#tavailablenetworks) |

#### Returns

`Network`

#### Defined in

[wallet/index.ts:465](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L465)

___

### getBoostableTransactions

▸ **getBoostableTransactions**(): `Object`

Returns an array of transactions that can be boosted with cpfp and rbf.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cpfp` | [`IFormattedTransaction`](../interfaces/IFormattedTransaction.md)[] |
| `rbf` | [`IFormattedTransaction`](../interfaces/IFormattedTransaction.md)[] |

#### Defined in

[wallet/index.ts:3198](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3198)

___

### getBoostedTransactionParents

▸ **getBoostedTransactionParents**(`«destructured»`): `string`[]

Returns an array of parents for a boosted transaction id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `boostedTransactions?` | [`IBoostedTransactions`](../interfaces/IBoostedTransactions.md) |
| › `txid` | `string` |

#### Returns

`string`[]

#### Defined in

[wallet/index.ts:3161](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3161)

___

### getBoostedTransactions

▸ **getBoostedTransactions**(): [`IBoostedTransactions`](../interfaces/IBoostedTransactions.md)

Returns boosted transactions object.

#### Returns

[`IBoostedTransactions`](../interfaces/IBoostedTransactions.md)

#### Defined in

[wallet/index.ts:3182](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3182)

___

### getChangeAddress

▸ **getChangeAddress**(`addressType?`): `Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

Retrieves the next available change address data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressType?` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2442](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2442)

___

### getExchangeRate

▸ **getExchangeRate**(`currency?`): `number`

Returns exchange rate data from storage.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `currency` | `string` | `'EUR'` |

#### Returns

`number`

#### Defined in

[wallet/index.ts:2416](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2416)

___

### getFeeEstimates

▸ **getFeeEstimates**(`network?`): `Promise`<[`IOnchainFees`](../interfaces/IOnchainFees.md)\>

Returns the current fee estimates for the provided network.

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |

#### Returns

`Promise`<[`IOnchainFees`](../interfaces/IOnchainFees.md)\>

**`Async`**

#### Defined in

[wallet/index.ts:2475](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2475)

___

### getFeeInfo

▸ **getFeeInfo**(`«destructured»?`): [`Result`](../README.md#result)<[`TGetTotalFeeObj`](../README.md#tgettotalfeeobj)\>

Returns a fee object for the current transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `fundingLightning?` | `boolean` |
| › `message?` | `string` |
| › `satsPerByte?` | `number` |
| › `transaction?` | `Partial`<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

[`Result`](../README.md#result)<[`TGetTotalFeeObj`](../README.md#tgettotalfeeobj)\>

#### Defined in

[wallet/index.ts:2524](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2524)

___

### getGapLimit

▸ `Private` **getGapLimit**(`addressType?`): [`Result`](../README.md#result)<{ `addressDelta`: `number` ; `changeAddressDelta`: `number`  }\>

Returns the difference between the current address index and the last used address index.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressType?` | `Object` |
| `addressType.addressType?` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

[`Result`](../README.md#result)<{ `addressDelta`: `number` ; `changeAddressDelta`: `number`  }\>

#### Defined in

[wallet/index.ts:1601](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1601)

___

### getHighestStoredAddressIndex

▸ **getHighestStoredAddressIndex**(`addressType`): [`Result`](../README.md#result)<{ `addressIndex`: [`IAddress`](../interfaces/IAddress.md) ; `changeAddressIndex`: [`IAddress`](../interfaces/IAddress.md)  }\>

Returns the highest address and change address index stored in the app for the specified wallet and network.
Retrives the highest stored address index for the provided address type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressType` | `Object` |
| `addressType.addressType` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

[`Result`](../README.md#result)<{ `addressIndex`: [`IAddress`](../interfaces/IAddress.md) ; `changeAddressIndex`: [`IAddress`](../interfaces/IAddress.md)  }\>

#### Defined in

[wallet/index.ts:1183](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1183)

___

### getInputData

▸ **getInputData**(`inputs`): `Promise`<[`Result`](../README.md#result)<[`InputData`](../README.md#inputdata)\>\>

Returns formatted input data from the inputs array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputs` | `Object` |
| `inputs.inputs` | { `tx_hash`: `string` ; `vout`: `number`  }[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`InputData`](../README.md#inputdata)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2375](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2375)

___

### getNextAvailableAddress

▸ **getNextAvailableAddress**(`addressType?`): `Promise`<[`Result`](../README.md#result)<[`IGetNextAvailableAddressResponse`](../interfaces/IGetNextAvailableAddressResponse.md)\>\>

Returns the next available address for the given addresstype.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressType?` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetNextAvailableAddressResponse`](../interfaces/IGetNextAvailableAddressResponse.md)\>\>

#### Defined in

[wallet/index.ts:867](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L867)

___

### getPrivateKey

▸ **getPrivateKey**(`path`): `string`

Returns private key for the provided path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[wallet/index.ts:705](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L705)

___

### getRbfData

▸ **getRbfData**(`txHash`): `Promise`<[`Result`](../README.md#result)<[`IRbfData`](../interfaces/IRbfData.md)\>\>

Using a tx_hash this method will return the necessary data to create a
replace-by-fee transaction for any 0-conf, RBF-enabled tx.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `Object` |
| `txHash.txHash` | [`ITxHash`](../interfaces/ITxHash.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IRbfData`](../interfaces/IRbfData.md)\>\>

#### Defined in

[wallet/index.ts:2901](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2901)

___

### getReceiveAddress

▸ **getReceiveAddress**(`addressType?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Returns the next available receive address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressType?` | `Object` |
| `addressType.addressType?` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:2853](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2853)

___

### getScriptHash

▸ **getScriptHash**(`«destructured»`): `Promise`<`string`\>

Get scriptHash for a given address

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `address` | `string` |
| › `network` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:686](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L686)

___

### getScriptHashBalance

▸ **getScriptHashBalance**(`scriptHash`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressBalanceRes`](../interfaces/IGetAddressBalanceRes.md)\>\>

Returns the balance for the specified scriptHash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptHash` | `string` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressBalanceRes`](../interfaces/IGetAddressBalanceRes.md)\>\>

#### Defined in

[wallet/index.ts:715](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L715)

___

### getUnconfirmedTransactions

▸ **getUnconfirmedTransactions**(): [`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

Returns the current wallet's unconfirmed transactions from storage.

#### Returns

[`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

#### Defined in

[wallet/index.ts:1957](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1957)

___

### getUtxos

▸ **getUtxos**(`scanAllAddresses`): `Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

Retrieves and sets UTXO's for the current wallet from Electrum.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scanAllAddresses` | `Object` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

#### Defined in

[wallet/index.ts:1637](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1637)

___

### getWalletData

▸ **getWalletData**(): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

Gets the wallet data object from storage if able.
Otherwise, it falls back to the default wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

#### Defined in

[wallet/index.ts:378](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L378)

___

### getWalletDataKey

▸ **getWalletDataKey**(`key`): `string`

Returns the key used for storing wallet data in the key/value pair.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | keyof [`IWalletData`](../interfaces/IWalletData.md) |

#### Returns

`string`

#### Defined in

[wallet/index.ts:369](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L369)

___

### isValid

▸ **isValid**(`mnemonic`): `boolean`

Ensures the provided mnemonic matches the one stored in the wallet and is valid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `any` |

#### Returns

`boolean`

#### Defined in

[wallet/index.ts:475](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L475)

___

### listUtxos

▸ **listUtxos**(): [`IUtxo`](../interfaces/IUtxo.md)[]

Returns the current wallet's UTXO's from storage.

#### Returns

[`IUtxo`](../interfaces/IUtxo.md)[]

#### Defined in

[wallet/index.ts:1661](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1661)

___

### processUnconfirmedTransactions

▸ `Private` **processUnconfirmedTransactions**(): `Promise`<[`Result`](../README.md#result)<[`TProcessUnconfirmedTransactions`](../README.md#tprocessunconfirmedtransactions)\>\>

This method processes all transactions with less than 6 confirmations and returns the following:
1. Transactions that still have less than 6 confirmations and can be considered unconfirmed. (unconfirmedTxs)
2. Transactions that have fewer confirmations than before due to a reorg. (outdatedTxs)
3. Transactions that have been removed from the mempool. (ghostTxs)

#### Returns

`Promise`<[`Result`](../README.md#result)<[`TProcessUnconfirmedTransactions`](../README.md#tprocessunconfirmedtransactions)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1887](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1887)

___

### refreshWallet

▸ **refreshWallet**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

Refreshes/Syncs the wallet data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `scanAllAddresses` | `undefined` \| `boolean` |
| › `updateAllAddressTypes` | `undefined` \| `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

#### Defined in

[wallet/index.ts:265](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L265)

___

### removeDuplicateAddresses

▸ `Private` **removeDuplicateAddresses**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<[`IGenerateAddressesResponse`](../interfaces/IGenerateAddressesResponse.md)\>\>

This method will compare a set of specified addresses to the currently stored addresses and remove any duplicates.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `addresses?` | [`IAddresses`](../interfaces/IAddresses.md) |
| › `changeAddresses?` | [`IAddresses`](../interfaces/IAddresses.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGenerateAddressesResponse`](../interfaces/IGenerateAddressesResponse.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1300](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1300)

___

### removeTxInput

▸ **removeTxInput**(`input`): [`Result`](../README.md#result)<[`IUtxo`](../interfaces/IUtxo.md)[]\>

Removes the specified input from the current transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.input` | [`IUtxo`](../interfaces/IUtxo.md) |

#### Returns

[`Result`](../README.md#result)<[`IUtxo`](../interfaces/IUtxo.md)[]\>

#### Defined in

[wallet/index.ts:3256](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3256)

___

### removeTxTag

▸ **removeTxTag**(`tag`): [`Result`](../README.md#result)<`string`\>

Removes a specified tag from the current transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `Object` |
| `tag.tag` | `string` |

#### Returns

[`Result`](../README.md#result)<`string`\>

#### Defined in

[wallet/index.ts:3305](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3305)

___

### rescanAddresses

▸ **rescanAddresses**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

This method will clear the utxo array for each address type and reset the
address indexes back to the original/default app values. Once cleared & reset
the app will rescan the wallet's addresses from index zero.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `shouldClearAddresses?` | `boolean` |
| › `shouldClearTransactions?` | `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2046](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2046)

___

### resetAddressIndexes

▸ `Private` **resetAddressIndexes**(): `Promise`<`void`\>

Resets address indexes back to the app's default/original state.

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:1487](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1487)

___

### resetSendTransaction

▸ **resetSendTransaction**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

This completely resets the send transaction state.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:3190](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3190)

___

### saveWalletData

▸ **saveWalletData**<`K`\>(`key`, `data`): `Promise`<`string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`IWalletData`](../interfaces/IWalletData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | keyof [`IWalletData`](../interfaces/IWalletData.md) |
| `data` | [`IWalletData`](../interfaces/IWalletData.md)[`K`] |

#### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:1674](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1674)

___

### send

▸ **send**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Sets up and creates a transaction to a single output/recipient.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `address` | `string` |
| › `amount` | `number` |
| › `broadcast?` | `boolean` |
| › `message?` | `string` |
| › `rbf?` | `boolean` |
| › `satsPerByte?` | `number` |
| › `shuffleOutputs?` | `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2684](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2684)

___

### sendMany

▸ **sendMany**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Sets up and creates a transaction to multiple outputs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `broadcast?` | `boolean` |
| › `rbf?` | `boolean` |
| › `satsPerByte?` | `number` |
| › `shuffleOutputs?` | `boolean` |
| › `txs` | [`ISendTx`](../interfaces/ISendTx.md)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:2552](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2552)

___

### sendMax

▸ **sendMax**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Sends the maximum amount of sats to a given address at the specified satsPerByte.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `address?` | `string` |
| › `broadcast?` | `boolean` |
| › `rbf?` | `boolean` |
| › `satsPerByte?` | `number` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:2628](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2628)

___

### setWalletData

▸ `Private` **setWalletData**(): `Promise`<[`Result`](../README.md#result)<`boolean`\>\>

Sets the wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<`boolean`\>\>

#### Defined in

[wallet/index.ts:321](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L321)

___

### setZeroIndexAddresses

▸ `Private` **setZeroIndexAddresses**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Will ensure that both address and change address indexes are set at index 0.
Will also generate and store address and changeAddress at index 0.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2735](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2735)

___

### setupFeeForOnChainTransaction

▸ **setupFeeForOnChainTransaction**(`«destructured»?`): [`Result`](../README.md#result)<`string`\>

Updates the fee rate for the current transaction to the preferred value if none set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `satsPerByte?` | `number` |
| › `selectedFeeId?` | [`EFeeId`](../enums/EFeeId.md) |

#### Returns

[`Result`](../README.md#result)<`string`\>

#### Defined in

[wallet/index.ts:3330](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3330)

___

### setupTransaction

▸ **setupTransaction**(`params?`): `Promise`<[`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)\>

Sets up the transaction object with existing inputs and change address information
@async.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ISetupTransaction`](../interfaces/ISetupTransaction.md) |

#### Returns

`Promise`<[`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)\>

#### Defined in

[wallet/index.ts:2510](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2510)

___

### storageIdCheck

▸ `Private` **storageIdCheck**(`id`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Ensure we are not overwriting wallet data of a different wallet by checking that the wallet id's match.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:344](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L344)

___

### switchNetwork

▸ **switchNetwork**(`network`, `servers?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:214](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L214)

___

### updateAddressIndex

▸ `Private` **updateAddressIndex**(`addressType`, `isChangeAddress`, `index?`): `Promise`<`void`\>

Updates the address index for a given address type.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `addressType` | [`EAddressType`](../enums/EAddressType.md) | `undefined` |
| `isChangeAddress` | `boolean` | `undefined` |
| `index?` | `number` | `0` |

#### Returns

`Promise`<`void`\>

**`Async`**

#### Defined in

[wallet/index.ts:2786](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2786)

___

### updateAddressIndexes

▸ `Private` **updateAddressIndexes**(`addressType?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

This method updates the next available (zero-balance) address & changeAddress index.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressType?` | `Object` |
| `addressType.addressType?` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1350](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1350)

___

### updateAddressType

▸ **updateAddressType**(`addressType`): `Promise`<`void`\>

Updates the address type for the current wallet.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressType` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:253](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L253)

___

### updateAndSaveWalletData

▸ `Private` **updateAndSaveWalletData**(`key`, `data`, `addressType?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | keyof [`IWalletData`](../interfaces/IWalletData.md) |
| `data` | [`IWalletData`](../interfaces/IWalletData.md) |
| `addressType?` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:1706](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1706)

___

### updateExchangeRates

▸ **updateExchangeRates**(): `Promise`<[`Result`](../README.md#result)<[`IExchangeRates`](../interfaces/IExchangeRates.md)\>\>

Updates the exchange rates for the current network.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IExchangeRates`](../interfaces/IExchangeRates.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:3382](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3382)

___

### updateFeeEstimates

▸ **updateFeeEstimates**(`forceUpdate?`): `Promise`<[`Result`](../README.md#result)<[`IOnchainFees`](../interfaces/IOnchainFees.md)\>\>

Updates the fee estimates for the current network.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `forceUpdate?` | `boolean` | `false` | Ignores the timestamp if set true and forces the update |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IOnchainFees`](../interfaces/IOnchainFees.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:3397](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3397)

___

### updateGhostTransactions

▸ `Private` **updateGhostTransactions**(`txIds`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Removes transactions from the store and activity list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txIds` | `Object` |
| `txIds.txIds` | `string`[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2003](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2003)

___

### updateHeader

▸ **updateHeader**(`headerData`): `Promise`<`void`\>

Updates & Saves header information to storage.

#### Parameters

| Name | Type |
| :------ | :------ |
| `headerData` | [`IHeader`](../interfaces/IHeader.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:1991](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1991)

___

### updateTransactionHeights

▸ `Private` **updateTransactionHeights**(`txs`): `Promise`<`string`\>

Updates the confirmation state of activity item transactions that were reorg'd out.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txs` | [`IUtxo`](../interfaces/IUtxo.md)[] |

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:2118](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2118)

___

### updateTransactions

▸ **updateTransactions**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<`undefined` \| `string`\>\>

Retrieves, formats & stores the transaction history for the selected wallet/network.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `replaceStoredTransactions?` | `boolean` |
| › `scanAllAddresses?` | `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`undefined` \| `string`\>\>

#### Defined in

[wallet/index.ts:1727](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L1727)

___

### updateWalletBalance

▸ **updateWalletBalance**(`balance`): [`Result`](../README.md#result)<`string`\>

Used to temporarily update the balance until the Electrum server catches up after sending a transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `balance` | `Object` |
| `balance.balance` | `number` |

#### Returns

[`Result`](../README.md#result)<`string`\>

#### Defined in

[wallet/index.ts:3366](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L3366)

___

### validateAddress

▸ **validateAddress**(`address`): `boolean`

Attempts to validate a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[wallet/index.ts:2432](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L2432)

___

### create

▸ `Static` **create**(`params`): `Promise`<[`Result`](../README.md#result)<[`Wallet`](Wallet.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`IWallet`](../interfaces/IWallet.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`Wallet`](Wallet.md)\>\>

#### Defined in

[wallet/index.ts:199](https://github.com/synonymdev/beignet/blob/583604f/src/wallet/index.ts#L199)
