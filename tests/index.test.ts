
// ╭━━━╮             ╭━━━╮  ╭╮
// ┃╭━╮┃             ┃╭━╮┃ ╭╯╰╮
// ┃╰━━┳━━┳━┳╮╭┳━━┳━╮┃╰━━┳━┻╮╭╋╮╭┳━━╮
// ╰━━╮┃┃━┫╭┫╰╯┃┃━┫╭╯╰━━╮┃┃━┫┃┃┃┃┃╭╮┃
// ┃╰━╯┃┃━┫┃╰╮╭┫┃━┫┃ ┃╰━╯┃┃━┫╰┫╰╯┃╰╯┃
// ╰━━━┻━━┻╯ ╰╯╰━━┻╯ ╰━━━┻━━┻━┻━━┫╭━╯
//                               ┃┃
//  ---------------------------- ╰╯ --------------------------------------------

import * as express from 'express';

import { randomBytes } from 'crypto';
import { reqall, ParamBuilder } from '../src';

const app = express();
const port = Number(process.env.PORT) || 9143;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const postAMid = reqall('body', {
  username: ParamBuilder.String().notEmpty(),
});

app.post('/a', postAMid, (_req, res) => {
  return res.json({});
});

const postNest = reqall('body', {
  'name.first': {},
  'name.last': {},
});

app.post('/nest', postNest, (_req, res) => {
  return res.json({});
});

const strictMid = reqall('body', {
  'some.key': ParamBuilder.String(),
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

const passReqMid = reqall('body', {
  'user': ParamBuilder.String().notEmpty().setValidate((v, req) => {
    req.body.user = `${v} -- I got more stuff`;
    return true;
  }),
});

app.post('/passreq', passReqMid, (req, res) => res.status(200).json(req.body));

const resourceByIdMid = reqall('params', {
  id: ParamBuilder.ObjectId(),
});

app.get('/resource_by_id/:id', resourceByIdMid, (req, res) => {
  return res.status(200).json({
    _id: req.params.id,
    data: 'blablabla',
  });
});

const allowNull = reqall('body', {
  name: ParamBuilder.String().notRequired().setNullable(true), // May be null
  age: ParamBuilder.Number({ integer: true }).notRequired().min(18),
}, {
  strict: true,
});

app.post('/allow_null', allowNull, (req, res) => {
  return res.json(req.body);
});

const requiredAndNullable = reqall('body', {
  name: ParamBuilder.String().setNullable(true), // May be null
}, {
  strict: true,
});

app.post('/required_and_nullable', requiredAndNullable, (req, res) => {
  return res.json(req.body);
});

const requiredIf = reqall('body', {
  'name.first': ParamBuilder.String().setRequiredIfExists('name'),
  'name.last': ParamBuilder.String().setRequiredIfExists('name'),
});

app.post('/required_if', requiredIf, (req, res) => {
  return res.json(req.body);
});

const requiredIf2 = reqall('body', {
  'user.name.first': ParamBuilder.String().setRequiredIfExists('user.name'),
  'user.name.last': ParamBuilder.String().setRequiredIfExists('user.name'),
  'user.address.line1': ParamBuilder.String().setRequiredIfExists('user'),
});

app.post('/required_if2', requiredIf2, (req, res) => {
  return res.json(req.body);
});

const requiredIf3 = reqall('body', {
  'user.name.first': ParamBuilder.String(),
  'user.name.last': ParamBuilder.String(),
  'user.partner.name.first': ParamBuilder.String().notEmpty().setRequiredIfExists('user.partner'),
  'user.partner.name.last': ParamBuilder.String().notEmpty().setRequiredIfExists('user.partner'),
});

app.post('/required_if3', requiredIf3, (req, res) => {
  return res.json(req.body);
});

const eitherMid = reqall('body', {
  email: ParamBuilder.String().setEither(1),
  phone: ParamBuilder.String().setEither(1),
  password: ParamBuilder.String(),
});

app.post('/either', eitherMid, (req, res) => {
  return res.json(req.body);
});

const newTodoMid = reqall('body', {
  todo: ParamBuilder.Array().notEmpty(),
  name: ParamBuilder.String().notEmpty(),
  something: ParamBuilder.Object().notRequired().notEmpty(),
});

app.post('/todo', newTodoMid, (req, res) => {
  return res.json(req.body);
});

const findTodoMid = reqall('query', {
  author: ParamBuilder.String().setEither(1),
  date: ParamBuilder.Date().setEither(1),
});

app.get('/todo/search', findTodoMid, (req, res) => {
  return res.json(req.query);
});

const notUnderageMid = reqall('body', {
  dob: ParamBuilder.Date().max(Date.now() - (1000 * 60 * 60 * 24 * 365 * 18), 'Grow up first, kid'),
});

app.post('/not_underage', notUnderageMid, (req, res) => {
  if (!(req.body.dob instanceof Date)) {
    throw new Error('Dob is not a Date');
  }
  return res.json(req.body);
});

const aWeekDay = reqall('query', {
  day: ParamBuilder.String().setEnum(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  ),
});

app.get('/my_daily_tasks', aWeekDay, (req, res) => {
  return res.status(200).json(req.query);
});

const aWeekDay2 = reqall('query', {
  day: ParamBuilder.String()
    .setEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    .setEnumCmp((a, b) => (
      typeof a === 'string' && typeof b === 'string'
      && a.toLowerCase() === b.toLowerCase()
    )),
});

app.get('/my_daily_tasks2', aWeekDay2, (req, res) => {
  return res.status(200).json(req.query);
});

const minMaxMid = reqall('body', {
  age: ParamBuilder.Number({ integer: true }).min(18).max(24),
  username: ParamBuilder.String().min(8).max(12),
});

app.post('/min-max', minMaxMid, (_, res) => res.status(200).json({}));

const handler = app.listen(port);

// ╭━━╮            ╭╮      ╭╮
// ┃╭╮┃           ╭╯╰╮    ╭╯╰╮
// ┃╰╯╰┳━━┳━━┳┳━╮ ╰╮╭╋━━┳━┻╮╭╋━━╮
// ┃╭━╮┃┃━┫╭╮┣┫╭╮╮ ┃┃┃┃━┫━━┫┃┃━━┫
// ┃╰━╯┃┃━┫╰╯┃┃┃┃┃ ┃╰┫┃━╋━━┃╰╋━━┃
// ╰━━━┻━━┻━╮┣┻╯╰╯ ╰━┻━━┻━━┻━┻━━╯
//        ╭━╯┃
//  ----- ╰━━╯ _________________________________________________________________

import axios, { AxiosError } from 'axios';

axios.defaults.baseURL = `http://127.0.0.1:${port}`;

test('POST /a { username: notEmpty } FAIL', async () => {
  try {
    await axios.post('/a');
  }
  catch (e) {
    expect(e.response.status).toBe(400);
    expect(e.response.data).toMatchObject({ error: 'username is required' });
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
      error: 'name.last is required',
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
    expect(e.response?.data.error).toBe('tttttttttttt is not a valid id');
  }
});

test('GET /resource_by_id/:id FAIL 2', async () => {
  expect.assertions(1);
  try {
    const invalid_id = 'aaaaaaaaaaaaaaaaaaaaaaaaa'; // Not 12 nor 24 chars long
    await axios.get(`/resource_by_id/${invalid_id}`);
  }
  catch (e) {
    expect(e.response?.data.error).toBe('aaaaaaaaaaaaaaaaaaaaaaaaa is not a valid id');
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
    expect(e.response?.data.error).toBe('Invalid type for age');
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
    expect(e.response?.data.error).toBe('name is required');
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
    expect(e.response?.data.error).toBe('name.first is required when name is provided');
  }
});

test('POST /required_if FAIL 2', async () => {
  expect.assertions(1);
  try {
    await axios.post('/required_if', { name: { first: 'Hacker' }});
  }
  catch (e) {
    expect(e.response?.data.error).toBe('name.last is required when name is provided');
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
    expect(e.response?.data?.error).toBe('user.partner.name.first is required when user.partner is provided');
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
    expect(e.response?.data.error).toBe('One of email or phone is required');
  }
});

// Test notEmpty ===============================================================

test('POST /todo OK', async () => {
  expect.assertions(1);
  const res = await axios.post('/todo', { todo: ['Chores', 'Buy stuff', 'Homework'], name: 'Today\'s tasks' });
  expect(res.status).toBe(200);
});

test('POST /todo FAIL', async () => {
  expect.assertions(1);
  try {
    await axios.post('/todo', { todo: [], name: 'I\'m lazy' });
  }
  catch (e) {
    expect(e.response?.data.error).toBe('todo may not be empty');
  }
});

test('POST /todo OK 2', async () => {
  expect.assertions(1);
  const res = await axios.post('/todo', { todo: ['AA'], name: 'I\'m not lazy', something: { 'willNotEmptyFail?': false }});
  expect(res.status).toBe(200);
});

test('POST /todo FAIL 2', async () => {
  expect.assertions(1);
  try {
    await axios.post('/todo', { todo: ['AA'], name: 'I\'m not lazy', something: {}});
  }
  catch (e) {
    expect(e.response?.data.error).toBe('something may not be empty');
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
  expect.assertions(2);
  try {
    const dob = new Date();

    dob.setFullYear(1990);

    const res = await axios.post('/not_underage', {
      dob,
    });

    expect(res.status).toBe(200);
    expect(res.data?.dob).toBe(dob.toISOString());
  }
  catch (e) {
    console.error(e.response.data);
  }
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
    expect(e.response?.data.error).toBe('Invalid type for dob');
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
    expect(e.response?.data.error).toBe('Invalid type for dob');
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
    expect(e.response?.data.error).toBe('day must be one of Monday, Tuesday, Wednesday, Thursday or Friday');
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
    expect(e.response?.data.error).toBe('day must be one of Monday, Tuesday, Wednesday, Thursday or Friday');
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
    expect(e.response?.data.error).toBe('day must be one of Monday, Tuesday, Wednesday, Thursday or Friday');
  }
});

test('POST /min-max OK', async () => {
  expect.assertions(2);

  const res = await axios.post('/min-max', {
    age: 18,
    username: 'la potato',
  });

  expect(res.status).toBe(200);
  expect(res.data).toEqual({});
});

test('POST /min-max FAIL', async () => {
  expect.assertions(8);

  await axios.post('/min-max', {
    age: 17,
    username: 'la potato',
  })
    .catch((e: AxiosError) => {
      expect(e.response?.status).toBe(400);
      expect(e.response?.data.error).toBe('age must be at least 18');
    });

  await axios.post('/min-max', {
    age: 25,
    username: 'la potato',
  })
    .catch((e: AxiosError) => {
      expect(e.response?.status).toBe(400);
      expect(e.response?.data.error).toBe('age must be at most 24');
    });

  await axios.post('/min-max', {
    age: 24,
    username: 'la po',
  })
    .catch((e: AxiosError) => {
      expect(e.response?.status).toBe(400);
      expect(e.response?.data.error).toBe('username must be at least 8 characters long');
    });

  await axios.post('/min-max', {
    age: 24,
    username: 'la potato land of the beets',
  })
    .catch((e: AxiosError) => {
      expect(e.response?.status).toBe(400);
      expect(e.response?.data.error).toBe('username must be at most 12 characters long');
    });
});

// Close listener after testing
afterAll(() => handler.close());
