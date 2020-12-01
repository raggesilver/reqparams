# Changelog

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
