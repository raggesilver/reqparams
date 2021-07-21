import { createApp } from './utils';
import { ParamBuilder, reqparams } from '../src';
import * as supertest from 'supertest';

const app = createApp();
const agent = supertest(app);

const postMinMaxMid = reqparams('body', {
  name: ParamBuilder.String().min(2).max(3),
});
const postNotEmptyMid = reqparams('body', {
  name: ParamBuilder.String().notEmpty('Name cannot be empty'),
});

app.post('/minmax', postMinMaxMid, (req, res) => res.json(req.body));
app.post('/notemtpy', postNotEmptyMid, (req, res) => res.json(req.body));

describe('Test StringBuilder', () => {
  it('Pass min max', async () => {
    await agent
      .post('/minmax')
      .send({ name: 'May' })
      .expect(200)
      .catch(e => console.error(e));
  });

  it('Pass notEmpty', async () => {
    await agent
      .post('/notemtpy')
      .send({ name: 'May' })
      .expect(200)
      .catch(e => console.error(e));
  });

  it('Fail notEmpty', async () => {
    await agent
      .post('/notemtpy')
      .send({ name: '     ' })
      .expect(400, { error: 'Name cannot be empty' });
  });
});
