[param-builder/number](../modules/Module-param-builder/number).NumberBuilder

## Hierarchy

- [`default`](./Class-default)

- [`MinMax`](./Class-MinMax)

- [`LessGreater`](./Class-LessGreater)<`number`\>

  ↳ **`NumberBuilder`**

## Table of contents

### Constructors

- [constructor](./Class-NumberBuilder#constructor)

### Properties

- [either](./Class-NumberBuilder#either)
- [enum](./Class-NumberBuilder#enum)
- [enumCmp](./Class-NumberBuilder#enumcmp)
- [isInteger](./Class-NumberBuilder#isinteger)
- [name](./Class-NumberBuilder#name)
- [nullable](./Class-NumberBuilder#nullable)
- [required](./Class-NumberBuilder#required)
- [type](./Class-NumberBuilder#type)
- [validate](./Class-NumberBuilder#validate)

### Methods

- [geq](./Class-NumberBuilder#geq)
- [greaterThan](./Class-NumberBuilder#greaterthan)
- [greaterThanOrEqual](./Class-NumberBuilder#greaterthanorequal)
- [gt](./Class-NumberBuilder#gt)
- [integer](./Class-NumberBuilder#integer)
- [isRequired](./Class-NumberBuilder#isrequired)
- [leq](./Class-NumberBuilder#leq)
- [lessThan](./Class-NumberBuilder#lessthan)
- [lessThanOrEqual](./Class-NumberBuilder#lessthanorequal)
- [lt](./Class-NumberBuilder#lt)
- [max](./Class-NumberBuilder#max)
- [min](./Class-NumberBuilder#min)
- [notRequired](./Class-NumberBuilder#notrequired)
- [setName](./Class-NumberBuilder#setname)
- [setRequired](./Class-NumberBuilder#setrequired)

## Constructors

### constructor

• **new NumberBuilder**()

#### Inherited from

[LessGreater](./Class-LessGreater).[constructor](./Class-LessGreater#constructor)

#### Defined in

src/param-builder/number.ts:15

## Properties

### either

• **either**: `undefined` \| `string` \| `number`

#### Inherited from

[LessGreater](./Class-LessGreater).[either](./Class-LessGreater#either)

#### Defined in

src/param-builder/default.ts:24

___

### enum

• **enum**: `undefined` \| (`string` \| `number` \| `boolean` \| `Date`)[]

Only allow values contained in this array. This will be executed BEFORE
the validate functions.

#### Inherited from

[LessGreater](./Class-LessGreater).[enum](./Class-LessGreater#enum)

#### Defined in

src/param-builder/default.ts:25

___

### enumCmp

• **enumCmp**: `undefined` \| (`a`: `any`, `b`: `any`) => `boolean`

#### Inherited from

[LessGreater](./Class-LessGreater).[enumCmp](./Class-LessGreater#enumcmp)

#### Defined in

src/param-builder/default.ts:26

___

### isInteger

• **isInteger**: `boolean` = `false`

#### Defined in

src/param-builder/number.ts:13

___

### name

• **name**: `undefined` \| `string`

#### Inherited from

[LessGreater](./Class-LessGreater).[name](./Class-LessGreater#name)

#### Defined in

src/param-builder/default.ts:27

___

### nullable

• **nullable**: `boolean` = `false`

Whether or not `null` is accepted.

#### Inherited from

[LessGreater](./Class-LessGreater).[nullable](./Class-LessGreater#nullable)

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

[LessGreater](./Class-LessGreater).[required](./Class-LessGreater#required)

#### Defined in

src/param-builder/default.ts:29

___

### type

• **type**: [`Constructor`](../interfaces/Interface-Constructor)

A type constructor to check against the payload value (ie. Array, String,
Number, Boolean...).

#### Inherited from

[LessGreater](./Class-LessGreater).[type](./Class-LessGreater#type)

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

[LessGreater](./Class-LessGreater).[validate](./Class-LessGreater#validate)

#### Defined in

src/param-builder/default.ts:31

## Methods

### geq

▸ **geq**(...`args`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: number, errorMessage?: string] |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[geq](./Class-LessGreater#geq)

#### Defined in

src/param-builder/mixins/less-greater.ts:77

___

### greaterThan

▸ **greaterThan**(`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[greaterThan](./Class-LessGreater#greaterthan)

#### Defined in

src/param-builder/mixins/less-greater.ts:55

___

### greaterThanOrEqual

▸ **greaterThanOrEqual**(`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[greaterThanOrEqual](./Class-LessGreater#greaterthanorequal)

#### Defined in

src/param-builder/mixins/less-greater.ts:60

___

### gt

▸ **gt**(...`args`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: number, errorMessage?: string] |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[gt](./Class-LessGreater#gt)

#### Defined in

src/param-builder/mixins/less-greater.ts:73

___

### integer

▸ **integer**(`errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Defined in

src/param-builder/number.ts:19

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

[LessGreater](./Class-LessGreater).[isRequired](./Class-LessGreater#isrequired)

#### Defined in

src/param-builder/default.ts:53

___

### leq

▸ **leq**(...`args`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: number, errorMessage?: string] |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[leq](./Class-LessGreater#leq)

#### Defined in

src/param-builder/mixins/less-greater.ts:69

___

### lessThan

▸ **lessThan**(`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[lessThan](./Class-LessGreater#lessthan)

#### Defined in

src/param-builder/mixins/less-greater.ts:45

___

### lessThanOrEqual

▸ **lessThanOrEqual**(`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[lessThanOrEqual](./Class-LessGreater#lessthanorequal)

#### Defined in

src/param-builder/mixins/less-greater.ts:50

___

### lt

▸ **lt**(...`args`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [n: number, errorMessage?: string] |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[lt](./Class-LessGreater#lt)

#### Defined in

src/param-builder/mixins/less-greater.ts:65

___

### max

▸ **max**(`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[MinMax](./Class-MinMax).[max](./Class-MinMax#max)

#### Defined in

src/param-builder/mixins/min-max.ts:20

___

### min

▸ **min**(`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[MinMax](./Class-MinMax).[min](./Class-MinMax#min)

#### Defined in

src/param-builder/mixins/min-max.ts:4

___

### notRequired

▸ **notRequired**(): [`NumberBuilder`](./Class-NumberBuilder)

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[notRequired](./Class-LessGreater#notrequired)

#### Defined in

src/param-builder/default.ts:38

___

### setName

▸ **setName**(`name`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[setName](./Class-LessGreater#setname)

#### Defined in

src/param-builder/default.ts:48

___

### setRequired

▸ **setRequired**(`isRequired?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isRequired` | `boolean` \| (`req`: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>) => `boolean` \| `Promise`<`boolean`\> | `true` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Inherited from

[LessGreater](./Class-LessGreater).[setRequired](./Class-LessGreater#setrequired)

#### Defined in

src/param-builder/default.ts:42
