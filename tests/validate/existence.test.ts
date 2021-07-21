import * as supertest from 'supertest';
import { createApp } from '../utils';
import { ParamBuilder, reqparams } from '../../src';

const app = createApp();
const agent = supertest(app);

const postMid = reqparams('body', {
  name: ParamBuilder.String().notRequired(),
});

app.post('/notrequired', postMid);

app.use((req, res) => res.json(req.body));

describe('Test existence check', () => {
  it('Pass not required', async () => {
    await agent.post('/notrequired').send({}).expect(200, {});
  });
});
