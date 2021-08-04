import { createApp } from './utils';
import { ParamBuilder, reqparams } from '../src';
import * as supertest from 'supertest';

const app = createApp();
const agent = supertest(app);

const anonMid = reqparams('body', {
  anon: ParamBuilder.Boolean(),
});

const trueAndFalse = reqparams('body', {
  underage: ParamBuilder.Boolean().false(
    'Come back when you are 18 years old.',
  ),
  agreeTos: ParamBuilder.Boolean().true(
    'You must agree with our terms of service.',
  ),
});

app.post('/anon', anonMid, (req, res) => res.json(req.body));
app.post('/signup', trueAndFalse, (req, res) => res.json(req.body));

describe('Test BooleanBuilder', () => {
  it('Should pass with true', async () => {
    await agent.post('/anon').send({ anon: true }).expect(200, { anon: true });
  });

  it('Should pass with false', async () => {
    await agent
      .post('/anon')
      .send({ anon: false })
      .expect(200, { anon: false });
  });

  it('Should fail with invalid type', async () => {
    await agent
      .post('/anon')
      .send({ anon: 'true' })
      .expect(400, { error: 'Invalid type for anon.' });
  });

  it('Should fail true()', async () => {
    await agent
      .post('/signup')
      .send({ underage: false, agreeTos: false })
      .expect(400, { error: 'You must agree with our terms of service.' });
  });

  it('Should fail false()', async () => {
    await agent
      .post('/signup')
      .send({ underage: true, agreeTos: true })
      .expect(400, { error: 'Come back when you are 18 years old.' });
  });

  it('Should pass true() & false()', async () => {
    await agent
      .post('/signup')
      .send({ underage: false, agreeTos: true })
      .expect(200);
  });
});
