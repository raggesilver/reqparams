// Setup server

const express     = require('express');
const bodyParser  = require('body-parser');

const { reqparams, validId, notEmpty } = require('../dist');
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

let handler = app.listen(port);

// Setup tests

const axios = require('axios');

test('POST /a { username: notEmpty } FAIL', async () => {
  try {
    await axios.post(`http://127.0.0.1:${port}/a`);
  }
  catch (e) {
    expect(e.response.status).toBe(400);
    expect(e.response.data).toMatchObject({ error: 'Param username missing' });
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
      error: 'Param name.last missing',
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

// Close listener after testing
afterAll(() => handler.close());
