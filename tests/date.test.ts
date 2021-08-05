import { createApp } from './utils';
import { ParamBuilder, reqparams } from '../src';
import * as supertest from 'supertest';

const app = createApp();
const agent = supertest(app);

const postDobMid = reqparams('body', {
  dob: ParamBuilder.Date().leq(new Date('1999-12-31'), "You're too young."),
});

const postExprMid = reqparams('body', {
  expr: ParamBuilder.Date().gt(() => new Date(), 'Your document has expired.'),
});

app.post('/dob', postDobMid, (req, res) => res.json(req.body));
app.post('/expr', postExprMid, (req, res) => res.json(req.body));

describe('Test DateBuilder', () => {
  it('Pass dob', async () => {
    await agent
      .post('/dob')
      .send({ dob: new Date('1998-10-10') })
      .expect(200);
  });

  it('Fail dob', async () => {
    await agent
      .post('/dob')
      .send({ dob: new Date() })
      .expect(400, { error: "You're too young." });
  });

  it('Pass expr', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await agent.post('/expr').send({ expr: tomorrow }).expect(200);
  });

  it('Fail expr', async () => {
    await agent
      .post('/expr')
      .send({ expr: new Date() })
      .expect(400, { error: 'Your document has expired.' });
  });
});
