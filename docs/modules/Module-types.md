## Table of contents

### Enumerations

- [ESpecificError](../enums/Enumeration-ESpecificError)
- [ErrorType](../enums/Enumeration-ErrorType)

### Interfaces

- [Constructor](../interfaces/Interface-Constructor)
- [Param](../interfaces/Interface-Param)
- [Params](../interfaces/Interface-Params)

### Type aliases

- [ValidateFunction](./Module-types#validatefunction)

## Type aliases

### ValidateFunction

Ƭ **ValidateFunction**: (`val`: `any`, `req`: `Request`, `param`: [`Param`](../interfaces/Interface-Param), `path`: `string`, `source`: keyof `Request`) => `boolean` \| `string` \| [`LifecycleInstruction`](../classes/Class-LifecycleInstruction) \| `Promise`<`boolean` \| `string` \| [`LifecycleInstruction`](../classes/Class-LifecycleInstruction)\>

#### Type declaration

▸ (`val`, `req`, `param`, `path`, `source`): `boolean` \| `string` \| [`LifecycleInstruction`](../classes/Class-LifecycleInstruction) \| `Promise`<`boolean` \| `string` \| [`LifecycleInstruction`](../classes/Class-LifecycleInstruction)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |
| `req` | `Request` |
| `param` | [`Param`](../interfaces/Interface-Param) |
| `path` | `string` |
| `source` | keyof `Request` |

##### Returns

`boolean` \| `string` \| [`LifecycleInstruction`](../classes/Class-LifecycleInstruction) \| `Promise`<`boolean` \| `string` \| [`LifecycleInstruction`](../classes/Class-LifecycleInstruction)\>

#### Defined in

src/types.ts:4
