# REQPARAMS - v4

Reqparams is a library created to help validate Express requests. It allows you
to check whether certain parameters exist, have the correct data type, and
comply with whatever rules you set.

**Example scenario**

You hava a RESTful API that allows users to sign up. Your sign up end-point
looks something like this:

```javascript
const app = express();

app.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (typeof email !== 'string' || !email.test(MY_EMAIL_REGEX)) {
    return res.status(400).json({ error: 'Please input a valid email' });
  }
  // ...
  // Same goes of all other fields your end-point needs
});
```

This get's incredibly messy and repetitive.

With reqparams you can easily validate all required fields.

```javascript
const app = express();
const { reqall, ParamBuilder } = require('@raggesilver/reqparams');

const signUpRequirements = reqall('body', {
  email: ParamBuilder.String().match(MY_EMAIL_REGEX),
  password: ParamBuilder.String().min(6).max(12),
  firstName: ParamBuilder.String().notEmpty(),
  lastName: ParamBuilder.String().notEmpty(),
  // Ensures `email` exists, is a string, and matches your RegExp
  // Ensures `password` exists, is a string with at least 6 characters and at
  // most 12
  // Ensures `firstName` exists and is a not empty string
  // Ensures `lastName` exists and is a not empty string
});

// Pass your requirements as a middleware for your signup route
//
//                  vvvvvvvvvvvvvvvvvv
app.post('/signup', signUpRequirements, async (req, res) => {
  // If the request made it this far it means that all the required data is
  // present and valid.
  const { email, password, firstName, lastName } = req.body;
});
```

## Documentation

From the `@raggesilver/reqparams` component you can import:

- [reqall()](#reqall) - a function that returns the Middleware that'll validate
all of your end-point's required fields.
- [ParamBuilder](#parambuilder) - the class that allows you to create your
required parameter's validation rules.

> Autocompletion may show you more things to import, but their use is
> discouraged as they will be deprecated in v5.

### `reqall()`

Reqall is the base function for reqparams, it will return the Middleware
function that will validate the required data for one or more end-points.

Here's what the function expects as parameters:

```typescript
function reqall (
  source: keyof express.Request,
  params: Params,
  options?: ParamOptions, // optional
);
```

Let's break that down:

1. `source`: a `string`. It's value must be something that exists in the express
request object. It's usual values are: `body` (for POST requests), `query` (for
GET requests) and `params` (for dynamic express routes such as `/post/:id`).
2. `params`: an `object`. This object will contain your required fields and
should be created with the aid of [ParamBuilder](#parambuilder). An important
note about `params` is that you can expect objects with nested fields. To
validate those `reqparams` uses a dot notation similar to
[MongoDB's](https://docs.mongodb.com/v4.4/core/document/#dot-notation).

Usage example:

```javascript
const app = express();
const { reqall, ParamBuilder } = require('@raggesilver/reqparams');

const myEndPointsRequirements = reqall('<source here>', {
  'requiredField': ParamBuilder.String().notEmpty(),
  'my.nested.field': ParamBuilder.Number({ integer: true }).min(18),
});

/**
 * Your endpoint expects a payload like this:
 * {
 *   requiredField: 'a not empty string',
 *   my: {
 *     nested: {
 *       field: 19,
 *     },
 *   },
 * }
 */

app.post('/my-endpoint', myEndPointsRequirements, (req, res) => { /* ... */ });
```

### `ParamBuilder`

> TODO: Complete docs for ParamBuilder

> TODO: Docs for ParamOptions

> TODO: Docs for the error API
