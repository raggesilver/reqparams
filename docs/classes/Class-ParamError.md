[internal/error-defaults](../modules/Module-internal/error-defaults).ParamError

During the param validation, any validate function may throw a ParamError
indicating that because of a specific parameter the current payload is
invalid.

## Hierarchy

- `Error`

  ↳ **`ParamError`**

## Table of contents

### Constructors

- [constructor](./Class-ParamError#constructor)

### Properties

- [extraData](./Class-ParamError#extradata)
- [message](./Class-ParamError#message)
- [name](./Class-ParamError#name)
- [param](./Class-ParamError#param)
- [paramPath](./Class-ParamError#parampath)
- [specificError](./Class-ParamError#specificerror)
- [stack](./Class-ParamError#stack)
- [type](./Class-ParamError#type)
- [prepareStackTrace](./Class-ParamError#preparestacktrace)
- [stackTraceLimit](./Class-ParamError#stacktracelimit)

### Methods

- [toString](./Class-ParamError#tostring)
- [captureStackTrace](./Class-ParamError#capturestacktrace)

## Constructors

### constructor

• **new ParamError**(`param`, `paramPath`, `type`, `errorMessage?`, `specificError?`, `extraData?`)

TODO: update the param descriptions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param` | [`Param`](../interfaces/Interface-Param) | - |
| `paramPath` | `string` | The parameter path (e.g.: 'user.name.first'). |
| `type` | [`ErrorType`](../enums/Enumeration-ErrorType) | The error type. |
| `errorMessage?` | `string` | - |
| `specificError?` | `string` | Validate functions may want to communicate what specific error occurred as opposed to just setting the error type. Setting this parameter may alter the output of errorMessageComposer. The naming convention used for specific errors is to use the validate function name. That is, if this error was thrown in the `notEmpty` validate function, the `specificError` will be `notEmpty`. |
| `extraData?` | `Record`<`string`, `any`\> | Extra data on the specific error. |

#### Overrides

Error.constructor

#### Defined in

src/internal/error-defaults.ts:40

## Properties

### extraData

• `Optional` **extraData**: `Record`<`string`, `any`\>

#### Defined in

src/internal/error-defaults.ts:22

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: `string` = `'ParamError'`

#### Overrides

Error.name

#### Defined in

src/internal/error-defaults.ts:17

___

### param

• **param**: [`Param`](../interfaces/Interface-Param)

#### Defined in

src/internal/error-defaults.ts:20

___

### paramPath

• **paramPath**: `string`

#### Defined in

src/internal/error-defaults.ts:19

___

### specificError

• `Optional` **specificError**: `string`

#### Defined in

src/internal/error-defaults.ts:21

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

___

### type

• **type**: [`ErrorType`](../enums/Enumeration-ErrorType)

#### Defined in

src/internal/error-defaults.ts:18

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

src/internal/error-defaults.ts:58

___

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
