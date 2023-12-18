[beignet](../README.md) / IWallet

# Interface: IWallet

## Table of contents

### Properties

- [addressType](IWallet.md#addresstype)
- [customGetAddress](IWallet.md#customgetaddress)
- [customGetScriptHash](IWallet.md#customgetscripthash)
- [data](IWallet.md#data)
- [electrumOptions](IWallet.md#electrumoptions)
- [id](IWallet.md#id)
- [mnemonic](IWallet.md#mnemonic)
- [name](IWallet.md#name)
- [network](IWallet.md#network)
- [onMessage](IWallet.md#onmessage)
- [passphrase](IWallet.md#passphrase)
- [rbf](IWallet.md#rbf)
- [remainOffline](IWallet.md#remainoffline)
- [selectedFeeId](IWallet.md#selectedfeeid)
- [storage](IWallet.md#storage)

## Properties

### addressType

• `Optional` **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[types/wallet.ts:187](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L187)

___

### customGetAddress

• `Optional` **customGetAddress**: (`data`: [`ICustomGetAddress`](ICustomGetAddress.md)) => `Promise`\<[`Result`](../README.md#result)\<[`IGetAddressResponse`](IGetAddressResponse.md)\>\>

#### Type declaration

▸ (`data`): `Promise`\<[`Result`](../README.md#result)\<[`IGetAddressResponse`](IGetAddressResponse.md)\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetAddress`](ICustomGetAddress.md) |

##### Returns

`Promise`\<[`Result`](../README.md#result)\<[`IGetAddressResponse`](IGetAddressResponse.md)\>\>

#### Defined in

[types/wallet.ts:197](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L197)

___

### customGetScriptHash

• `Optional` **customGetScriptHash**: (`data`: [`ICustomGetScriptHash`](ICustomGetScriptHash.md)) => `Promise`\<`string`\>

#### Type declaration

▸ (`data`): `Promise`\<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetScriptHash`](ICustomGetScriptHash.md) |

##### Returns

`Promise`\<`string`\>

#### Defined in

[types/wallet.ts:200](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L200)

___

### data

• `Optional` **data**: [`IWalletData`](IWalletData.md)

#### Defined in

[types/wallet.ts:188](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L188)

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

[types/wallet.ts:190](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L190)

___

### id

• `Optional` **id**: `string`

#### Defined in

[types/wallet.ts:183](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L183)

___

### mnemonic

• **mnemonic**: `string`

#### Defined in

[types/wallet.ts:182](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L182)

___

### name

• `Optional` **name**: `string`

#### Defined in

[types/wallet.ts:184](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L184)

___

### network

• `Optional` **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[types/wallet.ts:186](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L186)

___

### onMessage

• `Optional` **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[types/wallet.ts:196](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L196)

___

### passphrase

• `Optional` **passphrase**: `string`

#### Defined in

[types/wallet.ts:185](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L185)

___

### rbf

• `Optional` **rbf**: `boolean`

#### Defined in

[types/wallet.ts:201](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L201)

___

### remainOffline

• `Optional` **remainOffline**: `boolean`

#### Defined in

[types/wallet.ts:195](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L195)

___

### selectedFeeId

• `Optional` **selectedFeeId**: [`EFeeId`](../enums/EFeeId.md)

#### Defined in

[types/wallet.ts:202](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L202)

___

### storage

• `Optional` **storage**: [`TStorage`](../README.md#tstorage)

#### Defined in

[types/wallet.ts:189](https://github.com/synonymdev/beignet/blob/7c83290/src/types/wallet.ts#L189)
