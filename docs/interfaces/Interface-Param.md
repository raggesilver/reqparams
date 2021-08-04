[types](../modules/Module-types).Param

## Implemented by

- [`default`](../classes/Class-default)

## Table of contents

### Properties

- [either](./Interface-Param#either)
- [enum](./Interface-Param#enum)
- [name](./Interface-Param#name)
- [nullable](./Interface-Param#nullable)
- [type](./Interface-Param#type)
- [validate](./Interface-Param#validate)

### Methods

- [enumCmp](./Interface-Param#enumcmp)
- [required](./Interface-Param#required)

## Properties

### either

• `Optional` **either**: `string` \| `number`

#### Defined in

src/types.ts:39

___

### enum

• `Optional` **enum**: (`string` \| `number` \| `boolean` \| `Date`)[]

Only allow values contained in this array. This will be executed BEFORE
the validate functions.

#### Defined in

src/types.ts:49

___

### name

• `Optional` **name**: `string`

#### Defined in

src/types.ts:55

___

### nullable

• **nullable**: `boolean`

Whether or not `null` is accepted.

**`default`** false

#### Defined in

src/types.ts:44

___

### type

• **type**: [`Constructor`](./Interface-Constructor)

A type constructor to check against the payload value (ie. Array, String,
Number, Boolean...).

#### Defined in

src/types.ts:37

___

### validate

• **validate**: [`ValidateFunction`](../modules/Module-types#validatefunction)[]

A function (or array of) that receive the value present in the payload
and returns whether or not that value is valid. It may also return a
string which implies the value is invalid and the string will be used
as the error message.

#### Defined in

src/types.ts:27

## Methods

### enumCmp

▸ `Optional` **enumCmp**(`a`, `b`): `boolean`

A compare function to be used in the `enum` element comparison.

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `any` |
| `b` | `any` |

#### Returns

`boolean`

#### Defined in

src/types.ts:53

___

### required

▸ **required**(`req`): `boolean` \| `Promise`<`boolean`\>

Whether or not the parameter is required (default `true`). Starting from
v4.0.0 `required: false` no longer implies `nullable: true`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |

#### Returns

`boolean` \| `Promise`<`boolean`\>

#### Defined in

src/types.ts:32
