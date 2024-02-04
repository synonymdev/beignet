[beignet](../README.md) / Wallet

# Class: Wallet

## Table of contents

### Constructors

- [constructor](Wallet.md#constructor)

### Properties

- [\_customGetAddress](Wallet.md#_customgetaddress)
- [\_customGetScriptHash](Wallet.md#_customgetscripthash)
- [\_data](Wallet.md#_data)
- [\_disableMessagesOnCreate](Wallet.md#_disablemessagesoncreate)
- [\_getData](Wallet.md#_getdata)
- [\_mnemonic](Wallet.md#_mnemonic)
- [\_network](Wallet.md#_network)
- [\_passphrase](Wallet.md#_passphrase)
- [\_pendingRefreshPromises](Wallet.md#_pendingrefreshpromises)
- [\_root](Wallet.md#_root)
- [\_seed](Wallet.md#_seed)
- [\_setData](Wallet.md#_setdata)
- [addressType](Wallet.md#addresstype)
- [addressTypesToMonitor](Wallet.md#addresstypestomonitor)
- [disableMessages](Wallet.md#disablemessages)
- [electrum](Wallet.md#electrum)
- [electrumOptions](Wallet.md#electrumoptions)
- [feeEstimates](Wallet.md#feeestimates)
- [id](Wallet.md#id)
- [isRefreshing](Wallet.md#isrefreshing)
- [isSwitchingNetworks](Wallet.md#isswitchingnetworks)
- [name](Wallet.md#name)
- [rbf](Wallet.md#rbf)
- [savingOperations](Wallet.md#savingoperations)
- [selectedFeeId](Wallet.md#selectedfeeid)
- [sendMessage](Wallet.md#sendmessage)
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
- [getAddressesFromPrivateKey](Wallet.md#getaddressesfromprivatekey)
- [getBalance](Wallet.md#getbalance)
- [getBip32Interface](Wallet.md#getbip32interface)
- [getBitcoinNetwork](Wallet.md#getbitcoinnetwork)
- [getBoostableTransactions](Wallet.md#getboostabletransactions)
- [getBoostedTransactionParents](Wallet.md#getboostedtransactionparents)
- [getBoostedTransactions](Wallet.md#getboostedtransactions)
- [getChangeAddress](Wallet.md#getchangeaddress)
- [getFeeEstimates](Wallet.md#getfeeestimates)
- [getFeeInfo](Wallet.md#getfeeinfo)
- [getGapLimit](Wallet.md#getgaplimit)
- [getHighestStoredAddressIndex](Wallet.md#gethigheststoredaddressindex)
- [getInputData](Wallet.md#getinputdata)
- [getNextAvailableAddress](Wallet.md#getnextavailableaddress)
- [getPrivateKey](Wallet.md#getprivatekey)
- [getPrivateKeyInfo](Wallet.md#getprivatekeyinfo)
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
- [sweepPrivateKey](Wallet.md#sweepprivatekey)
- [switchNetwork](Wallet.md#switchnetwork)
- [updateAddressIndex](Wallet.md#updateaddressindex)
- [updateAddressIndexes](Wallet.md#updateaddressindexes)
- [updateAddressType](Wallet.md#updateaddresstype)
- [updateAndSaveWalletData](Wallet.md#updateandsavewalletdata)
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

[wallet/index.ts:149](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L149)

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

[wallet/index.ts:118](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L118)

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

[wallet/index.ts:121](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L121)

___

### \_data

• `Private` **\_data**: [`IWalletData`](../interfaces/IWalletData.md)

#### Defined in

[wallet/index.ts:115](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L115)

___

### \_disableMessagesOnCreate

• `Private` **\_disableMessagesOnCreate**: `boolean`

#### Defined in

[wallet/index.ts:127](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L127)

___

### \_getData

• `Private` **\_getData**: [`TGetData`](../README.md#tgetdata)

#### Defined in

[wallet/index.ts:116](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L116)

___

### \_mnemonic

• `Private` `Readonly` **\_mnemonic**: `string`

#### Defined in

[wallet/index.ts:111](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L111)

___

### \_network

• `Private` **\_network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[wallet/index.ts:110](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L110)

___

### \_passphrase

• `Private` `Readonly` **\_passphrase**: `string`

#### Defined in

[wallet/index.ts:112](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L112)

___

### \_pendingRefreshPromises

• `Private` **\_pendingRefreshPromises**: (`result`: [`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>) => `void`[] = `[]`

#### Defined in

[wallet/index.ts:124](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L124)

___

### \_root

• `Private` `Readonly` **\_root**: `BIP32Interface`

#### Defined in

[wallet/index.ts:114](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L114)

___

### \_seed

• `Private` `Readonly` **\_seed**: `Buffer`

#### Defined in

[wallet/index.ts:113](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L113)

___

### \_setData

• `Private` `Optional` **\_setData**: [`TSetData`](../README.md#tsetdata)

#### Defined in

[wallet/index.ts:117](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L117)

___

### addressType

• **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[wallet/index.ts:142](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L142)

___

### addressTypesToMonitor

• **addressTypesToMonitor**: [`EAddressType`](../enums/EAddressType.md)[]

#### Defined in

[wallet/index.ts:129](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L129)

___

### disableMessages

• **disableMessages**: `boolean`

#### Defined in

[wallet/index.ts:148](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L148)

___

### electrum

• **electrum**: [`Electrum`](Electrum.md)

#### Defined in

[wallet/index.ts:141](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L141)

___

### electrumOptions

• `Optional` **electrumOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `batchDelay?` | `number` |
| `batchLimit?` | `number` |
| `net?` | `Server` |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |
| `tls?` | `TLSSocket` |

#### Defined in

[wallet/index.ts:134](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L134)

___

### feeEstimates

• **feeEstimates**: [`IOnchainFees`](../interfaces/IOnchainFees.md)

#### Defined in

[wallet/index.ts:145](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L145)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[wallet/index.ts:132](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L132)

___

### isRefreshing

• **isRefreshing**: `boolean`

#### Defined in

[wallet/index.ts:130](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L130)

___

### isSwitchingNetworks

• **isSwitchingNetworks**: `boolean`

#### Defined in

[wallet/index.ts:131](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L131)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[wallet/index.ts:133](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L133)

___

### rbf

• **rbf**: `boolean`

#### Defined in

[wallet/index.ts:146](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L146)

___

### savingOperations

• `Private` **savingOperations**: `Record`<`string`, `Promise`<`string`\>\> = `{}`

Saves the wallet data object to storage if able.

**`Async`**

**`Param`**

**`Param`**

#### Defined in

[wallet/index.ts:1655](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1655)

___

### selectedFeeId

• **selectedFeeId**: [`EFeeId`](../enums/EFeeId.md)

#### Defined in

[wallet/index.ts:147](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L147)

___

### sendMessage

• **sendMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[wallet/index.ts:143](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L143)

___

### transaction

• **transaction**: [`Transaction`](Transaction.md)

#### Defined in

[wallet/index.ts:144](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L144)

## Accessors

### data

• `get` **data**(): [`IWalletData`](../interfaces/IWalletData.md)

#### Returns

[`IWalletData`](../interfaces/IWalletData.md)

#### Defined in

[wallet/index.ts:217](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L217)

___

### network

• `get` **network**(): [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Returns

[`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[wallet/index.ts:221](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L221)

## Methods

### \_getAddress

▸ `Private` **_getAddress**(`path`, `addressType`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

Returns the address for the specified path and address type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `addressType` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

#### Defined in

[wallet/index.ts:509](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L509)

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

[wallet/index.ts:336](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L336)

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

[wallet/index.ts:326](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L326)

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

[wallet/index.ts:1219](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1219)

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

[wallet/index.ts:3086](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3086)

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

[wallet/index.ts:3071](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3071)

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

[wallet/index.ts:3203](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3203)

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

[wallet/index.ts:3254](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3254)

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

[wallet/index.ts:2123](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2123)

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

[wallet/index.ts:2165](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2165)

___

### checkElectrumConnection

▸ **checkElectrumConnection**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Ensures the connection to Electrum is still available.
Will attempt to reconnect if not initially available.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:847](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L847)

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

[wallet/index.ts:1828](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1828)

___

### clearAddresses

▸ `Private` **clearAddresses**(): `Promise`<`string`\>

Clears the addresses and changeAddresses object for a given wallet and network.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:2083](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2083)

___

### clearTransactions

▸ `Private` **clearTransactions**(): `Promise`<`string`\>

Clears the transactions object for a given wallet and network from storage.

#### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:2071](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2071)

___

### clearUtxos

▸ **clearUtxos**(): `Promise`<`string`\>

Clears the UTXO array and balance from storage.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:2056](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2056)

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

[wallet/index.ts:1951](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1951)

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

[wallet/index.ts:608](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L608)

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

[wallet/index.ts:3055](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3055)

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

[wallet/index.ts:2191](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2191)

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

[wallet/index.ts:739](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L739)

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

[wallet/index.ts:1498](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1498)

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

[wallet/index.ts:548](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L548)

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

[wallet/index.ts:629](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L629)

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

[wallet/index.ts:582](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L582)

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

[wallet/index.ts:2688](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2688)

___

### getAddressIndexInfo

▸ **getAddressIndexInfo**(): [`TAddressIndexInfo`](../README.md#taddressindexinfo)

Returns current address index information.

#### Returns

[`TAddressIndexInfo`](../README.md#taddressindexinfo)

#### Defined in

[wallet/index.ts:2803](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2803)

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

[wallet/index.ts:647](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L647)

___

### getAddressesFromPrivateKey

▸ **getAddressesFromPrivateKey**(`privateKey`, `_addressTypes?`): [`Result`](../README.md#result)<[`IGetAddressesFromPrivateKey`](../interfaces/IGetAddressesFromPrivateKey.md)\>

Get addresses from a given private key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `string` |
| `_addressTypes?` | [`EAddressType`](../enums/EAddressType.md)[] |

#### Returns

[`Result`](../README.md#result)<[`IGetAddressesFromPrivateKey`](../interfaces/IGetAddressesFromPrivateKey.md)\>

#### Defined in

[wallet/index.ts:3378](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3378)

___

### getBalance

▸ **getBalance**(): `number`

Returns the known balance from storage.

#### Returns

`number`

#### Defined in

[wallet/index.ts:723](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L723)

___

### getBip32Interface

▸ **getBip32Interface**(): `Promise`<[`Result`](../README.md#result)<`BIP32Interface`\>\>

Creates a BIP32Interface from the selected wallet's mnemonic and passphrase

#### Returns

`Promise`<[`Result`](../README.md#result)<`BIP32Interface`\>\>

#### Defined in

[wallet/index.ts:3187](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3187)

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

[wallet/index.ts:488](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L488)

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

[wallet/index.ts:3170](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3170)

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

[wallet/index.ts:3133](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3133)

___

### getBoostedTransactions

▸ **getBoostedTransactions**(): [`IBoostedTransactions`](../interfaces/IBoostedTransactions.md)

Returns boosted transactions object.

#### Returns

[`IBoostedTransactions`](../interfaces/IBoostedTransactions.md)

#### Defined in

[wallet/index.ts:3154](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3154)

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

[wallet/index.ts:2415](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2415)

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

[wallet/index.ts:2448](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2448)

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

[wallet/index.ts:2497](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2497)

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

[wallet/index.ts:1584](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1584)

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

[wallet/index.ts:1179](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1179)

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

[wallet/index.ts:2359](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2359)

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

[wallet/index.ts:863](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L863)

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

[wallet/index.ts:701](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L701)

___

### getPrivateKeyInfo

▸ **getPrivateKeyInfo**(`privateKey`): `Promise`<[`Result`](../README.md#result)<[`IPrivateKeyInfo`](../interfaces/IPrivateKeyInfo.md)\>\>

Returns the balance, utxos, and keyPair info for a given private key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `string` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IPrivateKeyInfo`](../interfaces/IPrivateKeyInfo.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:3400](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3400)

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

[wallet/index.ts:2873](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2873)

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

[wallet/index.ts:2825](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2825)

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

[wallet/index.ts:682](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L682)

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

[wallet/index.ts:711](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L711)

___

### getUnconfirmedTransactions

▸ **getUnconfirmedTransactions**(): [`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

Returns the current wallet's unconfirmed transactions from storage.

#### Returns

[`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

#### Defined in

[wallet/index.ts:1939](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1939)

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

[wallet/index.ts:1617](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1617)

___

### getWalletData

▸ **getWalletData**(): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

Gets the wallet data object from storage if able.
Otherwise, it falls back to the default wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

#### Defined in

[wallet/index.ts:404](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L404)

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

[wallet/index.ts:395](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L395)

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

[wallet/index.ts:498](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L498)

___

### listUtxos

▸ **listUtxos**(): [`IUtxo`](../interfaces/IUtxo.md)[]

Returns the current wallet's UTXO's from storage.

#### Returns

[`IUtxo`](../interfaces/IUtxo.md)[]

#### Defined in

[wallet/index.ts:1643](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1643)

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

[wallet/index.ts:1869](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1869)

___

### refreshWallet

▸ **refreshWallet**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

Refreshes/Syncs the wallet data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `scanAllAddresses` | `undefined` \| `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

#### Defined in

[wallet/index.ts:295](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L295)

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

[wallet/index.ts:1293](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1293)

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

[wallet/index.ts:3228](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3228)

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

[wallet/index.ts:3277](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3277)

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

[wallet/index.ts:2028](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2028)

___

### resetAddressIndexes

▸ `Private` **resetAddressIndexes**(): `Promise`<`void`\>

Resets address indexes back to the app's default/original state.

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:1470](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1470)

___

### resetSendTransaction

▸ **resetSendTransaction**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

This completely resets the send transaction state.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:3162](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3162)

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

[wallet/index.ts:1656](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1656)

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

[wallet/index.ts:2657](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2657)

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

[wallet/index.ts:2525](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2525)

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

[wallet/index.ts:2601](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2601)

___

### setWalletData

▸ `Private` **setWalletData**(): `Promise`<[`Result`](../README.md#result)<`boolean`\>\>

Sets the wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<`boolean`\>\>

#### Defined in

[wallet/index.ts:347](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L347)

___

### setZeroIndexAddresses

▸ `Private` **setZeroIndexAddresses**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Will ensure that both address and change address indexes are set at index 0.
Will also generate and store address and changeAddress at index 0.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2708](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2708)

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

[wallet/index.ts:3302](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3302)

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

[wallet/index.ts:2483](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2483)

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

[wallet/index.ts:370](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L370)

___

### sweepPrivateKey

▸ **sweepPrivateKey**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<[`ISweepPrivateKeyRes`](../interfaces/ISweepPrivateKeyRes.md)\>\>

Sweeps a private key to a given address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ISweepPrivateKey`](../interfaces/ISweepPrivateKey.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`ISweepPrivateKeyRes`](../interfaces/ISweepPrivateKeyRes.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:3444](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3444)

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

[wallet/index.ts:241](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L241)

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

[wallet/index.ts:2758](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2758)

___

### updateAddressIndexes

▸ `Private` **updateAddressIndexes**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

This method updates the next available (zero-balance) address & changeAddress index.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1342](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1342)

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

[wallet/index.ts:280](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L280)

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

[wallet/index.ts:1688](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1688)

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

[wallet/index.ts:3355](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3355)

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

[wallet/index.ts:1985](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1985)

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

[wallet/index.ts:1973](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1973)

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

[wallet/index.ts:2100](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2100)

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

[wallet/index.ts:1709](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L1709)

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

[wallet/index.ts:3338](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L3338)

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

[wallet/index.ts:2405](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L2405)

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

[wallet/index.ts:225](https://github.com/synonymdev/beignet/blob/05d5011/src/wallet/index.ts#L225)
