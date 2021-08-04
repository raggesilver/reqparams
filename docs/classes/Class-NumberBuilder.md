[param-builder/number](../modules/Module-param-builder/number).NumberBuilder

## Hierarchy

- [`default`](./Class-default)

- [`MinMax`](./Class-MinMax)

  ↳ **`NumberBuilder`**

## Table of contents

### Constructors

- [constructor](./Class-NumberBuilder#constructor)

### Properties

- [either](./Class-NumberBuilder#either)
- [enum](./Class-NumberBuilder#enum)
- [enumCmp](./Class-NumberBuilder#enumcmp)
- [geq](./Class-NumberBuilder#geq)
- [gt](./Class-NumberBuilder#gt)
- [isInteger](./Class-NumberBuilder#isinteger)
- [leq](./Class-NumberBuilder#leq)
- [lt](./Class-NumberBuilder#lt)
- [name](./Class-NumberBuilder#name)
- [nullable](./Class-NumberBuilder#nullable)
- [required](./Class-NumberBuilder#required)
- [type](./Class-NumberBuilder#type)
- [validate](./Class-NumberBuilder#validate)

### Methods

- [greaterThan](./Class-NumberBuilder#greaterthan)
- [greaterThanOrEqual](./Class-NumberBuilder#greaterthanorequal)
- [integer](./Class-NumberBuilder#integer)
- [isRequired](./Class-NumberBuilder#isrequired)
- [lessThan](./Class-NumberBuilder#lessthan)
- [lessThanOrEqual](./Class-NumberBuilder#lessthanorequal)
- [max](./Class-NumberBuilder#max)
- [min](./Class-NumberBuilder#min)
- [notRequired](./Class-NumberBuilder#notrequired)
- [setName](./Class-NumberBuilder#setname)
- [setRequired](./Class-NumberBuilder#setrequired)

## Constructors

### constructor

• **new NumberBuilder**()

#### Inherited from

[MinMax](./Class-MinMax).[constructor](./Class-MinMax#constructor)

#### Defined in

src/param-builder/number.ts:11

## Properties

### either

• **either**: `undefined` \| `string` \| `number`

#### Inherited from

[MinMax](./Class-MinMax).[either](./Class-MinMax#either)

#### Defined in

src/param-builder/default.ts:24

___

### enum

• **enum**: `undefined` \| (`string` \| `number` \| `boolean` \| `Date`)[]

Only allow values contained in this array. This will be executed BEFORE
the validate functions.

#### Inherited from

[MinMax](./Class-MinMax).[enum](./Class-MinMax#enum)

#### Defined in

src/param-builder/default.ts:25

___

### enumCmp

• **enumCmp**: `undefined` \| (`a`: `any`, `b`: `any`) => `boolean`

#### Inherited from

[MinMax](./Class-MinMax).[enumCmp](./Class-MinMax#enumcmp)

#### Defined in

src/param-builder/default.ts:26

___

### geq

• **geq**: (`n`: `number`, `errorMessage?`: `string`) => [`NumberBuilder`](./Class-NumberBuilder)

#### Type declaration

▸ (`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

##### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

##### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Defined in

src/param-builder/number.ts:101

___

### gt

• **gt**: (`n`: `number`, `errorMessage?`: `string`) => [`NumberBuilder`](./Class-NumberBuilder)

#### Type declaration

▸ (`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

##### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

##### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Defined in

src/param-builder/number.ts:100

___

### isInteger

• **isInteger**: `boolean` = `false`

#### Defined in

src/param-builder/number.ts:9

___

### leq

• **leq**: (`n`: `number`, `errorMessage?`: `string`) => [`NumberBuilder`](./Class-NumberBuilder)

#### Type declaration

▸ (`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

##### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

##### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Defined in

src/param-builder/number.ts:103

___

### lt

• **lt**: (`n`: `number`, `errorMessage?`: `string`) => [`NumberBuilder`](./Class-NumberBuilder)

#### Type declaration

▸ (`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

##### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

##### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Defined in

src/param-builder/number.ts:102

___

### name

• **name**: `undefined` \| `string`

#### Inherited from

[MinMax](./Class-MinMax).[name](./Class-MinMax#name)

#### Defined in

src/param-builder/default.ts:27

___

### nullable

• **nullable**: `boolean` = `false`

Whether or not `null` is accepted.

#### Inherited from

[MinMax](./Class-MinMax).[nullable](./Class-MinMax#nullable)

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

[MinMax](./Class-MinMax).[required](./Class-MinMax#required)

#### Defined in

src/param-builder/default.ts:29

___

### type

• **type**: [`Constructor`](../interfaces/Interface-Constructor)

A type constructor to check against the payload value (ie. Array, String,
Number, Boolean...).

#### Inherited from

[MinMax](./Class-MinMax).[type](./Class-MinMax#type)

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

[MinMax](./Class-MinMax).[validate](./Class-MinMax#validate)

#### Defined in

src/param-builder/default.ts:31

## Methods

### greaterThan

▸ **greaterThan**(`n`, `errorMessage?`): [`NumberBuilder`](./Class-NumberBuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |
| `errorMessage?` | `string` |

#### Returns

[`NumberBuilder`](./Class-NumberBuilder)

#### Defined in

src/param-builder/number.ts:49

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

#### Defined in

src/param-builder/number.ts:32

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

src/param-builder/number.ts:15

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

[MinMax](./Class-MinMax).[isRequired](./Class-MinMax#isrequired)

#### Defined in

src/param-builder/default.ts:53

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

#### Defined in

src/param-builder/number.ts:83

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

#### Defined in

src/param-builder/number.ts:66

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

[MinMax](./Class-MinMax).[notRequired](./Class-MinMax#notrequired)

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

[MinMax](./Class-MinMax).[setName](./Class-MinMax#setname)

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

[MinMax](./Class-MinMax).[setRequired](./Class-MinMax#setrequired)

#### Defined in

src/param-builder/default.ts:42
