# reqparams

Simple middleware to check required fields in express GET/POST requests.

## Example

```javascript
// Use reqquery if the data is in GET params
const { reqparams, notEmpty } = require('reqparams');

const registerPostParams = {
  username: { validate: notEmpty, msg: 'No username provided' },
  // Leave `msg` empty for default message ("Field <name> is required.")
  password: { validate: notEmpty },
  email: { optional: true }, // Does not fail if not present
  age: { validate: (val) => { return val >= 18 } } // Custom validate function
};

app.post('/register', reqparams(registerPostParams), (req, res) => {
  // ...
});
```
