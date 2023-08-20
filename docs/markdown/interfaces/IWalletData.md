[beignet](../README.md) / IWalletData

# Interface: IWalletData

## Table of contents

### Properties

- [addressIndex](IWalletData.md#addressindex)
- [addressType](IWalletData.md#addresstype)
- [addresses](IWalletData.md#addresses)
- [balance](IWalletData.md#balance)
- [blacklistedUtxos](IWalletData.md#blacklistedutxos)
- [changeAddressIndex](IWalletData.md#changeaddressindex)
- [changeAddresses](IWalletData.md#changeaddresses)
- [exchangeRates](IWalletData.md#exchangerates)
- [header](IWalletData.md#header)
- [lastUsedAddressIndex](IWalletData.md#lastusedaddressindex)
- [lastUsedChangeAddressIndex](IWalletData.md#lastusedchangeaddressindex)
- [transaction](IWalletData.md#transaction)
- [transactions](IWalletData.md#transactions)
- [unconfirmedTransactions](IWalletData.md#unconfirmedtransactions)
- [utxos](IWalletData.md#utxos)

## Properties

### addressIndex

• **addressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:144](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L144)

___

### addressType

• **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[types/wallet.ts:140](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L140)

___

### addresses

• **addresses**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddresses`](IAddresses.md)\>

#### Defined in

[types/wallet.ts:142](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L142)

___

### balance

• **balance**: `number`

#### Defined in

[types/wallet.ts:153](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L153)

___

### blacklistedUtxos

• **blacklistedUtxos**: [`IUtxo`](IUtxo.md)[]

#### Defined in

[types/wallet.ts:149](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L149)

___

### changeAddressIndex

• **changeAddressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:145](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L145)

___

### changeAddresses

• **changeAddresses**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddresses`](IAddresses.md)\>

#### Defined in

[types/wallet.ts:143](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L143)

___

### exchangeRates

• **exchangeRates**: [`IExchangeRates`](IExchangeRates.md)

#### Defined in

[types/wallet.ts:154](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L154)

___

### header

• **header**: [`IHeader`](IHeader.md)

#### Defined in

[types/wallet.ts:141](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L141)

___

### lastUsedAddressIndex

• **lastUsedAddressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:146](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L146)

___

### lastUsedChangeAddressIndex

• **lastUsedChangeAddressIndex**: [`TAddressTypeContent`](../README.md#taddresstypecontent)<[`IAddress`](IAddress.md)\>

#### Defined in

[types/wallet.ts:147](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L147)

___

### transaction

• **transaction**: [`ISendTransaction`](ISendTransaction.md)

#### Defined in

[types/wallet.ts:152](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L152)

___

### transactions

• **transactions**: [`IFormattedTransactions`](IFormattedTransactions.md)

#### Defined in

[types/wallet.ts:151](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L151)

___

### unconfirmedTransactions

• **unconfirmedTransactions**: [`IFormattedTransactions`](IFormattedTransactions.md)

#### Defined in

[types/wallet.ts:150](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L150)

___

### utxos

• **utxos**: [`IUtxo`](IUtxo.md)[]

#### Defined in

[types/wallet.ts:148](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L148)
