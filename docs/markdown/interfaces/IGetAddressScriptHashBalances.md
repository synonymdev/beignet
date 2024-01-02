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

[types/electrum.ts:65](https://github.com/synonymdev/beignet/blob/88520f5/src/types/electrum.ts#L65)

___

### error

• **error**: `boolean`

#### Defined in

[types/electrum.ts:64](https://github.com/synonymdev/beignet/blob/88520f5/src/types/electrum.ts#L64)

___

### id

• **id**: `number`

#### Defined in

[types/electrum.ts:77](https://github.com/synonymdev/beignet/blob/88520f5/src/types/electrum.ts#L77)

___

### method

• **method**: `string`

#### Defined in

[types/electrum.ts:78](https://github.com/synonymdev/beignet/blob/88520f5/src/types/electrum.ts#L78)

___

### network

• **network**: [`EElectrumNetworks`](../enums/EElectrumNetworks.md)

#### Defined in

[types/electrum.ts:79](https://github.com/synonymdev/beignet/blob/88520f5/src/types/electrum.ts#L79)
