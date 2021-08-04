[param-builder/default](../modules/Module-param-builder/default).default

## Hierarchy

- **`default`**

  ↳ [`Enum`](./Class-Enum)

  ↳ [`LessGreater`](./Class-LessGreater)

  ↳ [`MinMax`](./Class-MinMax)

  ↳ [`NotEmpty`](./Class-NotEmpty)

  ↳ [`NumberBuilder`](./Class-NumberBuilder)

  ↳ [`StringBuilder`](./Class-StringBuilder)

## Implements

- [`Param`](../interfaces/Interface-Param)

## Table of contents

### Constructors

- [constructor](./Class-default#constructor)

### Properties

- [either](./Class-default#either)
- [enum](./Class-default#enum)
- [enumCmp](./Class-default#enumcmp)
- [name](./Class-default#name)
- [nullable](./Class-default#nullable)
- [required](./Class-default#required)
- [type](./Class-default#type)
- [validate](./Class-default#validate)

### Methods

- [isRequired](./Class-default#isrequired)
- [notRequired](./Class-default#notrequired)
- [setName](./Class-default#setname)
- [setRequired](./Class-default#setrequired)

## Constructors

### constructor

• `Protected` **new default**(`type`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`Constructor`](../interfaces/Interface-Constructor) |

#### Defined in

src/param-builder/default.ts:33

## Properties

### either

• **either**: `undefined` \| `string` \| `number`

#### Implementation of

[Param](../interfaces/Interface-Param).[either](../interfaces/Interface-Param#either)

#### Defined in

src/param-builder/default.ts:24

___

### enum

• **enum**: `undefined` \| (`string` \| `number` \| `boolean` \| `Date`)[]

Only allow values contained in this array. This will be executed BEFORE
the validate functions.

#### Implementation of

[Param](../interfaces/Interface-Param).[enum](../interfaces/Interface-Param#enum)

#### Defined in

src/param-builder/default.ts:25

___

### enumCmp

• **enumCmp**: `undefined` \| (`a`: `any`, `b`: `any`) => `boolean`

#### Implementation of

[Param](../interfaces/Interface-Param).[enumCmp](../interfaces/Interface-Param#enumcmp)

#### Defined in

src/param-builder/default.ts:26

___

### name

• **name**: `undefined` \| `string`

#### Implementation of

[Param](../interfaces/Interface-Param).[name](../interfaces/Interface-Param#name)

#### Defined in

src/param-builder/default.ts:27

___

### nullable

• **nullable**: `boolean` = `false`

Whether or not `null` is accepted.

#### Implementation of

[Param](../interfaces/Interface-Param).[nullable](../interfaces/Interface-Param#nullable)

#### Defined in

src/param-builder/default.ts:28

___

### required

• **required**: (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\>

#### Type declaration

▸ (`req`): `boolean` \| `Promise`<`boolean`\>

Whether or not the parameter is required (default `true`). Starting from
v4.0.0 `required: false` no longer implies `nullable: true`.

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |

##### Returns

`boolean` \| `Promise`<`boolean`\>

#### Implementation of

[Param](../interfaces/Interface-Param).[required](../interfaces/Interface-Param#required)

#### Defined in

src/param-builder/default.ts:29

___

### type

• **type**: [`Constructor`](../interfaces/Interface-Constructor)

A type constructor to check against the payload value (ie. Array, String,
Number, Boolean...).

#### Implementation of

[Param](../interfaces/Interface-Param).[type](../interfaces/Interface-Param#type)

#### Defined in

src/param-builder/default.ts:30

___

### validate

• **validate**: [`ValidateFunction`](../modules/Module-types#validatefunction)[] = `[]`

A function (or array of) that receive the value present in the payload
and returns whether or not that value is valid. It may also return a
string which implies the value is invalid and the string will be used
as the error message.

#### Implementation of

[Param](../interfaces/Interface-Param).[validate](../interfaces/Interface-Param#validate)

#### Defined in

src/param-builder/default.ts:31

## Methods

### isRequired

▸ **isRequired**(`req`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |

#### Returns

`Promise`<`boolean`\>

#### Defined in

src/param-builder/default.ts:53

___

### notRequired

▸ **notRequired**(): [`default`](./Class-default)

#### Returns

[`default`](./Class-default)

#### Defined in

src/param-builder/default.ts:38

___

### setName

▸ **setName**(`name`): [`default`](./Class-default)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`default`](./Class-default)

#### Defined in

src/param-builder/default.ts:48

___

### setRequired

▸ **setRequired**(`isRequired?`): [`default`](./Class-default)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRequired` | `boolean` \| (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\> | `true` |

#### Returns

[`default`](./Class-default)

#### Defined in

src/param-builder/default.ts:42
