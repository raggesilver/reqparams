import { createApp } from './utils';
import { ParamBuilder, reqparams } from '../src';
import * as supertest from 'supertest';

const app = createApp();
const agent = supertest(app);

const postGeqMid = reqparams('body', {
  age: ParamBuilder.Number().geq(18, 'You must be at least 18 years old'),
});
const postGtMid = reqparams('body', {
  amount: ParamBuilder.Number().gt(20, 'You must buy more than 20 items'),
});
const postIntMid = reqparams('body', {
  amount: ParamBuilder.Number().integer('Amount must be an integer'),
});

app.post('/geq', postGeqMid, (req, res) => res.json(req.body));
app.post('/gt', postGtMid, (req, res) => res.json(req.body));
app.post('/int', postIntMid, (req, res) => res.json(req.body));

describe('Test NumberBuilder', () => {
  describe('Test greater than or equal', () => {
    it('Pass', async () => {
      await agent.post('/geq').send({ age: 18 }).expect(200);
    });

    it('Pass (float)', async () => {
      await agent.post('/geq').send({ age: 18.4 }).expect(200);
    });

    it('Fail', async () => {
      await agent
        .post('/geq')
        .send({ age: 17 })
        .expect(400, { error: 'You must be at least 18 years old' });
    });

    it('Fail (float)', async () => {
      await agent
        .post('/geq')
        .send({ age: 17.9 })
        .expect(400, { error: 'You must be at least 18 years old' });
    });
  });

  describe('Test greater than', () => {
    it('Pass', async () => {
      await agent.post('/gt').send({ amount: 21 }).expect(200);
    });

    it('Pass (float)', async () => {
      await agent.post('/gt').send({ amount: 20.1 }).expect(200);
    });

    it('Fail', async () => {
      await agent
        .post('/gt')
        .send({ amount: 20 })
        .expect(400, { error: 'You must buy more than 20 items' });
    });

    it('Fail (float)', async () => {
      await agent
        .post('/gt')
        .send({ amount: 19.9 })
        .expect(400, { error: 'You must buy more than 20 items' });
    });
  });

  // TODO: test less than
  // TODO: test less than equal

  describe('Test integer', () => {
    it('Pass', async () => {
      await agent.post('/int').send({ amount: 1 }).expect(200);
    });

    it('Fail', async () => {
      await agent
        .post('/int')
        .send({ amount: 1.1 })
        .expect(400, { error: 'Amount must be an integer' });
    });
  });
});
