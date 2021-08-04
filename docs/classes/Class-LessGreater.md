[param-builder/mixins/less-greater](../modules/Module-param-builder/mixins/less-greater).LessGreater

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `number` \| `Date` |

## Hierarchy

- [`default`](./Class-default)

  ↳ **`LessGreater`**

  ↳↳ [`NumberBuilder`](./Class-NumberBuilder)

## Table of contents

### Constructors

- [constructor](./Class-LessGreater#constructor)

### Properties

- [either](./Class-LessGreater#either)
- [enum](./Class-LessGreater#enum)
- [enumCmp](./Class-LessGreater#enumcmp)
- [name](./Class-LessGreater#name)
- [nullable](./Class-LessGreater#nullable)
- [required](./Class-LessGreater#required)
- [type](./Class-LessGreater#type)
- [validate](./Class-LessGreater#validate)

### Methods

- [geq](./Class-LessGreater#geq)
- [greaterThan](./Class-LessGreater#greaterthan)
- [greaterThanOrEqual](./Class-LessGreater#greaterthanorequal)
- [gt](./Class-LessGreater#gt)
- [isRequired](./Class-LessGreater#isrequired)
- [leq](./Class-LessGreater#leq)
- [lessThan](./Class-LessGreater#lessthan)
- [lessThanOrEqual](./Class-LessGreater#lessthanorequal)
- [lt](./Class-LessGreater#lt)
- [notRequired](./Class-LessGreater#notrequired)
- [setName](./Class-LessGreater#setname)
- [setRequired](./Class-LessGreater#setrequired)

## Constructors

### constructor

• `Protected` **new LessGreater**<`T`\>(`type`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `number` \| `Date` |

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

### geq

▸ **geq**(...`args`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: T, errorMessage?: string] |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:77

___

### greaterThan

▸ **greaterThan**(`n`, `errorMessage?`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `T` |
| `errorMessage?` | `string` |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:55

___

### greaterThanOrEqual

▸ **greaterThanOrEqual**(`n`, `errorMessage?`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `T` |
| `errorMessage?` | `string` |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:60

___

### gt

▸ **gt**(...`args`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: T, errorMessage?: string] |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:73

___

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

### leq

▸ **leq**(...`args`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: T, errorMessage?: string] |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:69

___

### lessThan

▸ **lessThan**(`n`, `errorMessage?`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `T` |
| `errorMessage?` | `string` |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:45

___

### lessThanOrEqual

▸ **lessThanOrEqual**(`n`, `errorMessage?`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `T` |
| `errorMessage?` | `string` |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:50

___

### lt

▸ **lt**(...`args`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: T, errorMessage?: string] |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Defined in

src/param-builder/mixins/less-greater.ts:65

___

### notRequired

▸ **notRequired**(): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Inherited from

[default](./Class-default).[notRequired](./Class-default#notrequired)

#### Defined in

src/param-builder/default.ts:38

___

### setName

▸ **setName**(`name`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Inherited from

[default](./Class-default).[setName](./Class-default#setname)

#### Defined in

src/param-builder/default.ts:48

___

### setRequired

▸ **setRequired**(`isRequired?`): [`LessGreater`](./Class-LessGreater)<`T`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRequired` | `boolean` \| (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\> | `true` |

#### Returns

[`LessGreater`](./Class-LessGreater)<`T`\>

#### Inherited from

[default](./Class-default).[setRequired](./Class-default#setrequired)

#### Defined in

src/param-builder/default.ts:42
