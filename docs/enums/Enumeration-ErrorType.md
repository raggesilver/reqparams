[types](../modules/Module-types).ErrorType

## Table of contents

### Enumeration members

- [INVALID\_PARAM\_TYPE](./Enumeration-ErrorType#invalid_param_type)
- [MISSING\_REQUIRED\_PARAM](./Enumeration-ErrorType#missing_required_param)
- [VALIDATION\_ERROR](./Enumeration-ErrorType#validation_error)

## Enumeration members

### INVALID\_PARAM\_TYPE

• **INVALID\_PARAM\_TYPE** = `0`

The param doesn't have the expected data type.

**THIS IS A PROGRAMMER ERROR** on the caller side.

#### Defined in

src/types.ts:68

___

### MISSING\_REQUIRED\_PARAM

• **MISSING\_REQUIRED\_PARAM** = `1`

A required param was not sent in the payload.

#### Defined in

src/types.ts:72

___

### VALIDATION\_ERROR

• **VALIDATION\_ERROR** = `2`

One of the validation functions failed, which means the parameter was sent
but it is invalid.

#### Defined in

src/types.ts:77
