# reqparams

Simple middleware to check and validate required fields in ExpressJs http
requests.

**Summary**:
- [Example](#example)
- [Docs](#docs)
- [Shipped validate functions](#shipped-validate-functions)
- [FAQ](#faq)

## Example

```javascript
const app = require('express')();
const {
  reqparams, // function to check POST requests (req.body)
  reqquery, // function to check GET requests (req.query)
  notEmpty, // validate function for strings and arrays
} = require('@raggesilver/reqparams');

// Say you have a login route that requires the fields username and password,
// reqparams can protect the route from requests that don't contain those fields
//
// First you setup the fields you need:
let loginFields = {
  username: {}, // For this example nothing else is needed
  password: {},
};
// reqparams will check if the fields are present in the body, if not it will
// respond with a 400 bad request with a body
// {
//   "error": "'username' field is required"
// }
//
// To actualy use reqparams you must do the following:
app.post('/login', reqparams(loginFields), (req, res) => {
  // ...
});

// Now a more complicated example, a register route.
const registerFields = {
  username: {
    // The function notEmpty checks if the param is a string (or array) and if
    // it is not empty (for strings checks if they are not made only by
    // whitespaces)
    validate: notEmpty,
    // Custom error message, leave `msg` empty for default message
    // ("Field <name> is required")
    msg: 'No username provided',
  },
  password: {
    // Validate function for password tests for minimum complexity
    validate: (val) => /^[\S\s]{6,}$/.test(val),
  },
  age: {
    // Specify type, responds error (400) when type doesn't match
    type: Number,
    // Non-required fields don't prevent a request from comming in, but if the
    // field is present and validate (also present) returns false the request
    // will fail
    required: false,
    validate: (val) => val >= 18,
  },
  email: {
    // Check if the email is already in use (you should do the same for
    // the username, I was just lazy)
    validate: async (val) => {
      if (await User.findOne({ email: val }))
        return 'Email in use';
      // Further email regex verification
      return true;
    },
  },
};

app.post('/register', reqparams(registerFields), (req, res) => {
  // ...
});
```

## Docs

### Keys

Keys are the path of the field that must be present in the request. Using keys
you can easily validate root level and also nested fields. E.g.:

```javascript
{
  // This will search for req.[body/query].email
  'email': {},
  // This will search for req.[body/query].name.first
  'name.first': {},
}
```

Keys in the object passed to `reqparams` or `reqquery` must be present in the
request (unless `required: false` is specified). Apart from being present it is
also possible to validate the values passed in. For that the key values must be
an object and may contain the following:

#### validate

Validate functions are the core of `reqparams`, they allow you to test whether a
field is valid outside your route, which can make your code way cleaner.

- Validate functions **may** be `async`.
- If they return anything but `true` the request will fail (400)
- If they return a string, they will fail and use the string as the error
message

As of `2.1.0` validate may be a single function on an array of functions. These
functions should be prototyped:

```typescript
(val: any): Boolean|String|Promise<Boolean|String>
```

#### either

Either was introduced in `2.0.0`, it allows you to say that only one of many
fields are required, still if the validate function for any of them fail the
request will be refused.

If your login function needs a password and either username or email you could
use reqparams like this:
```javascript
let loginFields: {
  password: { /* whatever */ },
  username: { either: 1, },
  email: { either: 1, },
}
```

The either key is an identifier that groups the different fields (it can be a
`number`, `string` or `symbol`, basically what you use as an object key).

If neither `username` nor `email` are present the request will be refused with:
```javascript
// 404
{
  "error": "One of 'username', 'email' is required"
}
```

#### all the rest

All the other keys supported are easy to understand from the
[Example](#example).

---

## Shipped validate functions

This package also has it's own validate functions.

### `notEmpty`

`notEmpty` takes either a string or an array and checks if:

- The string is not (empty or all whitespace)
- The array has at least one element

Any other type will fail (`return false`).

### `unique`

`unique` is a validate function **helper**. It can be used to easily check if
a field is unique to a specific `mongoose Model`.

**Example**

```javascript
  // ...
  email: {
    validate: async (val) => await unique(val, 'email', UserModel),
  }
```

This will run a `model.findOne({ [key]: val })`, and return `true` if none is
found. The call is made inside a `try/catch` block and returns `false` if any
error is thrown.

### `validId`

`validId` checks if a given value is a valid Mongoose ObjectId.

## FAQ

> What if I need two middleware functions in the same route?
```javascript
// guard being the first and reqparams being second (order matters)
app.post('/profile/update', [ guard, reqparams({}) ], (req, res) => {
  // ...
});
```
