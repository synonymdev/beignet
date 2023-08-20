[beignet](../README.md) / ITransaction

# Interface: ITransaction<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [data](ITransaction.md#data)
- [id](ITransaction.md#id)
- [jsonrpc](ITransaction.md#jsonrpc)
- [param](ITransaction.md#param)
- [result](ITransaction.md#result)

## Properties

### data

• **data**: `T`

#### Defined in

[types/wallet.ts:293](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L293)

___

### id

• **id**: `number`

#### Defined in

[types/wallet.ts:290](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L290)

___

### jsonrpc

• **jsonrpc**: `string`

#### Defined in

[types/wallet.ts:291](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L291)

___

### param

• **param**: `string`

#### Defined in

[types/wallet.ts:292](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L292)

___

### result

• **result**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockhash` | `string` |
| `blocktime?` | `number` |
| `confirmations` | `number` |
| `hash` | `string` |
| `hex` | `string` |
| `locktime` | `number` |
| `size` | `number` |
| `time?` | `number` |
| `txid` | `string` |
| `version` | `number` |
| `vin` | [`IVin`](IVin.md)[] |
| `vout` | [`IVout`](IVout.md)[] |
| `vsize` | `number` |
| `weight` | `number` |

#### Defined in

[types/wallet.ts:294](https://github.com/coreyphillips/beignet/blob/f8e8e28/src/types/wallet.ts#L294)
