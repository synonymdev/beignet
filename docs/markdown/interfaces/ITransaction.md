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

[types/wallet.ts:320](https://github.com/synonymdev/beignet/blob/6c60ef8/src/types/wallet.ts#L320)

___

### id

• **id**: `number`

#### Defined in

[types/wallet.ts:317](https://github.com/synonymdev/beignet/blob/6c60ef8/src/types/wallet.ts#L317)

___

### jsonrpc

• **jsonrpc**: `string`

#### Defined in

[types/wallet.ts:318](https://github.com/synonymdev/beignet/blob/6c60ef8/src/types/wallet.ts#L318)

___

### param

• **param**: `string`

#### Defined in

[types/wallet.ts:319](https://github.com/synonymdev/beignet/blob/6c60ef8/src/types/wallet.ts#L319)

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

[types/wallet.ts:321](https://github.com/synonymdev/beignet/blob/6c60ef8/src/types/wallet.ts#L321)
