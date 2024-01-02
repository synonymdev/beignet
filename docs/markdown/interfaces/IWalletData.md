[beignet](../README.md) / IWalletData

# Interface: IWalletData

## Table of contents

### Properties

- [addressIndex](IWalletData.md#addressindex)
- [addressType](IWalletData.md#addresstype)
- [addresses](IWalletData.md#addresses)
- [balance](IWalletData.md#balance)
- [blacklistedUtxos](IWalletData.md#blacklistedutxos)
- [boostedTransactions](IWalletData.md#boostedtransactions)
- [changeAddressIndex](IWalletData.md#changeaddressindex)
- [changeAddresses](IWalletData.md#changeaddresses)
- [exchangeRates](IWalletData.md#exchangerates)
- [feeEstimates](IWalletData.md#feeestimates)
- [header](IWalletData.md#header)
- [id](IWalletData.md#id)
- [lastUsedAddressIndex](IWalletData.md#lastusedaddressindex)
- [lastUsedChangeAddressIndex](IWalletData.md#lastusedchangeaddressindex)
- [selectedFeeId](IWalletData.md#selectedfeeid)
- [transaction](IWalletData.md#transaction)
- [transactions](IWalletData.md#transactions)
- [unconfirmedTransactions](IWalletData.md#unconfirmedtransactions)
- [utxos](IWalletData.md#utxos)

## Properties

### addressIndex

• **addressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:155](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L155)

___

### addressType

• **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[types/wallet.ts:151](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L151)

___

### addresses

• **addresses**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddresses`](IAddresses.md)\>

#### Defined in

[types/wallet.ts:153](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L153)

___

### balance

• **balance**: `number`

#### Defined in

[types/wallet.ts:165](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L165)

___

### blacklistedUtxos

• **blacklistedUtxos**: [`IUtxo`](IUtxo.md)[]

#### Defined in

[types/wallet.ts:160](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L160)

___

### boostedTransactions

• **boostedTransactions**: [`IBoostedTransactions`](IBoostedTransactions.md)

#### Defined in

[types/wallet.ts:163](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L163)

___

### changeAddressIndex

• **changeAddressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:156](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L156)

___

### changeAddresses

• **changeAddresses**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddresses`](IAddresses.md)\>

#### Defined in

[types/wallet.ts:154](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L154)

___

### exchangeRates

• **exchangeRates**: [`IExchangeRates`](IExchangeRates.md)

#### Defined in

[types/wallet.ts:167](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L167)

___

### feeEstimates

• **feeEstimates**: [`IOnchainFees`](IOnchainFees.md)

#### Defined in

[types/wallet.ts:168](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L168)

___

### header

• **header**: [`IHeader`](IHeader.md)

#### Defined in

[types/wallet.ts:152](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L152)

___

### id

• **id**: `string`

#### Defined in

[types/wallet.ts:150](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L150)

___

### lastUsedAddressIndex

• **lastUsedAddressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:157](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L157)

___

### lastUsedChangeAddressIndex

• **lastUsedChangeAddressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:158](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L158)

___

### selectedFeeId

• **selectedFeeId**: [`EFeeId`](../enums/EFeeId.md)

#### Defined in

[types/wallet.ts:166](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L166)

___

### transaction

• **transaction**: [`ISendTransaction`](ISendTransaction.md)

#### Defined in

[types/wallet.ts:164](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L164)

___

### transactions

• **transactions**: [`IFormattedTransactions`](IFormattedTransactions.md)

#### Defined in

[types/wallet.ts:162](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L162)

___

### unconfirmedTransactions

• **unconfirmedTransactions**: [`IFormattedTransactions`](IFormattedTransactions.md)

#### Defined in

[types/wallet.ts:161](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L161)

___

### utxos

• **utxos**: [`IUtxo`](IUtxo.md)[]

#### Defined in

[types/wallet.ts:159](https://github.com/synonymdev/beignet/blob/88520f5/src/types/wallet.ts#L159)
