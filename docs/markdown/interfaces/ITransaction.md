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

[types/wallet.ts:332](https://github.com/synonymdev/beignet/blob/05d5011/src/types/wallet.ts#L332)

___

### id

• **id**: `number`

#### Defined in

[types/wallet.ts:329](https://github.com/synonymdev/beignet/blob/05d5011/src/types/wallet.ts#L329)

___

### jsonrpc

• **jsonrpc**: `string`

#### Defined in

[types/wallet.ts:330](https://github.com/synonymdev/beignet/blob/05d5011/src/types/wallet.ts#L330)

___

### param

• **param**: `string`

#### Defined in

[types/wallet.ts:331](https://github.com/synonymdev/beignet/blob/05d5011/src/types/wallet.ts#L331)

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

[types/wallet.ts:333](https://github.com/synonymdev/beignet/blob/05d5011/src/types/wallet.ts#L333)
