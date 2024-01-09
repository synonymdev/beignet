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

[types/wallet.ts:326](https://github.com/synonymdev/beignet/blob/583604f/src/types/wallet.ts#L326)

___

### id

• **id**: `number`

#### Defined in

[types/wallet.ts:323](https://github.com/synonymdev/beignet/blob/583604f/src/types/wallet.ts#L323)

___

### jsonrpc

• **jsonrpc**: `string`

#### Defined in

[types/wallet.ts:324](https://github.com/synonymdev/beignet/blob/583604f/src/types/wallet.ts#L324)

___

### param

• **param**: `string`

#### Defined in

[types/wallet.ts:325](https://github.com/synonymdev/beignet/blob/583604f/src/types/wallet.ts#L325)

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

[types/wallet.ts:327](https://github.com/synonymdev/beignet/blob/583604f/src/types/wallet.ts#L327)
