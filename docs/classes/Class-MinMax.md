[param-builder/mixins/min-max](../modules/Module-param-builder/mixins/min-max).MinMax

## Hierarchy

- [`default`](./Class-default)

  ↳ **`MinMax`**

  ↳↳ [`NumberBuilder`](./Class-NumberBuilder)

  ↳↳ [`StringBuilder`](./Class-StringBuilder)

## Table of contents

### Constructors

- [constructor](./Class-MinMax#constructor)

### Properties

- [either](./Class-MinMax#either)
- [enum](./Class-MinMax#enum)
- [enumCmp](./Class-MinMax#enumcmp)
- [name](./Class-MinMax#name)
- [nullable](./Class-MinMax#nullable)
- [required](./Class-MinMax#required)
- [type](./Class-MinMax#type)
- [validate](./Class-MinMax#validate)

### Methods

- [isRequired](./Class-MinMax#isrequired)
- [max](./Class-MinMax#max)
- [min](./Class-MinMax#min)
- [notRequired](./Class-MinMax#notrequired)
- [setName](./Class-MinMax#setname)
- [setRequired](./Class-MinMax#setrequired)

## Constructors

### constructor

• `Protected` **new MinMax**(`type`)

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

### max

▸ **max**(`n`, `errorMessage?`): [`MinMax`](./Class-MinMax)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`MinMax`](./Class-MinMax)

#### Defined in

src/param-builder/mixins/min-max.ts:20

___

### min

▸ **min**(`n`, `errorMessage?`): [`MinMax`](./Class-MinMax)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`MinMax`](./Class-MinMax)

#### Defined in

src/param-builder/mixins/min-max.ts:4

___

### notRequired

▸ **notRequired**(): [`MinMax`](./Class-MinMax)

#### Returns

[`MinMax`](./Class-MinMax)

#### Inherited from

[default](./Class-default).[notRequired](./Class-default#notrequired)

#### Defined in

src/param-builder/default.ts:38

___

### setName

▸ **setName**(`name`): [`MinMax`](./Class-MinMax)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`MinMax`](./Class-MinMax)

#### Inherited from

[default](./Class-default).[setName](./Class-default#setname)

#### Defined in

src/param-builder/default.ts:48

___

### setRequired

▸ **setRequired**(`isRequired?`): [`MinMax`](./Class-MinMax)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRequired` | `boolean` \| (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\> | `true` |

#### Returns

[`MinMax`](./Class-MinMax)

#### Inherited from

[default](./Class-default).[setRequired](./Class-default#setrequired)

#### Defined in

src/param-builder/default.ts:42
