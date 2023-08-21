[beignet](../README.md) / IWallet

# Interface: IWallet

## Table of contents

### Properties

- [addressType](IWallet.md#addresstype)
- [data](IWallet.md#data)
- [electrumOptions](IWallet.md#electrumoptions)
- [getData](IWallet.md#getdata)
- [mnemonic](IWallet.md#mnemonic)
- [network](IWallet.md#network)
- [onMessage](IWallet.md#onmessage)
- [passphrase](IWallet.md#passphrase)
- [remainOffline](IWallet.md#remainoffline)
- [setData](IWallet.md#setdata)
- [storage](IWallet.md#storage)
- [walletName](IWallet.md#walletname)

## Properties

### addressType

• `Optional` **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[types/wallet.ts:172](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L172)

___

### data

• `Optional` **data**: [`IWalletData`](IWalletData.md)

#### Defined in

[types/wallet.ts:173](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L173)

___

### electrumOptions

• `Optional` **electrumOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `servers?` | [`TServer`](../README.md#tserver) \| [`TServer`](../README.md#tserver)[] |

#### Defined in

[types/wallet.ts:177](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L177)

___

### getData

• `Optional` **getData**: [`TGetData`](../README.md#tgetdata)

#### Defined in

[types/wallet.ts:174](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L174)

___

### mnemonic

• **mnemonic**: `string`

#### Defined in

[types/wallet.ts:168](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L168)

___

### network

• `Optional` **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[types/wallet.ts:171](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L171)

___

### onMessage

• `Optional` **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[types/wallet.ts:181](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L181)

___

### passphrase

• `Optional` **passphrase**: `string`

#### Defined in

[types/wallet.ts:170](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L170)

___

### remainOffline

• `Optional` **remainOffline**: `boolean`

#### Defined in

[types/wallet.ts:180](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L180)

___

### setData

• `Optional` **setData**: [`TSetData`](../README.md#tsetdata)

#### Defined in

[types/wallet.ts:175](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L175)

___

### storage

• `Optional` **storage**: [`TStorage`](../README.md#tstorage)

#### Defined in

[types/wallet.ts:176](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L176)

___

### walletName

• `Optional` **walletName**: `string`

#### Defined in

[types/wallet.ts:169](https://github.com/synonymdev/beignet/blob/8f99086/src/types/wallet.ts#L169)
