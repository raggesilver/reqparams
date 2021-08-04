## Table of contents

### References

- [ParamBuilder](./Module-index#parambuilder)

### Functions

- [reqall](./Module-index#reqall)
- [reqparams](./Module-index#reqparams)

## References

### ParamBuilder

Renames and exports: [default](./Module-param-builder#default)

## Functions

### reqall

▸ `Const` **reqall**(`source`, `params`): `Handler`

**`deprecated`** Use [reqparams](./Module-index#reqparams) instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | keyof `Request` |
| `params` | [`Params`](../interfaces/Interface-Params) |

#### Returns

`Handler`

#### Defined in

src/index.ts:61

___

### reqparams

▸ **reqparams**(`source`, `params`): `Handler`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | keyof `Request` |
| `params` | [`Params`](../interfaces/Interface-Params) |

#### Returns

`Handler`

#### Defined in

src/index.ts:14
