[beignet](../README.md) / Wallet

# Class: Wallet

## Table of contents

### Constructors

- [constructor](Wallet.md#constructor)

### Properties

- [addressType](Wallet.md#addresstype)
- [data](Wallet.md#data)
- [electrum](Wallet.md#electrum)
- [electrumOptions](Wallet.md#electrumoptions)
- [exchangeRates](Wallet.md#exchangerates)
- [feeEstimates](Wallet.md#feeestimates)
- [getData](Wallet.md#getdata)
- [header](Wallet.md#header)
- [mnemonic](Wallet.md#mnemonic)
- [network](Wallet.md#network)
- [onMessage](Wallet.md#onmessage)
- [passphrase](Wallet.md#passphrase)
- [root](Wallet.md#root)
- [seed](Wallet.md#seed)
- [setData](Wallet.md#setdata)
- [transaction](Wallet.md#transaction)
- [walletName](Wallet.md#walletname)

### Methods

- [\_getAddress](Wallet.md#_getaddress)
- [addAddresses](Wallet.md#addaddresses)
- [addUnconfirmedTransactions](Wallet.md#addunconfirmedtransactions)
- [blockHeightToConfirmations](Wallet.md#blockheighttoconfirmations)
- [checkElectrumConnection](Wallet.md#checkelectrumconnection)
- [checkUnconfirmedTransactions](Wallet.md#checkunconfirmedtransactions)
- [clearAddresses](Wallet.md#clearaddresses)
- [clearTransactions](Wallet.md#cleartransactions)
- [clearUtxos](Wallet.md#clearutxos)
- [confirmationsToBlockHeight](Wallet.md#confirmationstoblockheight)
- [connectToElectrum](Wallet.md#connecttoelectrum)
- [decodeOpReturnMessage](Wallet.md#decodeopreturnmessage)
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
- [getChangeAddress](Wallet.md#getchangeaddress)
- [getExchangeRate](Wallet.md#getexchangerate)
- [getFeeEstimates](Wallet.md#getfeeestimates)
- [getGapLimit](Wallet.md#getgaplimit)
- [getHighestStoredAddressIndex](Wallet.md#gethigheststoredaddressindex)
- [getInputData](Wallet.md#getinputdata)
- [getNextAvailableAddress](Wallet.md#getnextavailableaddress)
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
- [saveWalletData](Wallet.md#savewalletdata)
- [send](Wallet.md#send)
- [sendMany](Wallet.md#sendmany)
- [setWalletData](Wallet.md#setwalletdata)
- [setZeroIndexAddresses](Wallet.md#setzeroindexaddresses)
- [setupTransaction](Wallet.md#setuptransaction)
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

[wallet/index.ts:104](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L104)

## Properties

### addressType

• **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[wallet/index.ts:93](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L93)

___

### data

• **data**: [`IWalletData`](../interfaces/IWalletData.md)

#### Defined in

[wallet/index.ts:94](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L94)

___

### electrum

• **electrum**: [`Electrum`](Electrum.md)

#### Defined in

[wallet/index.ts:98](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L98)

___

### electrumOptions

• `Optional` **electrumOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Defined in

[wallet/index.ts:95](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L95)

___

### exchangeRates

• **exchangeRates**: [`IExchangeRates`](../interfaces/IExchangeRates.md)

#### Defined in

[wallet/index.ts:99](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L99)

___

### feeEstimates

• **feeEstimates**: [`IFees`](../interfaces/IFees.md)

#### Defined in

[wallet/index.ts:103](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L103)

___

### getData

• `Private` **getData**: [`TGetData`](../README.md#tgetdata)

#### Defined in

[wallet/index.ts:90](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L90)

___

### header

• **header**: [`IHeader`](../interfaces/IHeader.md)

#### Defined in

[wallet/index.ts:100](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L100)

___

### mnemonic

• `Private` `Readonly` **mnemonic**: `string`

#### Defined in

[wallet/index.ts:85](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L85)

___

### network

• **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[wallet/index.ts:92](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L92)

___

### onMessage

• `Optional` **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[wallet/index.ts:101](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L101)

___

### passphrase

• `Private` `Readonly` **passphrase**: `string`

#### Defined in

[wallet/index.ts:86](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L86)

___

### root

• `Private` `Readonly` **root**: `BIP32Interface`

#### Defined in

[wallet/index.ts:88](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L88)

___

### seed

• `Private` `Readonly` **seed**: `Buffer`

#### Defined in

[wallet/index.ts:87](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L87)

___

### setData

• `Private` `Optional` **setData**: [`TSetData`](../README.md#tsetdata)

#### Defined in

[wallet/index.ts:91](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L91)

___

### transaction

• **transaction**: [`Transaction`](Transaction.md)

#### Defined in

[wallet/index.ts:102](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L102)

___

### walletName

• `Private` `Readonly` **walletName**: `string`

#### Defined in

[wallet/index.ts:89](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L89)

## Methods

### \_getAddress

▸ `Private` **_getAddress**(`path`, `addressType`): [`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)

Returns the address for the specified path and address type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `addressType` | [`EAddressType`](../enums/EAddressType.md) |

#### Returns

[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)

#### Defined in

[wallet/index.ts:314](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L314)

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

[wallet/index.ts:962](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L962)

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

[wallet/index.ts:1827](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1827)

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

[wallet/index.ts:1870](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1870)

___

### checkElectrumConnection

▸ **checkElectrumConnection**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Ensures the connection to Electrum is still available.
Will attempt to reconnect if not initially available.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[wallet/index.ts:598](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L598)

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

[wallet/index.ts:1556](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1556)

___

### clearAddresses

▸ `Private` **clearAddresses**(): `Promise`<`string`\>

Clears the addresses and changeAddresses object for a given wallet and network.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:1789](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1789)

___

### clearTransactions

▸ `Private` **clearTransactions**(): `string`

Clears the transactions object for a given wallet and network from storage.

#### Returns

`string`

#### Defined in

[wallet/index.ts:1777](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1777)

___

### clearUtxos

▸ `Private` **clearUtxos**(): `Promise`<`string`\>

Clears the UTXO array and balance from storage.

#### Returns

`Promise`<`string`\>

**`Async`**

#### Defined in

[wallet/index.ts:1762](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1762)

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

[wallet/index.ts:1684](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1684)

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

[wallet/index.ts:426](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L426)

___

### decodeOpReturnMessage

▸ **decodeOpReturnMessage**(`opReturn?`): `string`[]

Returns an array of messages from an OP_RETURN message

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `opReturn` | `string` | `''` |

#### Returns

`string`[]

#### Defined in

[wallet/index.ts:2047](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2047)

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

[wallet/index.ts:1896](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1896)

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

[wallet/index.ts:489](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L489)

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

[wallet/index.ts:1255](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1255)

___

### getAddress

▸ **getAddress**(`«destructured»?`): `string`

Returns a single Bitcoin address based on the provided address type,
index and whether it is a change address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IGetAddress`](../interfaces/IGetAddress.md) |

#### Returns

`string`

#### Defined in

[wallet/index.ts:364](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L364)

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

[wallet/index.ts:447](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L447)

___

### getAddressByPath

▸ **getAddressByPath**(`«destructured»`): [`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>

Get address for a given keyPair, network and type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IGetAddressByPath`](../interfaces/IGetAddressByPath.md) |

#### Returns

[`Result`](../README.md#result)<[`IGetAddressResponse`](../interfaces/IGetAddressResponse.md)\>

#### Defined in

[wallet/index.ts:399](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L399)

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

[wallet/index.ts:2310](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2310)

___

### getAddressIndexInfo

▸ **getAddressIndexInfo**(): [`TAddressIndexInfo`](../README.md#taddressindexinfo)

Returns current address index information.

#### Returns

[`TAddressIndexInfo`](../README.md#taddressindexinfo)

#### Defined in

[wallet/index.ts:2382](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2382)

___

### getBalance

▸ **getBalance**(): `number`

Returns the known balance from storage.

#### Returns

`number`

#### Defined in

[wallet/index.ts:473](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L473)

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

[wallet/index.ts:293](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L293)

___

### getChangeAddress

▸ **getChangeAddress**(): `Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

Retrieves the next available change address data.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IAddress`](../interfaces/IAddress.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2148](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2148)

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

[wallet/index.ts:2123](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2123)

___

### getFeeEstimates

▸ **getFeeEstimates**(): `Promise`<[`IFees`](../interfaces/IFees.md)\>

Returns the current fee estimates for the provided network.

#### Returns

`Promise`<[`IFees`](../interfaces/IFees.md)\>

**`Async`**

#### Defined in

[wallet/index.ts:2180](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2180)

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

[wallet/index.ts:1347](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1347)

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

[wallet/index.ts:922](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L922)

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

[wallet/index.ts:2081](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2081)

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

[wallet/index.ts:614](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L614)

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

[wallet/index.ts:461](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L461)

___

### getUnconfirmedTransactions

▸ **getUnconfirmedTransactions**(): [`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

Returns the current wallet's unconfirmed transactions from storage.

#### Returns

[`IFormattedTransactions`](../interfaces/IFormattedTransactions.md)

#### Defined in

[wallet/index.ts:1672](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1672)

___

### getUtxos

▸ **getUtxos**(`scanAllAddresses`): `Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

Retrieves and sets UTXO's for the current wallet.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scanAllAddresses` | `Object` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetUtxosResponse`](../interfaces/IGetUtxosResponse.md)\>\>

#### Defined in

[wallet/index.ts:1385](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1385)

___

### getWalletData

▸ **getWalletData**(): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

Gets the wallet data object from storge if able.
Otherwise, it falls back to the default wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

#### Defined in

[wallet/index.ts:230](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L230)

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

[wallet/index.ts:221](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L221)

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

[wallet/index.ts:303](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L303)

___

### listUtxos

▸ **listUtxos**(): [`IUtxo`](../interfaces/IUtxo.md)[]

#### Returns

[`IUtxo`](../interfaces/IUtxo.md)[]

#### Defined in

[wallet/index.ts:1405](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1405)

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

[wallet/index.ts:1601](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1601)

___

### refreshWallet

▸ **refreshWallet**(`scanAllAddresses?`): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

Refreshes/Syncs the wallet data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scanAllAddresses` | `Object` |
| `scanAllAddresses.scanAllAddresses` | `undefined` \| `boolean` |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

#### Defined in

[wallet/index.ts:184](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L184)

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

[wallet/index.ts:1037](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1037)

___

### rescanAddresses

▸ **rescanAddresses**(`shouldClearAddresses?`): `Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

This method will clear the utxo array for each address type and reset the
address indexes back to the original/default app values. Once cleared & reset
the app will rescan the wallet's addresses from index zero.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shouldClearAddresses?` | `Object` | Clears and re-generates all addresses when true. |
| `shouldClearAddresses.shouldClearAddresses?` | `boolean` | - |

#### Returns

`Promise`<[`Result`](../README.md#result)<[`IWalletData`](../interfaces/IWalletData.md)\>\>

**`Async`**

#### Defined in

[wallet/index.ts:1738](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1738)

___

### resetAddressIndexes

▸ `Private` **resetAddressIndexes**(): `void`

Resets address indexes back to the app's default/original state.

#### Returns

`void`

#### Defined in

[wallet/index.ts:1229](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1229)

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

[wallet/index.ts:1417](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1417)

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

[wallet/index.ts:2285](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2285)

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

[wallet/index.ts:2230](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2230)

___

### setWalletData

▸ `Private` **setWalletData**(): `Promise`<[`Result`](../README.md#result)<`boolean`\>\>

Sets the wallet data object.

#### Returns

`Promise`<[`Result`](../README.md#result)<`boolean`\>\>

#### Defined in

[wallet/index.ts:207](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L207)

___

### setZeroIndexAddresses

▸ `Private` **setZeroIndexAddresses**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Will ensure that both address and change address indexes are set at index 0.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

**`Async`**

#### Defined in

[wallet/index.ts:2329](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2329)

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

[wallet/index.ts:2217](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2217)

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

[wallet/index.ts:1088](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1088)

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

[wallet/index.ts:174](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L174)

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

[wallet/index.ts:1429](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1429)

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

[wallet/index.ts:1708](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1708)

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

[wallet/index.ts:1804](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1804)

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

[wallet/index.ts:1450](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L1450)

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

[wallet/index.ts:2139](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L2139)

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

[wallet/index.ts:145](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/wallet/index.ts#L145)
