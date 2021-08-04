## Table of contents

### Classes

- [ParamError](../../classes/Class-ParamError)

### Type aliases

- [ErrorMessageFunction](./error-defaults#errormessagefunction)

### Variables

- [defaults](./error-defaults#defaults)

## Type aliases

### ErrorMessageFunction

Ƭ **ErrorMessageFunction**: (`name`: `string`, `error`: [`ParamError`](../../classes/Class-ParamError)) => `string`

#### Type declaration

▸ (`name`, `error`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `error` | [`ParamError`](../../classes/Class-ParamError) |

##### Returns

`string`

#### Defined in

src/internal/error-defaults.ts:5

## Variables

### defaults

• `Const` **defaults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `errorMessages` | `Object` |
| `errorMessages.either` | [object Object] |
| `errorMessages.geq` | [object Object] |
| `errorMessages.gt` | [object Object] |
| `errorMessages.integer` | [object Object] |
| `errorMessages.leq` | [object Object] |
| `errorMessages.lt` | [object Object] |
| `errorMessages.max` | [object Object] |
| `errorMessages.min` | [object Object] |
| `errorMessages.notEmpty` | [object Object] |
| `errorMessages.notInEnum` | [object Object] |
| `errorMessages.unique` | [object Object] |
| `errorMessages.validId` | [object Object] |
| `onError` | (`_req`: `Request`, `res`: `Response`, `_next`: `NextFunction`, `msg`: `string`) => `Response`<`any`, `Record`<`string`, `any`\>\> |
| `transformers` | `Object` |
| `transformers.param` | `Object` |
| `transformers.param.pathToName` | (`path`: `string`) => `string` |
| `transformers.paramError` | `Object` |
| `transformers.paramError.toString` | (`error`: [`ParamError`](../../classes/Class-ParamError)) => `string` |

#### Defined in

src/internal/error-defaults.ts:198
