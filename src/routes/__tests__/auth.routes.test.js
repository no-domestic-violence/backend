/* eslint-disable arrow-parens */
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';
import app from '../../app';
import User from '../../models/user.model';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';
import { createUser } from '../../controllers/auth.controllers';

beforeAll(() => connectToDatabase());

afterEach(() => clearDatabase());

afterAll(() => closeDatabase());

const getUserGenerator = () => {
  let counter = 0;
  return (overrides = {}) => {
    counter += 1;
    return {
      username: `koosha${counter}`,
      email: `kooshaala${counter}@gmail.com`,
      password: 'Welcome123',
      ...overrides,
    };
  };
};
const getUser = getUserGenerator();

const VALID_USERS = {
  DEFAULT: getUser(),
  PASSWORD_WITHOUT_NUMBERS: getUser({ password: 'Welcometthere' }),
  USERNAME_LENGTH_TWO: getUser({ username: 'hi' }),
};

const INVALID_USERS = {
  DEFAULT: getUser({
    username: undefined,
    email: undefined,
    password: undefined,
  }),
  MISSING_USERNAME: getUser({ username: undefined }),
  MISSING_PASSWORD: getUser({ password: undefined }),
  MISSING_EMAIL: getUser({ email: undefined }),
  EMPTY_EMAIL: getUser({ email: '' }),
  INVALID_EMAIL: getUser({ email: 'jhhfuzegf' }),
  USERNAME_LENGTH_1: getUser({ username: 'a' }),
  INVALID_PASSWORD_LENGHT: getUser({ password: 'Welcome' }),
};

const getLoginUser = (overrides = {}) => ({
  email: 'hellothere@gmail.com',
  password: 'hellothere123',
  ...overrides,
});

const LOGIN_VALID_USERS = {
  DEFAULT: getLoginUser(),
  PASSWORD_WITHOUT_NUMBERS: getLoginUser({ password: 'Welcometthere' }),
};

const LOGIN_INVALID_USERS = {
  DEFAULT: getLoginUser({ email: undefined, password: undefined }),
  MISSING_PASSWORD: getLoginUser({ password: undefined }),
  MISSING_EMAIL: getLoginUser({ email: undefined }),
  EMPTY_EMAIL: getLoginUser({ email: '' }),
  INVALID_EMAIL: getLoginUser({ email: 'jhhfuzegf' }),
  INVALID_PASSWORD_LENGHT: getLoginUser({ password: 'Welcome' }),
};

describe('signup endpoint', () => {
  describe('should save the user in database after signup', () => {
    // eslint-disable-next-line arrow-parens
    Object.entries(VALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        test(key, async () => {
          const res = await request(app)
            .post('/api/signup')
            .send(payload);
          expect(res.statusCode).toEqual(201);
          expect(res.body).toHaveProperty('success');
          expect(res.body).toHaveProperty('user');

          const user = await User.findOne({ email: payload.email });
          expect(user.username).toBeTruthy();
          expect(user.email).toBeTruthy();
          expect(user.password).toBeTruthy();
        });
      });
    });
  });

  describe('fails with invalid data', () => {
    Object.entries(INVALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        test(key, async () => {
          const res = await request(app)
            .post('/api/signup')
            .send(payload);
          expect(res.statusCode).toEqual(422);
          expect(res.body.message).toEqual(
            'Please provide a valid username or password',
          );
        });
      });
    });
  });

  describe('fails with already signed up user', () => {
    Object.entries(VALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        let user;

        beforeEach(async () => {
          user = await createUser(
            payload.username,
            payload.email,
            payload.password,
          );

          await user.save();
        });
        afterEach(async () => {
          await user.delete();
        });
        test(key, async () => {
          const res = await request(app)
            .post('/api/signup')
            .send(payload);
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toEqual('Email already exists');
        });
      });
    });
  });
});

describe('login endpoint', () => {
  describe('should login the user', () => {
    Object.entries(LOGIN_VALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        let user;

        beforeAll(async () => {
          user = await createUser(uuid4(), payload.email, payload.password);

          await user.save();
        });
        afterAll(async () => {
          await user.delete();
        });
        test(key, async () => {
          const res = await request(app)
            .post('/api/login')
            .send(payload);
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Logged in successfully !');
        });
      });
    });
  });
  describe('fails with invalid data', () => {
    Object.entries(LOGIN_INVALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        test(key, async () => {
          const res = await request(app)
            .post('/api/login')
            .send(payload);
          expect(res.statusCode).toEqual(422);
          expect(res.body.message).toEqual(
            'Please provide a valid username or password',
          );
        });
      });
    });
  });

  describe('fails with not signed up user', () => {
    Object.entries(LOGIN_VALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        beforeAll(async () => {
          const user = await User.findOne({ email: payload.email });
          if (user) {
            await user.delete();
          }
        });

        test(key, async () => {
          const res = await request(app)
            .post('/api/login')
            .send(payload);
          expect(res.statusCode).toEqual(404);
          expect(res.body.message).toEqual('User is not signed up');
        });
      });
    });
  });
});

describe('changePassword endpoint', () => {
  describe('user should change the old password', () => {
    Object.entries(VALID_USERS).forEach(testCase => {
      const [key, userData] = testCase;
      const payload = {
        email: userData.email,
        password: uuid4(),
        oldPassword: userData.password,
      };
      describe(key, () => {
        let user;

        beforeAll(async () => {
          user = await createUser(uuid4(), payload.email, payload.oldPassword);
          await user.save();
        });
        afterAll(async () => {
          await user.delete();
        });
        test(key, async () => {
          const res = await request(app)
            .post('/api/changePassword')
            .send(payload);

          expect(res.body.message).toEqual('You updated the password');
          const actual = await User.findOne({ email: payload.email });
          const isPasswordCorrect = await bcrypt.compare(
            payload.password,
            actual.password,
          );
          expect(isPasswordCorrect).toEqual(true);
          expect(res.statusCode).toEqual(200);
        });
      });
    });
  });
});

describe('deleteUser endpoint', () => {
  describe('should delete the user account', () => {
    Object.entries(VALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        let user;
        beforeAll(async () => {
          user = await createUser(
            payload.username,
            payload.email,
            payload.password,
          );
          await user.save();
        });
        afterAll(async () => {
          await user.delete();
        });
        test(key, async () => {
          const res = await request(app).delete(
            `/api/deleteUser/?username=${payload.username}`,
          );
          expect(res.statusCode).toEqual(202);
          expect(res.body.message).toEqual('User was deleted!');
          const actual = await User.findOne({ username: payload.username });
          expect(actual).toBeNull();
        });
      });
    });
  });
});
