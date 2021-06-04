import * as express from 'express';
import * as _supertest from 'supertest';

import { ParamBuilder, reqall } from '../src';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const supertest = _supertest(app);

const NOT_EMPTY_STRING = ParamBuilder.String().notEmpty();
const PASSWORD_REG =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,32}/;
const PASSWORD_MATCH_ERROR = 'Password must have at least one lowercase letter,'
  + ' one uppercase letter, one number, one special character and must range'
  + ' from 8 to 32 characters';

const requirements = {
  postLogin: reqall('body', {
    'username': NOT_EMPTY_STRING,
    'password': NOT_EMPTY_STRING,
    'stayLoggedIn': ParamBuilder.Boolean().notRequired(),
    'partner.name': NOT_EMPTY_STRING.clone().setName('partner name')
      .setRequiredIfExists('partner'),
    'internalError': ParamBuilder.String().setValidate(() => {
      throw new Error('An internal error');
    }).notRequired(),
  }),
  postDynamicLogin: reqall('body', {
    'username': NOT_EMPTY_STRING.clone().setEither(1),
    'phone': NOT_EMPTY_STRING.clone().setEither(1),
    'password': NOT_EMPTY_STRING,
  }),
  postNotDynamicLogin: reqall('body', {
    'username': NOT_EMPTY_STRING.clone().setEither(1),
    'password': ParamBuilder.String().match(/^Safe password$/),
  }),
  postRegister: reqall('body', {
    'username': ParamBuilder.String().min(6).max(16), // unique('username', User),
    'password': ParamBuilder.String().match(PASSWORD_REG, PASSWORD_MATCH_ERROR),
    'name.first': NOT_EMPTY_STRING.clone().setName('first name'),
    'name.last': NOT_EMPTY_STRING.clone().setName('last name'),
  }, {
    strict: true,
  }),
  postPaginatedSearch: reqall('body', {
    'page': ParamBuilder.Number({ integer: true }).min(1).notRequired(),
  }),
  postTodo: reqall('body', {
    'todo': ParamBuilder.Array().min(1).max(200),
  }),
  postDate: reqall('body', {
    'holiday': ParamBuilder.String().setEnum(['Tuesday']).notRequired(),
    'workday': ParamBuilder.String().setEnum(
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    ).notRequired(),
  }),
  postBuyAlcohol: reqall('body', {
    'age': ParamBuilder.Number({ integer: true })
      .min(18, 'Minors cannot buy alcohol')
      .max(128, 'You are too old to drink alcohol'),
  }),
  postPartner: reqall('body', {
    'user.partner': ParamBuilder.Object().notRequired().setName('partner'),
    'user.partner.name': NOT_EMPTY_STRING
      .clone().setName('partner name').setRequiredIfExists('user.partner'),
  }),
  postUpdate: reqall('body', {
    'changePassword': ParamBuilder.Boolean(),
    'newPassword': ParamBuilder.String().notEmpty().setRequiredIf(req => !!req.body.changePassword),
  }),
};

app.post('/login', requirements.postLogin, (req, res) => res.json(req.body));
app.post('/dynamic-login', requirements.postDynamicLogin, (req, res) => res.json(req.body));
app.post('/not-dynamic-login', requirements.postNotDynamicLogin, (req, res) => res.json(req.body));
app.post('/register', requirements.postRegister, (req, res) => res.json(req.body));
app.post('/search', requirements.postPaginatedSearch, (req, res) => res.json(req.body));
app.post('/todo', requirements.postTodo, (req, res) => res.json(req.body));
app.post('/date', requirements.postDate, (req, res) => res.json(req.body));
app.post('/buy-alcohol', requirements.postBuyAlcohol, (req, res) => res.json(req.body));
app.post('/partner', requirements.postPartner, (req, res) => res.json(req.body));
app.post('/update', requirements.postUpdate, (req, res) => res.json(req.body));

const appGlobalErrorHandler = (
  _error: Error, _req: express.Request, res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction
) => {
  res.status(500).json({ error: 'Something went wrong on our end' });
};

app.use(appGlobalErrorHandler);

// Default error messages ======================================================

describe('Test default error messages', () => {
  it('shoud return `username is required`', done => {
    supertest.post('/login')
      .send({})
      .expect(400, {
        error: 'username is required',
      }, done);
  });

  it('shoud return `username may not be empty`', done => {
    supertest.post('/login')
      .send({ username: '' })
      .expect(400, {
        error: 'username may not be empty',
      }, done);
  });

  it('shoud return `password may not be empty`', done => {
    supertest.post('/login')
      .send({ username: 'asd', password: '      ' })
      .expect(400, {
        error: 'password may not be empty',
      }, done);
  });

  it('shoud return `Invalid type for password`', done => {
    supertest.post('/login')
      .send({ username: 'asd', password: 2 })
      .expect(400, {
        error: 'Invalid type for password',
      }, done);
  });

  it('shoud return `partner name is required when partner is provided`', done => {
    supertest.post('/login')
      .send({ username: 'asd', password: '2', partner: {} })
      .expect(400, {
        error: 'partner name is required when partner is provided',
      }, done);
  });

  it('should fail for not matching regex', done => {
    supertest.post('/not-dynamic-login')
      .send({ username: 'aa', password: 'not good' })
      .expect(400, {
        error: 'Invalid password',
      }, done);
  });
});

// Test name ===================================================================

describe('Test name', () => {
  it('should replace `name.first` with `first name`', done => {
    supertest.post('/register')
      .send({ username: 'valid uname', password: 'Abcd123@' })
      .expect(400, {
        error: 'first name is required',
      }, done);
  });

  it('should replace `name.last` with `last name`', done => {
    supertest.post('/register')
      .send({
        username: 'valid uname', password: 'Abcd123@', name: { first: 'Bob' },
      })
      .expect(400, {
        error: 'last name is required',
      }, done);
  });
});

// .match() ====================================================================

describe('Test .match()', () => {
  it('should reject password', done => {
    supertest.post('/register')
      .send({
        username: 'valid uname', password: 'weak',
      })
      .expect(400, {
        error: PASSWORD_MATCH_ERROR,
      }, done);
  });

  it('should accept password', done => {
    const payload = {
      username: 'mrhacker', password: '@sTr0ngPassw0rd',
      name: { first: 'Mr', last: 'Hacker' },
    };

    supertest.post('/register')
      .send(payload)
      .expect(200, payload, done);
  });
});

// .notRequired() ==============================================================

describe('Test .notRequired()', () => {
  it('shoud pass', done => {
    supertest.post('/login')
      .send({ username: 'asd', password: 'a' })
      .expect(200, done);
  });

  it('shoud fail due to wrong type', done => {
    supertest.post('/login')
      .send({ username: 'asd', password: '2', stayLoggedIn: 3 })
      .expect(400, {
        error: 'Invalid type for stayLoggedIn',
      }, done);
  });
});

// .setEither() ================================================================

describe('Test .setEither()', () => {
  it('should fail due to missing all', done => {
    supertest.post('/dynamic-login')
      .send({ password: 'aa' })
      .expect(400, {
        error: 'One of username or phone is required',
      }, done);
  });

  it('should pass with username only', done => {
    supertest.post('/dynamic-login')
      .send({ username: 'aa', password: 'aa' })
      .expect(200, done);
  });

  it('should pass with phone only', done => {
    supertest.post('/dynamic-login')
      .send({ phone: '99', password: 'aa' })
      .expect(200, done);
  });

  it('should pass with both', done => {
    supertest.post('/dynamic-login')
      .send({ username: 'aa', phone: '99', password: 'aa' })
      .expect(200, done);
  });

  it('should fail for missing the only one', done => {
    supertest.post('/not-dynamic-login')
      .send({ password: 'Safe password' })
      .expect(400, {
        error: 'username is required',
      }, done);
  });
});

// Test integer ================================================================

describe('Test integer', () => {
  it('should fail for fractional number', done => {
    supertest.post('/search')
      .send({ page: 1.2 })
      .expect(400, {
        error: 'page must be an integer',
      }, done);
  });

  it('should pass for integer number', done => {
    supertest.post('/search')
      .send({ page: 1 })
      .expect(200, done);
  });
});

// .min() & .max() =============================================================

describe('Test .min() / .max()', () => {
  it ('should fail due to not enough items', done => {
    supertest.post('/todo')
      .send({ todo: [] })
      .expect(400, {
        error: 'todo must have at least 1 item',
      }, done);
  });

  it ('should fail due to too much items', done => {
    supertest.post('/todo')
      .send({ todo: (new Array(201)).map((_, i) => i) })
      .expect(400, {
        error: 'todo must have at most 200 items',
      }, done);
  });

  it ('should fail due to string being too short', done => {
    supertest.post('/register')
      .send({ username: 'short' })
      .expect(400, {
        error: 'username must be at least 6 characters long',
      }, done);
  });

  it ('should fail due to string being too long', done => {
    supertest.post('/register')
      .send({ username: 'this is in fact a very long username' })
      .expect(400, {
        error: 'username must be at most 16 characters long',
      }, done);
  });

  it ('should fail for being underage', done => {
    supertest.post('/buy-alcohol')
      .send({ age: 17 })
      .expect(400, {
        error: 'Minors cannot buy alcohol',
      }, done);
  });

  it ('should fail for being overage', done => {
    supertest.post('/buy-alcohol')
      .send({ age: 129 })
      .expect(400, {
        error: 'You are too old to drink alcohol',
      }, done);
  });
});

// .setEnum() ==================================================================

describe('Test .setEnum()', () => {
  it('should fail for invalid value', done => {
    supertest.post('/date')
      .send({ holiday: 'Sunday' })
      .expect(400, {
        error: 'holiday must be Tuesday',
      }, done);
  });

  it('should fail for invalid value 2', done => {
    supertest.post('/date')
      .send({ workday: 'Sunday' })
      .expect(400, {
        error: 'workday must be one of Monday, Tuesday, Wednesday, Thursday or Friday',
      }, done);
  });
});

// Test internal error

describe('Test internal error handling', () => {
  it('shoud beautifully handle an internal error', done => {
    supertest.post('/login')
      .send({ username: 'a', password: 'a', internalError: 'yes' })
      .expect(500, {
        error: 'Something went wrong on our end',
      }, done);
  });
});

// .setRequiredIfExists() ======================================================

describe('Test requiredIfExists naming', () => {
  it('Should pass empty', done => {
    supertest.post('/partner')
      .send({})
      .expect(200, {}, done);
  });

  it('Should pass full', done => {
    supertest.post('/partner')
      .send({ user: { partner: { name: 'Her' }}})
      .expect(200, done);
  });

  it('Should fail', done => {
    supertest.post('/partner')
      .send({ user: { partner: {}}})
      .expect(400, {
        error: 'partner name is required when partner is provided',
      }, done);
  });
});

// .setRequiredIfExists() ======================================================

describe('Test requiredIf', () => {
  it('Should pass', async () => {
    await supertest.post('/update')
      .send({ changePassword: false })
      .expect(200);
  });

  it('Should fail due to missing required param', async () => {
    await supertest.post('/update')
      .send({ changePassword: true })
      .expect(400, { error: 'newPassword is required' });
  });

  it('Should pass with all params', async () => {
    await supertest.post('/update')
      .send({ changePassword: true, newPassword: 'secure123' })
      .expect(200);
  });
});
