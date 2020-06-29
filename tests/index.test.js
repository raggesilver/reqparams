// Setup server

const express     = require('express');
const bodyParser  = require('body-parser');

const { reqparams, validId, notEmpty, reqall } = require('../dist');
const app   = express();
const port  = process.env.PORT || 9143;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let postAMid = reqparams({
  username: { validate: notEmpty },
});

app.post('/a', postAMid, (_req, res) => {
  res.json({});
});

let postNest = reqparams({
  'name.first': {},
  'name.last': {},
});

app.post('/nest', postNest, (_req, res) => {
  res.json({});
});

let strictMid = reqall('body', {
  'some.key': { type: String },
}, {
  strict: true,
  onerror: (_req, res, _next, message) => {
    return res.status(400).json({
      error: message,
      error_code: 'INVALID_INPUT',
    });
  },
});

app.post('/strict', strictMid, (req, res) => res.json(req.body));

const passReqMid = reqparams({
  user: {
    type: String,
    validate: [
      notEmpty,
      (val, req) => {
        req.body.user = `${val} -- I got more stuff`;
        return (true);
      },
    ],
  },
});

app.post('/passreq', passReqMid, (req, res) => res.status(200).json(req.body));

let handler = app.listen(port);

// Setup tests

const axios = require('axios');

test('POST /a { username: notEmpty } FAIL', async () => {
  try {
    await axios.post(`http://127.0.0.1:${port}/a`);
  }
  catch (e) {
    expect(e.response.status).toBe(400);
    expect(e.response.data).toMatchObject({ error: 'Parameter username missing' });
  }
});

test('POST /a { username: notEmpty } OK', async () => {
  let { data } = await axios.post(`http://127.0.0.1:${port}/a`, {
    username: 'aa',
  });
  expect(data).toMatchObject({});
});

test('POST /nest { username: notEmpty } FAIL', async () => {
  try {
    await axios.post(`http://127.0.0.1:${port}/nest`, {
      name: {
        first: 'Paulo',
      },
    });
  }
  catch (e) {
    expect(e.response.status).toBe(400);
    expect(e.response.data).toMatchObject({
      error: 'Parameter name.last missing',
    });
  }
});

test('POST /nest { username: notEmpty } OK', async () => {
  let { data } = await axios.post(`http://127.0.0.1:${port}/nest`, {
    name: {
      first: 'Paulo',
      last: 'Queiroz',
    },
  });
  expect(data).toMatchObject({});
});

test('POST /sctrict { some.key: String } OK', async () => {
  let { data } = await axios.post(`http://127.0.0.1:${port}/strict`, {
    some: {
      key: 'some value',
      removeMe: true,
    },
    remove: {
      me: 'please',
    },
  });

  expect(data.remove).toBe(undefined);
  expect(data.some).not.toBe(undefined);
  expect(data.some.removeMe).toBe(undefined);
  expect(data.some.key).toBe('some value');
});

test('POST /sctrict { some.key: String } FAIL', async () => {
  let data = undefined;
  let error = undefined;

  try {
    let { data: d } = await axios.post(`http://127.0.0.1:${port}/strict`, {
      some: {
        key: 13,
      },
    });
    data = d;
  }
  catch (e) {
    error = e;
  }

  expect(data).toBe(undefined);
  expect(error).not.toBe(undefined);
  expect(error.response.data.error_code).toBe('INVALID_INPUT');
});

test('POST /passreq { user: \'aaa\' }', async () => {
  expect.assertions(1);
  try {
    const user = 'aaa';
    const { data } = await axios.post(`http://127.0.0.1:${port}/passreq`, { user });

    expect(data?.user).toBe(`${user} -- I got more stuff`);
  }
  catch (e) {
    console.error(e);
  }
});

// Close listener after testing
afterAll(() => handler.close());
