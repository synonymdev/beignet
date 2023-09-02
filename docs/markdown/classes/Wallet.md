[beignet](../README.md) / Wallet

# Class: Wallet

## Table of contents

### Constructors

- [constructor](Wallet.md#constructor)

### Properties

- [addressType](Wallet.md#addresstype)
- [customGetAddress](Wallet.md#customgetaddress)
- [customGetScriptHash](Wallet.md#customgetscripthash)
- [data](Wallet.md#data)
- [electrum](Wallet.md#electrum)
- [electrumOptions](Wallet.md#electrumoptions)
- [exchangeRates](Wallet.md#exchangerates)
- [feeEstimates](Wallet.md#feeestimates)
- [getData](Wallet.md#getdata)
- [mnemonic](Wallet.md#mnemonic)
- [name](Wallet.md#name)
- [network](Wallet.md#network)
- [onMessage](Wallet.md#onmessage)
- [passphrase](Wallet.md#passphrase)
- [rbf](Wallet.md#rbf)
- [root](Wallet.md#root)
- [seed](Wallet.md#seed)
- [selectedFeeId](Wallet.md#selectedfeeid)
- [setData](Wallet.md#setdata)
- [transaction](Wallet.md#transaction)

### Methods

- [\_getAddress](Wallet.md#_getaddress)
- [addAddresses](Wallet.md#addaddresses)
- [addBoostedTransaction](Wallet.md#addboostedtransaction)
- [addGhostTransaction](Wallet.md#addghosttransaction)
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
- [getBalance](Wallet.md#getbalance)
- [getBitcoinNetwork](Wallet.md#getbitcoinnetwork)
- [getBoostableTransactions](Wallet.md#getboostabletransactions)
- [getBoostedTransactionParents](Wallet.md#getboostedtransactionparents)
- [getBoostedTransactions](Wallet.md#getboostedtransactions)
- [getChangeAddress](Wallet.md#getchangeaddress)
- [getExchangeRate](Wallet.md#getexchangerate)
- [getFeeEstimates](Wallet.md#getfeeestimates)
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
- [rescanAddresses](Wallet.md#rescanaddresses)
- [resetAddressIndexes](Wallet.md#resetaddressindexes)
- [resetSendTransaction](Wallet.md#resetsendtransaction)
- [saveWalletData](Wallet.md#savewalletdata)
- [send](Wallet.md#send)
- [sendMany](Wallet.md#sendmany)
- [setWalletData](Wallet.md#setwalletdata)
- [setZeroIndexAddresses](Wallet.md#setzeroindexaddresses)
- [setupTransaction](Wallet.md#setuptransaction)
- [switchNetwork](Wallet.md#switchnetwork)
- [updateAddressIndexes](Wallet.md#updateaddressindexes)
- [updateAddressType](Wallet.md#updateaddresstype)
- [updateAndSaveWalletData](Wallet.md#updateandsavewalletdata)
- [updateGhostTransactions](Wallet.md#updateghosttransactions)
- [updateTransactionHeights](Wallet.md#updatetransactionheights)
- [updateTransactions](Wallet.md#updatetransactions)
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

[wallet/index.ts:117](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L117)

## Properties

### addressType

• **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[wallet/index.ts:101](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L101)

___

### customGetAddress

• `Private` `Optional` **customGetAddress**: (`data`: [`ICustomGetAddress`](../interfaces/ICustomGetAddress.md)) => `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

#### Type declaration

▸ (`data`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetAddress`](../interfaces/ICustomGetAddress.md) |

##### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>\>

#### Defined in

[wallet/index.ts:113](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L113)

___

### customGetScriptHash

• `Private` `Optional` **customGetScriptHash**: (`data`: [`ICustomGetScriptHash`](../interfaces/ICustomGetScriptHash.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`data`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetScriptHash`](../interfaces/ICustomGetScriptHash.md) |

##### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:116](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L116)

___

### data

• **data**: [`IWalletData`](../interfaces/IWalletData.md)

#### Defined in

[wallet/index.ts:102](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L102)

___

### electrum

• **electrum**: [`Electrum`](Electrum.md)

#### Defined in

[wallet/index.ts:106](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L106)

___

### electrumOptions

• `Optional` **electrumOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Defined in

[wallet/index.ts:103](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L103)

___

### exchangeRates

• **exchangeRates**: [`IExchangeRates`](../interfaces/IExchangeRates.md)

#### Defined in

[wallet/index.ts:107](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L107)

___

### feeEstimates

• **feeEstimates**: [`IFees`](../interfaces/IFees.md)

#### Defined in

[wallet/index.ts:110](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L110)

___

### getData

• `Private` **getData**: [`TGetData`](../README.md#tgetdata)

#### Defined in

[wallet/index.ts:98](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L98)

___

### mnemonic

• `Private` `Readonly` **mnemonic**: `string`

#### Defined in

[wallet/index.ts:93](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L93)

___

### name

• `Private` `Readonly` **name**: `string`

#### Defined in

[wallet/index.ts:97](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L97)

___

### network

• **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[wallet/index.ts:100](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L100)

___

### onMessage

• `Optional` **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[wallet/index.ts:108](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L108)

___

### passphrase

• `Private` `Readonly` **passphrase**: `string`

#### Defined in

[wallet/index.ts:94](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L94)

___

### rbf

• **rbf**: `boolean`

#### Defined in

[wallet/index.ts:111](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L111)

___

### root

• `Private` `Readonly` **root**: `BIP32Interface`

#### Defined in

[wallet/index.ts:96](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L96)

___

### seed

• `Private` `Readonly` **seed**: `Buffer`

#### Defined in

[wallet/index.ts:95](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L95)

___

### selectedFeeId

• **selectedFeeId**: [`EFeeId`](../enums/EFeeId.md)

#### Defined in

[wallet/index.ts:112](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L112)

___

### setData

• `Private` `Optional` **setData**: [`TSetData`](../README.md#tsetdata)

#### Defined in

[wallet/index.ts:99](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L99)

___

### transaction

• **transaction**: [`Transaction`](Transaction.md)

#### Defined in

[wallet/index.ts:109](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L109)

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

[wallet/index.ts:361](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L361)

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

[wallet/index.ts:1057](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1057)

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

[wallet/index.ts:2758](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2758)

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

[wallet/index.ts:2743](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2743)

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

[wallet/index.ts:1937](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1937)

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

[wallet/index.ts:1980](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1980)

___

### checkElectrumConnection

▸ **checkElectrumConnection**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Ensures the connection to Electrum is still available.
Will attempt to reconnect if not initially available.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:693](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L693)

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

[wallet/index.ts:1647](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1647)

___

### clearAddresses

▸ `Private` **clearAddresses**(): `Promise`<`string`\>

Clears the addresses and changeAddresses object for a given wallet and network.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:1898](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1898)

___

### clearTransactions

▸ `Private` **clearTransactions**(): `Promise`<`string`\>

Clears the transactions object for a given wallet and network from storage.

#### Returns

`Promise`<`string`\>

#### Defined in

[wallet/index.ts:1886](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1886)

___

### clearUtxos

▸ `Private` **clearUtxos**(): `Promise`<`string`\>

Clears the UTXO array and balance from storage.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:1870](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1870)

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

[wallet/index.ts:1775](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1775)

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

[wallet/index.ts:488](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L488)

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

[wallet/index.ts:2728](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2728)

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

[wallet/index.ts:2006](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2006)

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

[wallet/index.ts:584](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L584)

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

[wallet/index.ts:1347](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1347)

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

[wallet/index.ts:427](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L427)

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

[wallet/index.ts:509](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L509)

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

[wallet/index.ts:461](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L461)

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

[wallet/index.ts:2398](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2398)

___

### getAddressIndexInfo

▸ **getAddressIndexInfo**(): [`TAddressIndexInfo`](../README.md#taddressindexinfo)

Returns current address index information.

#### Returns

[`TAddressIndexInfo`](../README.md#taddressindexinfo)

#### Defined in

[wallet/index.ts:2471](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2471)

___

### getBalance

▸ **getBalance**(): `number`

Returns the known balance from storage.

#### Returns

`number`

#### Defined in

[wallet/index.ts:568](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L568)

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

[wallet/index.ts:340](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L340)

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

[wallet/index.ts:2845](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2845)

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

[wallet/index.ts:2806](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2806)

___

### getBoostedTransactions

▸ **getBoostedTransactions**(): [`IBoostedTransactions`](../interfaces/IBoostedTransactions.md)

Returns boosted transactions object.

#### Returns

[`IBoostedTransactions`](../interfaces/IBoostedTransactions.md)

#### Defined in

[wallet/index.ts:2827](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2827)

___

### getChangeAddress

▸ **getChangeAddress**(): `Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

Retrieves the next available change address data.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2236](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2236)

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

[wallet/index.ts:2211](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2211)

___

### getFeeEstimates

▸ **getFeeEstimates**(): `Promise`<[`IFees`](../interfaces/IFees.md)\>

Returns the current fee estimates for the provided network.

#### Returns

`Promise`<[`IFees`](../interfaces/IFees.md)\>

**`Async`**

#### Defined in

[wallet/index.ts:2268](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2268)

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

[wallet/index.ts:1439](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1439)

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

[wallet/index.ts:1017](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1017)

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

[wallet/index.ts:2169](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2169)

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

[wallet/index.ts:709](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L709)

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

[wallet/index.ts:546](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L546)

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

[wallet/index.ts:2546](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2546)

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

[wallet/index.ts:2493](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2493)

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

[wallet/index.ts:527](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L527)

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

[wallet/index.ts:556](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L556)

___

### getUnconfirmedTransactions

▸ **getUnconfirmedTransactions**(): [`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

Returns the current wallet's unconfirmed transactions from storage.

#### Returns

[`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

#### Defined in

[wallet/index.ts:1763](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1763)

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

[wallet/index.ts:1477](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1477)

___

### getWalletData

▸ **getWalletData**(): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

Gets the wallet data object from storge if able.
Otherwise, it falls back to the default wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

#### Defined in

[wallet/index.ts:274](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L274)

___

### getWalletDataKey

▸ `Private` **getWalletDataKey**(`key`): `string`

Returns the key used for storing wallet data in the key/value pair.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | keyof [`IWalletData`](../interfaces/IWalletData.md) |

#### Returns

`string`

#### Defined in

[wallet/index.ts:265](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L265)

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

[wallet/index.ts:350](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L350)

___

### listUtxos

▸ **listUtxos**(): [`IUtxo`](../interfaces/IUtxo.md)[]

Returns the current wallet's UTXO's from storage.

#### Returns

[`IUtxo`](../interfaces/IUtxo.md)[]

#### Defined in

[wallet/index.ts:1501](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1501)

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

[wallet/index.ts:1692](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1692)

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

[wallet/index.ts:223](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L223)

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

[wallet/index.ts:1126](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1126)

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

[wallet/index.ts:1842](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1842)

___

### resetAddressIndexes

▸ `Private` **resetAddressIndexes**(): `Promise`<`void`\>

Resets address indexes back to the app's default/original state.

#### Returns

`Promise`<`void`\>

#### Defined in

[wallet/index.ts:1313](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1313)

___

### resetSendTransaction

▸ **resetSendTransaction**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

This completely resets the send transaction state.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:2835](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2835)

___

### saveWalletData

▸ `Private` **saveWalletData**<`K`\>(`key`, `data`): `Promise`<`void`\>

Saves the wallet data object to storage if able.

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

`Promise`<`void`\>

**`Async`**

#### Defined in

[wallet/index.ts:1513](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1513)

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
| › `message?` | `string` |
| › `rbf?` | `boolean` |
| › `satsPerByte?` | `number` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2373](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2373)

___

### sendMany

▸ **sendMany**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Sets up and creates a transaction to multiple outputs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `rbf?` | `boolean` |
| › `satsPerByte?` | `number` |
| › `txs` | [`ISendTx`](../interfaces/ISendTx.md)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:2318](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2318)

___

### setWalletData

▸ `Private` **setWalletData**(): `Promise`<[`Result`](../README.md#result)<`boolean`\>\>

Sets the wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<`boolean`\>\>

#### Defined in

[wallet/index.ts:251](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L251)

___

### setZeroIndexAddresses

▸ `Private` **setZeroIndexAddresses**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Will ensure that both address and change address indexes are set at index 0.
Will also generate and store address and changeAddress at index 0.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2418](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2418)

___

### setupTransaction

▸ **setupTransaction**(`params?`): [`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)

Sets up the transaction object with existing inputs and change address information
@async.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ISetupTransaction`](../interfaces/ISetupTransaction.md) |

#### Returns

[`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)

#### Defined in

[wallet/index.ts:2305](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2305)

___

### switchNetwork

▸ **switchNetwork**(`network`, `servers?`): `Promise`<[`Result`](../README.md#result)<[`Wallet`](Wallet.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | [`EAvailableNetworks`](../enums/EAvailableNetworks.md) |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`Wallet`](Wallet.md)\>\>

#### Defined in

[wallet/index.ts:185](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L185)

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

[wallet/index.ts:1177](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1177)

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

[wallet/index.ts:212](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L212)

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

[wallet/index.ts:1525](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1525)

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

[wallet/index.ts:1799](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1799)

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

[wallet/index.ts:1913](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1913)

___

### updateTransactions

▸ `Private` **updateTransactions**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<`undefined` \| `string`\>\>

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

[wallet/index.ts:1546](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L1546)

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

[wallet/index.ts:2227](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L2227)

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

[wallet/index.ts:167](https://github.com/synonymdev/beignet/blob/6c60ef8/src/wallet/index.ts#L167)
