import * as supertest from 'supertest';
import { createApp } from '../utils';
import { ParamBuilder, reqparams } from '../../src';

const app = createApp();
const agent = supertest(app);

const notrequiredMid = reqparams('body', {
  name: ParamBuilder.String().notRequired(),
});
const requiredIfMid = reqparams('body', {
  'name.first': ParamBuilder.String().setRequired(req => {
    console.log('Is required?', 'name' in req.body);
    return 'name' in req.body;
  }),
});

app.post('/notrequired', notrequiredMid);
app.post('/requiredif', requiredIfMid);

app.use((req, res) => res.json(req.body));

describe('Test existence check', () => {
  it('Pass not required', async () => {
    await agent.post('/notrequired').send({}).expect(200, {});
  });

  it('Pass required if exists', async () => {
    await agent.post('/requiredif').send({}).expect(200, {});
  });

  it('Fail required if exists', async () => {
    await agent
      .post('/requiredif')
      .send({
        name: {},
      })
      .expect(400, {
        error: 'name.first is required.',
      });
  });
});
