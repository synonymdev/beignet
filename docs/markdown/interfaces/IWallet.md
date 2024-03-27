[beignet](../README.md) / IWallet

# Interface: IWallet

## Table of contents

### Properties

- [addressLookAhead](IWallet.md#addresslookahead)
- [addressLookBehind](IWallet.md#addresslookbehind)
- [addressType](IWallet.md#addresstype)
- [addressTypesToMonitor](IWallet.md#addresstypestomonitor)
- [customGetAddress](IWallet.md#customgetaddress)
- [customGetScriptHash](IWallet.md#customgetscripthash)
- [data](IWallet.md#data)
- [disableMessages](IWallet.md#disablemessages)
- [disableMessagesOnCreate](IWallet.md#disablemessagesoncreate)
- [electrumOptions](IWallet.md#electrumoptions)
- [gapLimitOptions](IWallet.md#gaplimitoptions)
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

### addressLookAhead

• `Optional` **addressLookAhead**: `number`

#### Defined in

[types/wallet.ts:213](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L213)

___

### addressLookBehind

• `Optional` **addressLookBehind**: `number`

#### Defined in

[types/wallet.ts:212](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L212)

___

### addressType

• `Optional` **addressType**: [`EAddressType`](../enums/EAddressType.md)

#### Defined in

[types/wallet.ts:190](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L190)

___

### addressTypesToMonitor

• `Optional` **addressTypesToMonitor**: [`EAddressType`](../enums/EAddressType.md)[]

#### Defined in

[types/wallet.ts:210](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L210)

___

### customGetAddress

• `Optional` **customGetAddress**: (`data`: [`ICustomGetAddress`](ICustomGetAddress.md)) => `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](IGetAddressResponse.md)\>\>

#### Type declaration

▸ (`data`): `Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](IGetAddressResponse.md)\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetAddress`](ICustomGetAddress.md) |

##### Returns

`Promise`<[`Result`](../README.md#result)<[`IGetAddressResponse`](IGetAddressResponse.md)\>\>

#### Defined in

[types/wallet.ts:202](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L202)

___

### customGetScriptHash

• `Optional` **customGetScriptHash**: (`data`: [`ICustomGetScriptHash`](ICustomGetScriptHash.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`data`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ICustomGetScriptHash`](ICustomGetScriptHash.md) |

##### Returns

`Promise`<`string`\>

#### Defined in

[types/wallet.ts:205](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L205)

___

### data

• `Optional` **data**: [`IWalletData`](IWalletData.md)

#### Defined in

[types/wallet.ts:191](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L191)

___

### disableMessages

• `Optional` **disableMessages**: `boolean`

#### Defined in

[types/wallet.ts:208](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L208)

___

### disableMessagesOnCreate

• `Optional` **disableMessagesOnCreate**: `boolean`

#### Defined in

[types/wallet.ts:209](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L209)

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

[types/wallet.ts:193](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L193)

___

### gapLimitOptions

• `Optional` **gapLimitOptions**: [`TGapLimitOptions`](../README.md#tgaplimitoptions)

#### Defined in

[types/wallet.ts:211](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L211)

___

### id

• `Optional` **id**: `string`

#### Defined in

[types/wallet.ts:186](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L186)

___

### mnemonic

• **mnemonic**: `string`

#### Defined in

[types/wallet.ts:185](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L185)

___

### name

• `Optional` **name**: `string`

#### Defined in

[types/wallet.ts:187](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L187)

___

### network

• `Optional` **network**: [`EAvailableNetworks`](../enums/EAvailableNetworks.md)

#### Defined in

[types/wallet.ts:189](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L189)

___

### onMessage

• `Optional` **onMessage**: [`TOnMessage`](../README.md#tonmessage)

#### Defined in

[types/wallet.ts:201](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L201)

___

### passphrase

• `Optional` **passphrase**: `string`

#### Defined in

[types/wallet.ts:188](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L188)

___

### rbf

• `Optional` **rbf**: `boolean`

#### Defined in

[types/wallet.ts:206](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L206)

___

### remainOffline

• `Optional` **remainOffline**: `boolean`

#### Defined in

[types/wallet.ts:200](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L200)

___

### selectedFeeId

• `Optional` **selectedFeeId**: [`EFeeId`](../enums/EFeeId.md)

#### Defined in

[types/wallet.ts:207](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L207)

___

### storage

• `Optional` **storage**: [`TStorage`](../README.md#tstorage)

#### Defined in

[types/wallet.ts:192](https://github.com/synonymdev/beignet/blob/3144d66/src/types/wallet.ts#L192)
