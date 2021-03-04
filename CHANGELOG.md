# Changelog

## Version 4.0.0

<small>2021.03.04</small>

- `unique()` no longer needs to take `val` as a parameter and will return a
  validate function
- ParamBuilder was introduced to aid in the declaration and re-use of parameters
- ParamBuilder deprecates the standart object-based way of declaring params,
  to discourage the old way it also introduces extra validate functions
  exclusive to it's use
- A new internal API handles errors in a better manner and responds with more
  user friendly error messages. Said API is also user extensible & overwritable.
- `reqparams()` and `reqquery` have been removed, use `reqall` instead.
- Params has now been broken down into Param & Params. Params is now simply a
  map of "Param"s
- The `name` property was added to Param, this property will be used by the
  error API to refer to said Param insead of using the Param's path, that is,
  if you define `'user.name.first': { ... }` and give it a name of `first name`
  the error API will respond with `Invalid first name` instead of
  `Invalid user.name.first`

## Version 3.3.3

<small>2020.11.30</small>

- Keys of type `Date` will now accept ISO Date strings, as this is the most
common way dates are send from clients to servers

## Version 3.3.1

<small>2020.09.16</small>

- Fixed a bug with `requiredIf`'s behavior

## Version 3.3.0

<small>2020.09.16</small>

- Added `requiredIf` to keys
- Added functionality to `nullable` for required parameters
- A bunch of things were improved to make reqparams actually usable with TypeScript (i.e I now know how to make interface properties optional)
- Tests are now written in TypeScript
- Coverage reporting
