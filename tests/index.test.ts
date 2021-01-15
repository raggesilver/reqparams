
// ╭━━━╮             ╭━━━╮  ╭╮
// ┃╭━╮┃             ┃╭━╮┃ ╭╯╰╮
// ┃╰━━┳━━┳━┳╮╭┳━━┳━╮┃╰━━┳━┻╮╭╋╮╭┳━━╮
// ╰━━╮┃┃━┫╭┫╰╯┃┃━┫╭╯╰━━╮┃┃━┫┃┃┃┃┃╭╮┃
// ┃╰━╯┃┃━┫┃╰╮╭┫┃━┫┃ ┃╰━╯┃┃━┫╰┫╰╯┃╰╯┃
// ╰━━━┻━━┻╯ ╰╯╰━━┻╯ ╰━━━┻━━┻━┻━━┫╭━╯
//                               ┃┃
//  ---------------------------- ╰╯ --------------------------------------------

import * as express from 'express';
import * as bodyParser from 'body-parser';

import { randomBytes } from 'crypto';
import { reqparams, reqall, reqquery, validId, notEmpty } from '../src';

const app = express();
const port = Number(process.env.PORT) || 9143;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const postAMid = reqparams({
  username: { validate: notEmpty },
});

app.post('/a', postAMid, (_req, res) => {
  return res.json({});
});

const postNest = reqparams({
  'name.first': {},
  'name.last': {},
});

app.post('/nest', postNest, (_req, res) => {
  return res.json({});
});

const strictMid = reqall('body', {
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

const resourceByIdMid = reqall(
  'params',
  { id: { type: String, validate: validId }}
);

app.get('/resource_by_id/:id', resourceByIdMid, (req, res) => {
  return res.status(200).json({
    _id: req.params.id,
    data: 'blablabla',
  });
});

const allowNull = reqparams({
  name: { type: String, required: false, nullable: true }, // May be null
  age: { type: Number, required: false, validate: v => v >= 18 },
}, {
  strict: true,
});

app.post('/allow_null', allowNull, (req, res) => {
  return res.json(req.body);
});

const requiredAndNullable = reqparams({
  name: { type: String, nullable: true }, // May be null
}, {
  strict: true,
});

app.post('/required_and_nullable', requiredAndNullable, (req, res) => {
  return res.json(req.body);
});

const requiredIf = reqparams({
  'name.first': { requiredIf: { $exists: 'name' }},
  'name.last': { requiredIf: { $exists: 'name' }},
});

app.post('/required_if', requiredIf, (req, res) => {
  return res.json(req.body);
});

const requiredIf2 = reqparams({
  'user.name.first': { requiredIf: { $exists: 'user.name' }},
  'user.name.last': { requiredIf: { $exists: 'user.name' }},
  'user.address.line1': { requiredIf: { $exists: 'user' }},
});

app.post('/required_if2', requiredIf2, (req, res) => {
  return res.json(req.body);
});

const requiredIf3 = reqparams({
  'user.name.first': { type: String },
  'user.name.last': { type: String },
  'user.partner.name.first': { type: String, validate: notEmpty, requiredIf: { $exists: 'user.partner' }},
  'user.partner.name.last': { type: String, validate: notEmpty, requiredIf: { $exists: 'user.partner' }},
});

app.post('/required_if3', requiredIf3, (req, res) => {
  return res.json(req.body);
});

const eitherMid = reqparams({
  email: { type: String, either: 1 },
  phone: { type: String, either: 1},
  password: { type: String },
});

app.post('/either', eitherMid, (req, res) => {
  return res.json(req.body);
});

const newTodoMid = reqparams({
  todo: { type: Array, validate: notEmpty },
  name: { type: String, validate: notEmpty },
  something: { required: false, validate: (v, r) => notEmpty(v, r) || 'Something wrong is not right' },
});

app.post('/todo', newTodoMid, (req, res) => {
  return res.json(req.body);
});

const findTodoMid = reqquery({
  author: { type: String, either: 1 },
  date: { type: Date, either: 1 },
});

app.get('/todo/search', findTodoMid, (req, res) => {
  return res.json(req.query);
});

const notUnderageMid = reqall('body', {
  dob: {
    type: Date,
    validate: (v: Date) => {
      return (
        (Date.now() - v.getTime() >= 1000 * 60 * 60 * 24 * 365 * 18)
          ? true : 'Grow up first, kid'
      );
    },
  },
});

app.post('/not_underage', notUnderageMid, (req, res) => {
  if (!(req.body.dob instanceof Date)) {
    throw new Error('Dob is not a Date');
  }
  return res.json(req.body);
});

const aWeekDay = reqall('query', {
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
});

app.get('/my_daily_tasks', aWeekDay, (req, res) => {
  return res.status(200).json(req.query);
});

const aWeekDay2 = reqall('query', {
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    enumCmp: (a, b) => (
      typeof a === 'string' && typeof b === 'string'
      && a.toLowerCase() === b.toLowerCase()
    ),
  },
});

app.get('/my_daily_tasks2', aWeekDay2, (req, res) => {
  return res.status(200).json(req.query);
});

const handler = app.listen(port);

// ╭━━╮            ╭╮      ╭╮
// ┃╭╮┃           ╭╯╰╮    ╭╯╰╮
// ┃╰╯╰┳━━┳━━┳┳━╮ ╰╮╭╋━━┳━┻╮╭╋━━╮
// ┃╭━╮┃┃━┫╭╮┣┫╭╮╮ ┃┃┃┃━┫━━┫┃┃━━┫
// ┃╰━╯┃┃━┫╰╯┃┃┃┃┃ ┃╰┫┃━╋━━┃╰╋━━┃
// ╰━━━┻━━┻━╮┣┻╯╰╯ ╰━┻━━┻━━┻━┻━━╯
//        ╭━╯┃
//  ----- ╰━━╯ _________________________________________________________________

import axios from 'axios';

axios.defaults.baseURL = `http://127.0.0.1:${port}`;

test('POST /a { username: notEmpty } FAIL', async () => {
  try {
    await axios.post('/a');
  }
  catch (e) {
    expect(e.response.status).toBe(400);
    expect(e.response.data).toMatchObject({ error: 'Parameter username missing' });
  }
});

test('POST /a { username: notEmpty } OK', async () => {
  const { data } = await axios.post('/a', {
    username: 'aa',
  });
  expect(data).toMatchObject({});
});

test('POST /nest { username: notEmpty } FAIL', async () => {
  try {
    await axios.post('/nest', {
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
  const { data } = await axios.post('/nest', {
    name: {
      first: 'Paulo',
      last: 'Queiroz',
    },
  });
  expect(data).toMatchObject({});
});

test('POST /strict { some.key: String } OK', async () => {
  const { data } = await axios.post('/strict', {
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

test('POST /strict { some.key: String } FAIL', async () => {
  let data = undefined;
  let error = undefined;

  try {
    const { data: d } = await axios.post('/strict', {
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
    const { data } = await axios.post('/passreq', { user });

    expect(data?.user).toBe(`${user} -- I got more stuff`);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

// Test validId ================================================================

test('GET /resource_by_id/:id FAIL', async () => {
  expect.assertions(1);
  try {
    const invalid_id = 'tttttttttttt'; // Not hex
    await axios.get(`/resource_by_id/${invalid_id}`);
  }
  catch (e) {
    expect(e.response?.data.error).toBe('Invalid parameter id');
  }
});

test('GET /resource_by_id/:id FAIL 2', async () => {
  expect.assertions(1);
  try {
    const invalid_id = 'aaaaaaaaaaaaaaaaaaaaaaaaa'; // Not 12 nor 24 chars long
    await axios.get(`/resource_by_id/${invalid_id}`);
  }
  catch (e) {
    expect(e.response?.data.error).toBe('Invalid parameter id');
  }
});

test('GET /resource_by_id/:id OK', async () => {
  expect.assertions(1);
  try {
    const id = randomBytes(12).toString('hex');
    const { data } = await axios.get(`/resource_by_id/${id}`);

    expect(data?._id).toBe(id);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

// Test null values ============================================================

test('POST /allow_null FAIL', async () => {
  expect.assertions(1);
  try {
    await axios.post('/allow_null', { name: null, age: null });
  }
  catch (e) {
    expect(e.response?.data.error).toBe('Invalid type for param \'age\'');
  }
});

test('POST /allow_null OK', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/allow_null', { name: null, age: 19 });
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('POST /allow_null OK 2', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/allow_null', { name: null });
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('POST /allow_null OK 3', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/allow_null', {});
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('POST /required_and_nullable FAIL', async () => {
  expect.assertions(1);
  try {
    await axios.post('/required_and_nullable', {});
  }
  catch (e) {
    expect(e.response?.data.error).toBe('Parameter name missing');
  }
});

test('POST /required_and_nullable OK', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/required_and_nullable', { name: null });
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

// Test null values ============================================================

test('POST /required_if FAIL', async () => {
  expect.assertions(1);
  try {
    await axios.post('/required_if', { name: { whatever: 'Blah' }});
  }
  catch (e) {
    expect(e.response?.data.error).toBe('name.first is required if name is present');
  }
});

test('POST /required_if FAIL 2', async () => {
  expect.assertions(1);
  try {
    await axios.post('/required_if', { name: { first: 'Hacker' }});
  }
  catch (e) {
    expect(e.response?.data.error).toBe('name.last is required if name is present');
  }
});

test('POST /required_if OK', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/required_if', { name: { first: 'Mr', last: 'Hacker' }});
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('POST /required_if2 OK', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/required_if2', { name: { address: { line1: '123 Here St' }}});
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('POST /required_if3 FAIL', async () => {
  expect.assertions(1);
  try {
    await axios.post('/required_if3', {
      user: {
        name: {
          first: 'Mr',
          last: 'Hacker',
        },
        partner: {
          blah: true,
        },
      },
    });
  }
  catch (e) {
    expect(e.response?.data?.error).toBe('user.partner.name.first is required if user.partner is present');
  }
});

// Test either =================================================================

test('POST /either OK', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/either', { email: 'john@mail.com', password: 'sEcUrE123!' });
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('POST /either FAIL', async () => {
  expect.assertions(1);
  try {
    await axios.post('/either', { password: 'sEcUrE123!' });
  }
  catch (e) {
    expect(e.response?.data.error).toBe('At least one of email, phone must be present');
  }
});

// Test notEmpty ===============================================================

test('POST /todo OK', async () => {
  expect.assertions(1);
  try {
    const res = await axios.post('/todo', { todo: ['Chores', 'Buy stuff', 'Homework'], name: 'Today\'s tasks' });
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('POST /todo FAIL', async () => {
  expect.assertions(1);
  try {
    await axios.post('/todo', { todo: [], name: 'I\'m lazy' });
  }
  catch (e) {
    expect(e.response?.data.error).toBe('Invalid parameter todo');
  }
});

test('POST /todo FAIL 2', async () => {
  expect.assertions(1);
  try {
    await axios.post('/todo', { todo: ['AA'], name: 'I\'m not lazy', something: { 'willNotEmptyFail?': true }});
  }
  catch (e) {
    expect(e.response?.data.error).toBe('Something wrong is not right');
  }
});

test('GET /todo/search OK', async () => {
  expect.assertions(1);
  try {
    const res = await axios.get('/todo/search', { params: { author: 'Me' }});
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

test('GET /todo/search OK 2', async () => {
  expect.assertions(1);
  try {
    const res = await axios.get('/todo/search', { params: { date: new Date }});
    expect(res.status).toBe(200);
  }
  catch (e) {
    console.error(e.response?.data?.error || e);
  }
});

// Test date values ============================================================

test('POST /not_underage OK', async () => {
  const dob = new Date();

  dob.setFullYear(1990);

  const res = await axios.post('/not_underage', {
    dob,
  });

  expect(res.status).toBe(200);
  expect(res.data?.dob).toBe(dob.toISOString());
});

test('POST /not_underage OK 2', async () => {
  const dob = new Date();

  dob.setFullYear(1990);

  const res = await axios.post('/not_underage', {
    // This should actually be the same thing as the previous test
    dob: dob.toISOString(),
  });

  expect(res.status).toBe(200);
  expect(res.data?.dob).toBe(dob.toISOString());
});

test('POST /not_underage FAIL', async () => {
  expect.assertions(2);
  try {
    await axios.post('/not_underage', {
      dob: '22',
    });
  }
  catch (e) {
    expect(e.response?.status).toBe(400);
    expect(e.response?.data.error).toBe('Invalid type for param \'dob\'');
  }
});

test('POST /not_underage FAIL 2', async () => {
  expect.assertions(2);
  try {
    await axios.post('/not_underage', {
      dob: 22,
    });
  }
  catch (e) {
    expect(e.response?.status).toBe(400);
    expect(e.response?.data.error).toBe('Invalid type for param \'dob\'');
  }
});

test('POST /not_underage FAIL underage', async () => {
  expect.assertions(2);
  try {
    await axios.post('/not_underage', {
      dob: new Date(),
    });
  }
  catch (e) {
    expect(e.response?.status).toBe(400);
    expect(e.response?.data.error).toBe('Grow up first, kid');
  }
});

test('GET /my_daily_tasks OK - testing enum', async () => {
  const body = { day: 'Friday' };
  const res = await axios.get('/my_daily_tasks', {
    params: body,
  });

  expect(res.status).toBe(200);
  expect(JSON.stringify(res.data)).toBe(JSON.stringify(body));
});

test('GET /my_daily_tasks FAIL - testing enum', async () => {
  expect.assertions(2);
  try {
    await axios.get('/my_daily_tasks', {
      params: { day: 'FRiday' },
    });
  }
  catch (e) {
    expect(e.response?.status).toBe(400);
    expect(e.response?.data.error).toBe('Invalid value for day');
  }
});

test('GET /my_daily_tasks FAIL 2 - testing enum', async () => {
  expect.assertions(2);
  try {
    await axios.get('/my_daily_tasks', {
      params: { day: 'BANANA' },
    });
  }
  catch (e) {
    expect(e.response?.status).toBe(400);
    expect(e.response?.data.error).toBe('Invalid value for day');
  }
});

test('GET /my_daily_tasks2 OK - testing enum', async () => {
  const body = { day: 'fRIDAY' };
  const res = await axios.get('/my_daily_tasks2', {
    params: body,
  });

  expect(res.status).toBe(200);
  expect(JSON.stringify(res.data)).toBe(JSON.stringify(body));
});

test('GET /my_daily_tasks2 FAIL - testing enum', async () => {
  expect.assertions(2);
  try {
    await axios.get('/my_daily_tasks2', {
      params: { day: 'BANANA' },
    });
  }
  catch (e) {
    expect(e.response?.status).toBe(400);
    expect(e.response?.data.error).toBe('Invalid value for day');
  }
});

// Close listener after testing
afterAll(() => handler.close());
