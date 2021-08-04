[param-builder/string](../modules/Module-param-builder/string).StringBuilder

## Hierarchy

- [`default`](./Class-default)

- [`MinMax`](./Class-MinMax)

- [`NotEmpty`](./Class-NotEmpty)

- [`Enum`](./Class-Enum)<`string`\>

  ↳ **`StringBuilder`**

## Table of contents

### Constructors

- [constructor](./Class-StringBuilder#constructor)

### Properties

- [either](./Class-StringBuilder#either)
- [enum](./Class-StringBuilder#enum)
- [enumCmp](./Class-StringBuilder#enumcmp)
- [match](./Class-StringBuilder#match)
- [name](./Class-StringBuilder#name)
- [nullable](./Class-StringBuilder#nullable)
- [required](./Class-StringBuilder#required)
- [type](./Class-StringBuilder#type)
- [validate](./Class-StringBuilder#validate)

### Methods

- [isRequired](./Class-StringBuilder#isrequired)
- [matches](./Class-StringBuilder#matches)
- [max](./Class-StringBuilder#max)
- [min](./Class-StringBuilder#min)
- [notEmpty](./Class-StringBuilder#notempty)
- [notRequired](./Class-StringBuilder#notrequired)
- [setEnum](./Class-StringBuilder#setenum)
- [setName](./Class-StringBuilder#setname)
- [setRequired](./Class-StringBuilder#setrequired)

## Constructors

### constructor

• **new StringBuilder**()

#### Inherited from

[Enum](./Class-Enum).[constructor](./Class-Enum#constructor)

#### Defined in

src/param-builder/string.ts:14

## Properties

### either

• **either**: `undefined` \| `string` \| `number`

#### Inherited from

[Enum](./Class-Enum).[either](./Class-Enum#either)

#### Defined in

src/param-builder/default.ts:24

___

### enum

• **enum**: `undefined` \| (`string` \| `number` \| `boolean` \| `Date`)[]

Only allow values contained in this array. This will be executed BEFORE
the validate functions.

#### Inherited from

[Enum](./Class-Enum).[enum](./Class-Enum#enum)

#### Defined in

src/param-builder/default.ts:25

___

### enumCmp

• **enumCmp**: `undefined` \| (`a`: `any`, `b`: `any`) => `boolean`

#### Inherited from

[Enum](./Class-Enum).[enumCmp](./Class-Enum#enumcmp)

#### Defined in

src/param-builder/default.ts:26

___

### match

• **match**: (`reg`: `RegExp`, `errorMessage?`: `string`) => [`StringBuilder`](./Class-StringBuilder)

#### Type declaration

▸ (`reg`, `errorMessage?`): [`StringBuilder`](./Class-StringBuilder)

##### Parameters

| Name | Type |
| :------ | :------ |
| `reg` | `RegExp` |
| `errorMessage?` | `string` |

##### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Defined in

src/param-builder/string.ts:29

___

### name

• **name**: `undefined` \| `string`

#### Inherited from

[Enum](./Class-Enum).[name](./Class-Enum#name)

#### Defined in

src/param-builder/default.ts:27

___

### nullable

• **nullable**: `boolean` = `false`

Whether or not `null` is accepted.

#### Inherited from

[Enum](./Class-Enum).[nullable](./Class-Enum#nullable)

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

[Enum](./Class-Enum).[required](./Class-Enum#required)

#### Defined in

src/param-builder/default.ts:29

___

### type

• **type**: [`Constructor`](../interfaces/Interface-Constructor)

A type constructor to check against the payload value (ie. Array, String,
Number, Boolean...).

#### Inherited from

[Enum](./Class-Enum).[type](./Class-Enum#type)

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

[Enum](./Class-Enum).[validate](./Class-Enum#validate)

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

[Enum](./Class-Enum).[isRequired](./Class-Enum#isrequired)

#### Defined in

src/param-builder/default.ts:53

___

### matches

▸ **matches**(`reg`, `errorMessage?`): [`StringBuilder`](./Class-StringBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `reg` | `RegExp` |
| `errorMessage?` | `string` |

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Defined in

src/param-builder/string.ts:18

___

### max

▸ **max**(`n`, `errorMessage?`): [`StringBuilder`](./Class-StringBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Inherited from

[MinMax](./Class-MinMax).[max](./Class-MinMax#max)

#### Defined in

src/param-builder/mixins/min-max.ts:20

___

### min

▸ **min**(`n`, `errorMessage?`): [`StringBuilder`](./Class-StringBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Inherited from

[MinMax](./Class-MinMax).[min](./Class-MinMax#min)

#### Defined in

src/param-builder/mixins/min-max.ts:4

___

### notEmpty

▸ **notEmpty**(`errorMesssage?`): [`StringBuilder`](./Class-StringBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorMesssage?` | `string` |

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Inherited from

[NotEmpty](./Class-NotEmpty).[notEmpty](./Class-NotEmpty#notempty)

#### Defined in

src/param-builder/mixins/not-empty.ts:4

___

### notRequired

▸ **notRequired**(): [`StringBuilder`](./Class-StringBuilder)

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Inherited from

[Enum](./Class-Enum).[notRequired](./Class-Enum#notrequired)

#### Defined in

src/param-builder/default.ts:38

___

### setEnum

▸ **setEnum**(`values`, `errorMessage?`): [`StringBuilder`](./Class-StringBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `string`[] |
| `errorMessage?` | `string` |

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Inherited from

[Enum](./Class-Enum).[setEnum](./Class-Enum#setenum)

#### Defined in

src/param-builder/mixins/enum.ts:7

___

### setName

▸ **setName**(`name`): [`StringBuilder`](./Class-StringBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Inherited from

[Enum](./Class-Enum).[setName](./Class-Enum#setname)

#### Defined in

src/param-builder/default.ts:48

___

### setRequired

▸ **setRequired**(`isRequired?`): [`StringBuilder`](./Class-StringBuilder)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRequired` | `boolean` \| (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\> | `true` |

#### Returns

[`StringBuilder`](./Class-StringBuilder)

#### Inherited from

[Enum](./Class-Enum).[setRequired](./Class-Enum#setrequired)

#### Defined in

src/param-builder/default.ts:42
