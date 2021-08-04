[param-builder/mixins/enum](../modules/Module-param-builder/mixins/enum).Enum

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `number` \| `string` \| `boolean` \| `Date` |

## Hierarchy

- [`default`](./Class-default)

  ↳ **`Enum`**

  ↳↳ [`StringBuilder`](./Class-StringBuilder)

## Table of contents

### Constructors

- [constructor](./Class-Enum#constructor)

### Properties

- [either](./Class-Enum#either)
- [enum](./Class-Enum#enum)
- [enumCmp](./Class-Enum#enumcmp)
- [name](./Class-Enum#name)
- [nullable](./Class-Enum#nullable)
- [required](./Class-Enum#required)
- [type](./Class-Enum#type)
- [validate](./Class-Enum#validate)

### Methods

- [isRequired](./Class-Enum#isrequired)
- [notRequired](./Class-Enum#notrequired)
- [setEnum](./Class-Enum#setenum)
- [setName](./Class-Enum#setname)
- [setRequired](./Class-Enum#setrequired)

## Constructors

### constructor

• `Protected` **new Enum**<`T`\>(`type`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `number` \| `boolean` \| `Date` |

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

### notRequired

▸ **notRequired**(): [`Enum`](./Class-Enum)<`T`\>

#### Returns

[`Enum`](./Class-Enum)<`T`\>

#### Inherited from

[default](./Class-default).[notRequired](./Class-default#notrequired)

#### Defined in

src/param-builder/default.ts:38

___

### setEnum

▸ **setEnum**(`values`, `errorMessage?`): [`Enum`](./Class-Enum)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `T`[] |
| `errorMessage?` | `string` |

#### Returns

[`Enum`](./Class-Enum)<`T`\>

#### Defined in

src/param-builder/mixins/enum.ts:7

___

### setName

▸ **setName**(`name`): [`Enum`](./Class-Enum)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`Enum`](./Class-Enum)<`T`\>

#### Inherited from

[default](./Class-default).[setName](./Class-default#setname)

#### Defined in

src/param-builder/default.ts:48

___

### setRequired

▸ **setRequired**(`isRequired?`): [`Enum`](./Class-Enum)<`T`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRequired` | `boolean` \| (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\> | `true` |

#### Returns

[`Enum`](./Class-Enum)<`T`\>

#### Inherited from

[default](./Class-default).[setRequired](./Class-default#setrequired)

#### Defined in

src/param-builder/default.ts:42
