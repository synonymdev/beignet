[beignet](../README.md) / Transaction

# Class: Transaction

## Table of contents

### Constructors

- [constructor](Transaction.md#constructor)

### Properties

- [data](Transaction.md#data)
- [mnemonic](Transaction.md#mnemonic)
- [passphrase](Transaction.md#passphrase)
- [wallet](Transaction.md#wallet)

### Methods

- [addInput](Transaction.md#addinput)
- [createPsbtFromTransactionData](Transaction.md#createpsbtfromtransactiondata)
- [createTransaction](Transaction.md#createtransaction)
- [estimateTransactionCosts](Transaction.md#estimatetransactioncosts)
- [getBip32Interface](Transaction.md#getbip32interface)
- [getTotalFee](Transaction.md#gettotalfee)
- [getTransactionInputValue](Transaction.md#gettransactioninputvalue)
- [getTransactionOutputValue](Transaction.md#gettransactionoutputvalue)
- [removeBlackListedUtxos](Transaction.md#removeblacklistedutxos)
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
| › `mnemonic` | `string` |
| › `passphrase?` | `string` |
| › `wallet` | [`Wallet`](Wallet.md) |

#### Defined in

[transaction/index.ts:42](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L42)

## Properties

### data

• **data**: [`ISendTransaction`](../interfaces/ISendTransaction.md)

#### Defined in

[transaction/index.ts:37](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L37)

___

### mnemonic

• `Private` **mnemonic**: `string`

#### Defined in

[transaction/index.ts:39](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L39)

___

### passphrase

• `Private` **passphrase**: `string`

#### Defined in

[transaction/index.ts:40](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L40)

___

### wallet

• **wallet**: [`Wallet`](Wallet.md)

#### Defined in

[transaction/index.ts:38](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L38)

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

[transaction/index.ts:507](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L507)

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

[transaction/index.ts:372](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L372)

___

### createTransaction

▸ **createTransaction**(`transactionData?`): `Promise`<[`Result`](../README.md#result)<{ `hex`: `string` ; `id`: `string`  }\>\>

Creates complete signed transaction using the transaction data store

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionData?` | [`ICreateTransaction`](../interfaces/ICreateTransaction.md) |

#### Returns

`Promise`<[`Result`](../README.md#result)<{ `hex`: `string` ; `id`: `string`  }\>\>

#### Defined in

[transaction/index.ts:245](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L245)

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

[transaction/index.ts:780](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L780)

___

### getBip32Interface

▸ **getBip32Interface**(): `Promise`<[`Result`](../README.md#result)<`BIP32Interface`\>\>

Creates a BIP32Interface from the selected wallet's mnemonic and passphrase

#### Returns

`Promise`<[`Result`](../README.md#result)<`BIP32Interface`\>\>

#### Defined in

[transaction/index.ts:586](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L586)

___

### getTotalFee

▸ **getTotalFee**(`«destructured»`): `number`

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

[transaction/index.ts:195](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L195)

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

[transaction/index.ts:315](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L315)

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

[transaction/index.ts:599](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L599)

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

[transaction/index.ts:176](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L176)

___

### sendMax

▸ **sendMax**(`«destructured»?`): [`Result`](../README.md#result)<`string`\>

Sends the max amount to the provided output index.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `address?` | `string` |
| › `index?` | `number` |
| › `transaction?` | `Partial`<[`ISendTransaction`](../interfaces/ISendTransaction.md)\> |

#### Returns

[`Result`](../README.md#result)<`string`\>

#### Defined in

[transaction/index.ts:726](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L726)

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

[transaction/index.ts:65](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L65)

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

[transaction/index.ts:339](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L339)

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

[transaction/index.ts:660](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L660)

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

[transaction/index.ts:625](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/transaction/index.ts#L625)
