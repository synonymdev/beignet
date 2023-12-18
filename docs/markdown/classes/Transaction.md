[beignet](../README.md) / Transaction

# Class: Transaction

## Table of contents

### Constructors

- [constructor](Transaction.md#constructor)

### Properties

- [\_data](Transaction.md#_data)
- [\_wallet](Transaction.md#_wallet)

### Accessors

- [data](Transaction.md#data)

### Methods

- [addInput](Transaction.md#addinput)
- [addOutput](Transaction.md#addoutput)
- [createPsbtFromTransactionData](Transaction.md#createpsbtfromtransactiondata)
- [createTransaction](Transaction.md#createtransaction)
- [estimateTransactionCosts](Transaction.md#estimatetransactioncosts)
- [getMaxSatsPerByte](Transaction.md#getmaxsatsperbyte)
- [getMaxSendAmount](Transaction.md#getmaxsendamount)
- [getTotalFee](Transaction.md#gettotalfee)
- [getTotalFeeObj](Transaction.md#gettotalfeeobj)
- [getTransactionInputValue](Transaction.md#gettransactioninputvalue)
- [getTransactionOutputValue](Transaction.md#gettransactionoutputvalue)
- [removeBlackListedUtxos](Transaction.md#removeblacklistedutxos)
- [resetSendTransaction](Transaction.md#resetsendtransaction)
- [sendMax](Transaction.md#sendmax)
- [setupCpfp](Transaction.md#setupcpfp)
- [setupTransaction](Transaction.md#setuptransaction)
- [signPsbt](Transaction.md#signpsbt)
- [updateFee](Transaction.md#updatefee)
- [updateSendTransaction](Transaction.md#updatesendtransaction)

## Constructors

### constructor

• **new Transaction**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `wallet` | [`Wallet`](Wallet.md) |

#### Defined in

[transaction/index.ts:41](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L41)

## Properties

### \_data

• `Private` **\_data**: [`ISendTransaction`](../interfaces/ISendTransaction.md)

#### Defined in

[transaction/index.ts:38](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L38)

___

### \_wallet

• `Private` `Readonly` **\_wallet**: [`Wallet`](Wallet.md)

#### Defined in

[transaction/index.ts:39](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L39)

## Accessors

### data

• `get` **data**(): [`ISendTransaction`](../interfaces/ISendTransaction.md)

#### Returns

[`ISendTransaction`](../interfaces/ISendTransaction.md)

#### Defined in

[transaction/index.ts:46](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L46)

## Methods

### addInput

▸ **addInput**(`«destructured»`): `Promise`\<[`Result`](../README.md#result)\<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IAddInput`](../interfaces/IAddInput.md) |

#### Returns

`Promise`\<[`Result`](../README.md#result)\<`string`\>\>

#### Defined in

[transaction/index.ts:621](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L621)

___

### addOutput

▸ **addOutput**(`«destructured»`): `Promise`\<[`Result`](../README.md#result)\<`string`\>\>

Adds an output at the specified index to the current transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IOutput`](../interfaces/IOutput.md) |

#### Returns

`Promise`\<[`Result`](../README.md#result)\<`string`\>\>

#### Defined in

[transaction/index.ts:703](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L703)

___

### createPsbtFromTransactionData

▸ **createPsbtFromTransactionData**(`«destructured»`): `Promise`\<[`Result`](../README.md#result)\<`Psbt`\>\>

Returns a PSBT that includes unsigned funding inputs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `bip32Interface?` | `BIP32Interface` |
| › `shuffleTargets?` | `boolean` |
| › `transactionData` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

`Promise`\<[`Result`](../README.md#result)\<`Psbt`\>\>

#### Defined in

[transaction/index.ts:487](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L487)

___

### createTransaction

▸ **createTransaction**(`«destructured»?`): `Promise`\<[`Result`](../README.md#result)\<\{ `hex`: `string` ; `id`: `string`  }\>\>

Creates complete signed transaction using the transaction data store

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ICreateTransaction`](../interfaces/ICreateTransaction.md) |

#### Returns

`Promise`\<[`Result`](../README.md#result)\<\{ `hex`: `string` ; `id`: `string`  }\>\>

#### Defined in

[transaction/index.ts:363](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L363)

___

### estimateTransactionCosts

▸ **estimateTransactionCosts**(`«destructured»?`): [`Result`](../README.md#result)\<\{ `amount`: `number` ; `fee`: `number` ; `satsPerByte`: `number`  }\>

Calculates the max amount able to send for onchain/lightning

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `customFeeRate?` | `number` |
| › `transaction?` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

[`Result`](../README.md#result)\<\{ `amount`: `number` ; `fee`: `number` ; `satsPerByte`: `number`  }\>

#### Defined in

[transaction/index.ts:917](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L917)

___

### getMaxSatsPerByte

▸ **getMaxSatsPerByte**(`«destructured»`): `number`

Returns the maximum sats per byte that can be used for a given transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `balance?` | `number` |
| › `transactionByteCount` | `number` |

#### Returns

`number`

#### Defined in

[transaction/index.ts:347](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L347)

___

### getMaxSendAmount

▸ **getMaxSendAmount**(`«destructured»`): [`Result`](../README.md#result)\<\{ `amount`: `number` ; `fee?`: `number`  }\>

Calculates the max amount able to send for the provided/current onchain transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `satsPerByte` | `number` |
| › `selectedFeeId?` | [`EFeeId`](../enums/EFeeId.md) |
| › `transaction?` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

[`Result`](../README.md#result)\<\{ `amount`: `number` ; `fee?`: `number`  }\>

#### Defined in

[transaction/index.ts:982](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L982)

___

### getTotalFee

▸ **getTotalFee**(`«destructured»?`): `number`

Attempt to estimate the current fee for a given transaction and its UTXO's

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `fundingLightning?` | `boolean` |
| › `message?` | `string` |
| › `satsPerByte` | `number` |
| › `transaction?` | `Partial`\<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

`number`

#### Defined in

[transaction/index.ts:216](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L216)

___

### getTotalFeeObj

▸ **getTotalFeeObj**(`«destructured»?`): [`Result`](../README.md#result)\<[`TGetTotalFeeObj`](../README.md#tgettotalfeeobj)\>

Attempt to estimate the current fee for a given transaction and its UTXO's

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `fundingLightning?` | `boolean` |
| › `message?` | `string` |
| › `satsPerByte?` | `number` |
| › `transaction?` | `Partial`\<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

[`Result`](../README.md#result)\<[`TGetTotalFeeObj`](../README.md#tgettotalfeeobj)\>

#### Defined in

[transaction/index.ts:269](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L269)

___

### getTransactionInputValue

▸ **getTransactionInputValue**(`inputs?`): `number`

Returns total value of all utxos.

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputs?` | `Object` |
| `inputs.inputs?` | [`IUtxo`](../interfaces/IUtxo.md)[] |

#### Returns

`number`

#### Defined in

[transaction/index.ts:432](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L432)

___

### getTransactionOutputValue

▸ **getTransactionOutputValue**(`outputs?`): `number`

Returns total value of all outputs. Excludes any value that would be sent to the change address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `outputs?` | `Object` |
| `outputs.outputs?` | [`IOutput`](../interfaces/IOutput.md)[] |

#### Returns

`number`

#### Defined in

[transaction/index.ts:724](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L724)

___

### removeBlackListedUtxos

▸ **removeBlackListedUtxos**(`utxos?`): [`IUtxo`](../interfaces/IUtxo.md)[]

Removes blacklisted UTXO's from the UTXO array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `utxos?` | [`IUtxo`](../interfaces/IUtxo.md)[] |

#### Returns

[`IUtxo`](../interfaces/IUtxo.md)[]

#### Defined in

[transaction/index.ts:192](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L192)

___

### resetSendTransaction

▸ **resetSendTransaction**(): `Promise`\<[`Result`](../README.md#result)\<`string`\>\>

This completely resets the send transaction state.

#### Returns

`Promise`\<[`Result`](../README.md#result)\<`string`\>\>

#### Defined in

[transaction/index.ts:182](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L182)

___

### sendMax

▸ **sendMax**(`«destructured»?`): `Promise`\<[`Result`](../README.md#result)\<`string`\>\>

Toggles the max amount to the provided output index.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `address?` | `string` |
| › `index?` | `number` |
| › `rbf?` | `boolean` |
| › `satsPerByte?` | `number` |
| › `transaction?` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

`Promise`\<[`Result`](../README.md#result)\<`string`\>\>

#### Defined in

[transaction/index.ts:852](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L852)

___

### setupCpfp

▸ **setupCpfp**(`«destructured»?`): `Promise`\<[`Result`](../README.md#result)\<[`ISendTransaction`](../interfaces/ISendTransaction.md)\>\>

Sets up a CPFP transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `satsPerByte?` | `number` |
| › `txid?` | `string` |

#### Returns

`Promise`\<[`Result`](../README.md#result)\<[`ISendTransaction`](../interfaces/ISendTransaction.md)\>\>

#### Defined in

[transaction/index.ts:1044](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L1044)

___

### setupTransaction

▸ **setupTransaction**(`«destructured»?`): `Promise`\<[`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)\>

Sets up a transaction for a given wallet by gathering inputs, setting the next available change address as an output and sets up the baseline fee structure.
This function will not override previously set transaction data. To do that you'll need to call resetSendTransaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ISetupTransaction`](../interfaces/ISetupTransaction.md) |

#### Returns

`Promise`\<[`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)\>

#### Defined in

[transaction/index.ts:59](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L59)

___

### signPsbt

▸ **signPsbt**(`«destructured»`): `Promise`\<[`Result`](../README.md#result)\<`Psbt`\>\>

Loops through inputs and signs them

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `bip32Interface` | `BIP32Interface` |
| › `psbt` | `Psbt` |

#### Returns

`Promise`\<[`Result`](../README.md#result)\<`Psbt`\>\>

#### Defined in

[transaction/index.ts:456](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L456)

___

### updateFee

▸ **updateFee**(`«destructured»?`): [`Result`](../README.md#result)\<\{ `fee`: `number`  }\>

Updates the fee for the current transaction by the specified amount.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `index?` | `number` |
| › `satsPerByte` | `number` |
| › `selectedFeeId?` | [`EFeeId`](../enums/EFeeId.md) |
| › `transaction?` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

[`Result`](../README.md#result)\<\{ `fee`: `number`  }\>

#### Defined in

[transaction/index.ts:786](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L786)

___

### updateSendTransaction

▸ **updateSendTransaction**(`transaction`): [`Result`](../README.md#result)\<`string`\>

This updates the transaction state used for sending.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `Object` |
| `transaction.transaction` | `Partial`\<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

[`Result`](../README.md#result)\<`string`\>

#### Defined in

[transaction/index.ts:749](https://github.com/synonymdev/beignet/blob/7c83290/src/transaction/index.ts#L749)
