import * as express from 'express';
import * as supertest from 'supertest';

import { ParamBuilder, reqall } from '../src';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const agent = supertest(app);

const requirements = {
  postLt: reqall('body', {
    age: ParamBuilder.Number({ integer: true }).lt(100, 'You\'re too old'),
    ageDefault: ParamBuilder.Number({ integer: true }).lt(100).notRequired(),
  }),
  postLte: reqall('body', {
    age: ParamBuilder.Number({ integer: true }).lte(100, 'You\'re too old'),
    ageDefault: ParamBuilder.Number({ integer: true }).lte(100).notRequired(),
  }),
  postGt: reqall('body', {
    age: ParamBuilder.Number({ integer: true }).gt(17, 'You\'re too young'),
    ageDefault: ParamBuilder.Number({ integer: true }).gt(17, ).notRequired(),
  }),
  postGte: reqall('body', {
    age: ParamBuilder.Number({ integer: true }).gte(18, 'You\'re too young'),
    ageDefault: ParamBuilder.Number({ integer: true }).gte(18, ).notRequired(),
  }),
};

app.post('/lt', requirements.postLt, (req, res) => res.json(req.body));
app.post('/lte', requirements.postLte, (req, res) => res.json(req.body));
app.post('/gt', requirements.postGt, (req, res) => res.json(req.body));
app.post('/gte', requirements.postGte, (req, res) => res.json(req.body));

const appGlobalErrorHandler = (
  _error: Error, _req: express.Request, res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction
) => {
  return res.status(500).json({ error: 'Something went wrong on our end' });
};

app.use(appGlobalErrorHandler);

// Test lt, lte, gt & gte ======================================================

describe('Test lt', () => {
  it('Should fail lt', async () => {
    await agent.post('/lt')
      .send({ age: 100 })
      .expect(400, {
        error: 'You\'re too old',
      });
  });

  it('Should pass lt', async () => {
    await agent.post('/lt')
      .send({ age: 99 })
      .expect(200);
  });

  it('Default lt error message', async () => {
    await agent.post('/lt')
      .send({ age: 99, ageDefault: 100 })
      .expect(400, {
        error: 'ageDefault must be less than 100',
      });
  });
});

describe('Test lte', () => {
  it('Should fail lte', async () => {
    await agent.post('/lte')
      .send({ age: 101 })
      .expect(400, {
        error: 'You\'re too old',
      });
  });

  it('Should pass lte', async () => {
    await agent.post('/lte')
      .send({ age: 100 })
      .expect(200);
  });

  it('Default lte error message', async () => {
    await agent.post('/lte')
      .send({ age: 100, ageDefault: 101 })
      .expect(400, {
        error: 'ageDefault must be less than or equal 100',
      });
  });
});


describe('Test gt', () => {
  it('Should fail gt', async () => {
    await agent.post('/gt')
      .send({ age: 17 })
      .expect(400, {
        error: 'You\'re too young',
      });
  });

  it('Should pass gt', async () => {
    await agent.post('/gt')
      .send({ age: 18 })
      .expect(200);
  });

  it('Default gt error message', async () => {
    await agent.post('/gt')
      .send({ age: 18, ageDefault: 17 })
      .expect(400, {
        error: 'ageDefault must be greater than 17',
      });
  });
});

describe('Test gte', () => {
  it('Should fail gte', async () => {
    await agent.post('/gte')
      .send({ age: 17 })
      .expect(400, {
        error: 'You\'re too young',
      });
  });

  it('Should pass gte', async () => {
    await agent.post('/gte')
      .send({ age: 18 })
      .expect(200);
  });

  it('Default gte error message', async () => {
    await agent.post('/gte')
      .send({ age: 18, ageDefault: 17 })
      .expect(400, {
        error: 'ageDefault must be greater than or equal 18',
      });
  });
});
