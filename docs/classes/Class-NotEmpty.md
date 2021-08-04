[param-builder/mixins/not-empty](../modules/Module-param-builder/mixins/not-empty).NotEmpty

## Hierarchy

- [`default`](./Class-default)

  ↳ **`NotEmpty`**

  ↳↳ [`StringBuilder`](./Class-StringBuilder)

## Table of contents

### Constructors

- [constructor](./Class-NotEmpty#constructor)

### Properties

- [either](./Class-NotEmpty#either)
- [enum](./Class-NotEmpty#enum)
- [enumCmp](./Class-NotEmpty#enumcmp)
- [name](./Class-NotEmpty#name)
- [nullable](./Class-NotEmpty#nullable)
- [required](./Class-NotEmpty#required)
- [type](./Class-NotEmpty#type)
- [validate](./Class-NotEmpty#validate)

### Methods

- [isRequired](./Class-NotEmpty#isrequired)
- [notEmpty](./Class-NotEmpty#notempty)
- [notRequired](./Class-NotEmpty#notrequired)
- [setName](./Class-NotEmpty#setname)
- [setRequired](./Class-NotEmpty#setrequired)

## Constructors

### constructor

• `Protected` **new NotEmpty**(`type`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`Constructor`](../interfaces/Interface-Constructor) |

#### Inherited from

[default](./Class-default).[constructor](./Class-default#constructor)

#### Defined in

src/param-builder/default.ts:33

## Properties

### either

• **either**: `undefined` \| `string` \| `number`

#### Inherited from

[default](./Class-default).[either](./Class-default#either)

#### Defined in

src/param-builder/default.ts:24

___

### enum

• **enum**: `undefined` \| (`string` \| `number` \| `boolean` \| `Date`)[]

Only allow values contained in this array. This will be executed BEFORE
the validate functions.

#### Inherited from

[default](./Class-default).[enum](./Class-default#enum)

#### Defined in

src/param-builder/default.ts:25

___

### enumCmp

• **enumCmp**: `undefined` \| (`a`: `any`, `b`: `any`) => `boolean`

#### Inherited from

[default](./Class-default).[enumCmp](./Class-default#enumcmp)

#### Defined in

src/param-builder/default.ts:26

___

### name

• **name**: `undefined` \| `string`

#### Inherited from

[default](./Class-default).[name](./Class-default#name)

#### Defined in

src/param-builder/default.ts:27

___

### nullable

• **nullable**: `boolean` = `false`

Whether or not `null` is accepted.

#### Inherited from

[default](./Class-default).[nullable](./Class-default#nullable)

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

#### Inherited from

[default](./Class-default).[required](./Class-default#required)

#### Defined in

src/param-builder/default.ts:29

___

### type

• **type**: [`Constructor`](../interfaces/Interface-Constructor)

A type constructor to check against the payload value (ie. Array, String,
Number, Boolean...).

#### Inherited from

[default](./Class-default).[type](./Class-default#type)

#### Defined in

src/param-builder/default.ts:30

___

### validate

• **validate**: [`ValidateFunction`](../modules/Module-types#validatefunction)[] = `[]`

A function (or array of) that receive the value present in the payload
and returns whether or not that value is valid. It may also return a
string which implies the value is invalid and the string will be used
as the error message.

#### Inherited from

[default](./Class-default).[validate](./Class-default#validate)

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

#### Inherited from

[default](./Class-default).[isRequired](./Class-default#isrequired)

#### Defined in

src/param-builder/default.ts:53

___

### notEmpty

▸ **notEmpty**(`errorMesssage?`): [`NotEmpty`](./Class-NotEmpty)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorMesssage?` | `string` |

#### Returns

[`NotEmpty`](./Class-NotEmpty)

#### Defined in

src/param-builder/mixins/not-empty.ts:4

___

### notRequired

▸ **notRequired**(): [`NotEmpty`](./Class-NotEmpty)

#### Returns

[`NotEmpty`](./Class-NotEmpty)

#### Inherited from

[default](./Class-default).[notRequired](./Class-default#notrequired)

#### Defined in

src/param-builder/default.ts:38

___

### setName

▸ **setName**(`name`): [`NotEmpty`](./Class-NotEmpty)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`NotEmpty`](./Class-NotEmpty)

#### Inherited from

[default](./Class-default).[setName](./Class-default#setname)

#### Defined in

src/param-builder/default.ts:48

___

### setRequired

▸ **setRequired**(`isRequired?`): [`NotEmpty`](./Class-NotEmpty)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRequired` | `boolean` \| (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\> | `true` |

#### Returns

[`NotEmpty`](./Class-NotEmpty)

#### Inherited from

[default](./Class-default).[setRequired](./Class-default#setrequired)

#### Defined in

src/param-builder/default.ts:42
