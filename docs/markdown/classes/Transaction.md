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
- [getTotalFee](Transaction.md#gettotalfee)
- [getTotalFeeObj](Transaction.md#gettotalfeeobj)
- [getTransactionInputValue](Transaction.md#gettransactioninputvalue)
- [getTransactionOutputValue](Transaction.md#gettransactionoutputvalue)
- [removeBlackListedUtxos](Transaction.md#removeblacklistedutxos)
- [resetSendTransaction](Transaction.md#resetsendtransaction)
- [sendMax](Transaction.md#sendmax)
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

[transaction/index.ts:39](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L39)

## Properties

### \_data

• `Private` **\_data**: [`ISendTransaction`](../interfaces/ISendTransaction.md)

#### Defined in

[transaction/index.ts:36](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L36)

___

### \_wallet

• `Private` `Readonly` **\_wallet**: [`Wallet`](Wallet.md)

#### Defined in

[transaction/index.ts:37](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L37)

## Accessors

### data

• `get` **data**(): [`ISendTransaction`](../interfaces/ISendTransaction.md)

#### Returns

[`ISendTransaction`](../interfaces/ISendTransaction.md)

#### Defined in

[transaction/index.ts:44](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L44)

## Methods

### addInput

▸ **addInput**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IAddInput`](../interfaces/IAddInput.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[transaction/index.ts:606](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L606)

___

### addOutput

▸ **addOutput**(`«destructured»`): [`Result`](../README.md#result)<`string`\>

Adds an output at the specified index to the current transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IOutput`](../interfaces/IOutput.md) |

#### Returns

[`Result`](../README.md#result)<`string`\>

#### Defined in

[transaction/index.ts:688](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L688)

___

### createPsbtFromTransactionData

▸ **createPsbtFromTransactionData**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`Psbt`\>\>

Returns a PSBT that includes unsigned funding inputs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `bip32Interface?` | `BIP32Interface` |
| › `shuffleTargets?` | `boolean` |
| › `transactionData` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<`Psbt`\>\>

#### Defined in

[transaction/index.ts:472](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L472)

___

### createTransaction

▸ **createTransaction**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<{ `hex`: `string` ; `id`: `string`  }\>\>

Creates complete signed transaction using the transaction data store

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ICreateTransaction`](../interfaces/ICreateTransaction.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<{ `hex`: `string` ; `id`: `string`  }\>\>

#### Defined in

[transaction/index.ts:348](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L348)

___

### estimateTransactionCosts

▸ **estimateTransactionCosts**(`«destructured»?`): [`Result`](../README.md#result)<{ `amount`: `number` ; `fee`: `number` ; `satsPerByte`: `number`  }\>

Calculates the max amount able to send for onchain/lightning

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `customFeeRate?` | `number` |
| › `transaction?` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

[`Result`](../README.md#result)<{ `amount`: `number` ; `fee`: `number` ; `satsPerByte`: `number`  }\>

#### Defined in

[transaction/index.ts:890](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L890)

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

[transaction/index.ts:332](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L332)

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
| › `satsPerByte?` | `number` |
| › `transaction?` | `Partial`<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

`number`

#### Defined in

[transaction/index.ts:201](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L201)

___

### getTotalFeeObj

▸ **getTotalFeeObj**(`«destructured»?`): [`Result`](../README.md#result)<[`TGetTotalFeeObj`](../README.md#tgettotalfeeobj)\>

Attempt to estimate the current fee for a given transaction and its UTXO's

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

[transaction/index.ts:254](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L254)

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

[transaction/index.ts:417](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L417)

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

[transaction/index.ts:705](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L705)

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

[transaction/index.ts:177](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L177)

___

### resetSendTransaction

▸ **resetSendTransaction**(): `Promise`<[`Result`](../README.md#result)<`string`\>\>

This completely resets the send transaction state.

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[transaction/index.ts:167](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L167)

___

### sendMax

▸ **sendMax**(`«destructured»?`): `Promise`<[`Result`](../README.md#result)<`string`\>\>

Sends the max amount to the provided output index.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `address?` | `string` |
| › `index?` | `number` |
| › `rbf?` | `boolean` |
| › `satsPerByte?` | `number` |
| › `transaction?` | `Partial`<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

`Promise`<[`Result`](../README.md#result)<`string`\>\>

#### Defined in

[transaction/index.ts:827](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L827)

___

### setupTransaction

▸ **setupTransaction**(`«destructured»?`): [`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)

Sets up a transaction for a given wallet by gathering inputs, setting the next available change address as an output and sets up the baseline fee structure.
This function will not override previously set transaction data. To do that you'll need to call resetSendTransaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ISetupTransaction`](../interfaces/ISetupTransaction.md) |

#### Returns

[`TSetupTransactionResponse`](../README.md#tsetuptransactionresponse)

#### Defined in

[transaction/index.ts:56](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L56)

___

### signPsbt

▸ **signPsbt**(`«destructured»`): `Promise`<[`Result`](../README.md#result)<`Psbt`\>\>

Loops through inputs and signs them

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `bip32Interface` | `BIP32Interface` |
| › `psbt` | `Psbt` |

#### Returns

`Promise`<[`Result`](../README.md#result)<`Psbt`\>\>

#### Defined in

[transaction/index.ts:441](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L441)

___

### updateFee

▸ **updateFee**(`«destructured»?`): [`Result`](../README.md#result)<{ `fee`: `number`  }\>

Updates the fee for the current transaction by the specified amount.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `index?` | `number` |
| › `satsPerByte` | `number` |
| › `transaction?` | [`ISendTransaction`](../interfaces/ISendTransaction.md) |

#### Returns

[`Result`](../README.md#result)<{ `fee`: `number`  }\>

#### Defined in

[transaction/index.ts:764](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L764)

___

### updateSendTransaction

▸ **updateSendTransaction**(`transaction`): [`Result`](../README.md#result)<`string`\>

This updates the transaction state used for sending.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `Object` |
| `transaction.transaction` | `Partial`<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

[`Result`](../README.md#result)<`string`\>

#### Defined in

[transaction/index.ts:730](https://github.com/synonymdev/beignet/blob/e4162f7/src/transaction/index.ts#L730)
