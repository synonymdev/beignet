[beignet](../README.md) / IGetAddressScriptHashBalances

# Interface: IGetAddressScriptHashBalances

## Table of contents

### Properties

- [data](IGetAddressScriptHashBalances.md#data)
- [error](IGetAddressScriptHashBalances.md#error)
- [id](IGetAddressScriptHashBalances.md#id)
- [method](IGetAddressScriptHashBalances.md#method)
- [network](IGetAddressScriptHashBalances.md#network)

## Properties

### data

• **data**: `string` \| { `data`: `Record`<`string`, `unknown`\> ; `id`: `number` ; `jsonrpc`: `string` ; `param`: `string` ; `result`: { `confirmed`: `number` ; `unconfirmed`: `number`  }  }[]

#### Defined in

[types/electrum.ts:88](https://github.com/synonymdev/beignet/blob/0e5dd24/src/types/electrum.ts#L88)

___

### error

• **error**: `boolean`

#### Defined in

[types/electrum.ts:87](https://github.com/synonymdev/beignet/blob/0e5dd24/src/types/electrum.ts#L87)

___

### id

• **id**: `number`

#### Defined in

[types/electrum.ts:100](https://github.com/synonymdev/beignet/blob/0e5dd24/src/types/electrum.ts#L100)

___

### method

• **method**: `string`

#### Defined in

[types/electrum.ts:101](https://github.com/synonymdev/beignet/blob/0e5dd24/src/types/electrum.ts#L101)

___

### network

• **network**: [`EElectrumNetworks`](../enums/EElectrumNetworks.md)

#### Defined in

[types/electrum.ts:102](https://github.com/synonymdev/beignet/blob/0e5dd24/src/types/electrum.ts#L102)
