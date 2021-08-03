/* eslint-disable import/no-named-as-default-member */
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
import {
  mockVALID_USERS,
  mockINVALID_USERS,
  mockMISSING_USER_INFO,
  mockLOGIN_INVALID_USERS,
  mockLOGIN_VALID_USERS,
  mockINCORRECT_LOGIN_PASSWORD,
  mockINCORRECT_CHANGEPASSWORD_INFO,
  mockMISSING_CHANGEPASSWORD_INFO,
} from '../__mocks__/auth.user';

beforeAll(() => connectToDatabase());

afterEach(() => clearDatabase());

afterAll(() => closeDatabase());

jest.mock('../../middleware/verifyAccessToken', () =>
  jest.fn((req, res, next) => {
    next();
  }),
);

describe('signup endpoint', () => {
  /*
  describe('should save the user in database after signup', () => {
    // eslint-disable-next-line arrow-parens
    Object.entries(mockVALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        test(key, async () => {
          const res = await request(app)
            .post('/api/signup')
            .send(payload);
          expect(res.statusCode).toEqual(201);
          expect(res.body.message).toEqual('Signed up successfully!');
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
  describe('signup fails with invalid data', () => {
    Object.entries(mockINVALID_USERS).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        test(key, async () => {
          const res = await request(app)
            .post('/api/signup')
            .send(payload);
          expect(res.statusCode).toEqual(422);
          expect(res.body.message).toEqual(
            'Please provide a valid email address',
          );
        });
      });
    });
  });

  describe('signup fails with missing user data', () => {
    Object.entries(mockMISSING_USER_INFO).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        test(key, async () => {
          const res = await request(app)
            .post('/api/signup')
            .send(payload);
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toEqual('Please provide a valid email address');
        });
      });
    });
  });

  describe('signup fails with already signed up user', () => {
    Object.entries(mockVALID_USERS).forEach(testCase => {
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
  */
});

describe('login endpoint', () => {
  describe('should login the user', () => {
    Object.entries(mockLOGIN_VALID_USERS).forEach(testCase => {
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
          expect(res.body.message).toEqual('Logged in successfully!');
        });
      });
    });
  });

  describe('login fails with invalid password', () => {
    Object.entries(mockINCORRECT_LOGIN_PASSWORD).forEach(testCase => {
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
          payload.password += 'new';
          const res = await request(app)
            .post('/api/login')
            .send(payload);
          expect(res.statusCode).toEqual(401);
          expect(res.body.message).toEqual('Invalid Email or Password');
        });
      });
    });
  });
  /*
  describe('login fails with invalid data', () => {
    Object.entries(mockLOGIN_INVALID_USERS).forEach(testCase => {
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
*/
  describe('login fails with not signed up user', () => {
    Object.entries(mockLOGIN_VALID_USERS).forEach(testCase => {
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
    Object.entries(mockVALID_USERS).forEach(testCase => {
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

          const actual = await User.findOne({ email: payload.email });
          const isPasswordCorrect = await bcrypt.compare(
            payload.password,
            actual.password,
          );
          expect(isPasswordCorrect).toEqual(true);
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('You updated the password');
        });
      });
    });
  });

  describe('change password fails because the old password is incorrect', () => {
    Object.entries(mockINCORRECT_CHANGEPASSWORD_INFO).forEach(testCase => {
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
          payload.oldPassword += 'xyz';
          const res = await request(app)
            .post('/api/changePassword')
            .send(payload);
          expect(res.statusCode).toEqual(401);
          expect(res.body.message).toEqual('Old password is not correct');
        });
      });
    });
  });

  describe('change password fails with missing user email,password & oldPassword', () => {
    Object.entries(mockMISSING_CHANGEPASSWORD_INFO).forEach(testCase => {
      const [key, payload] = testCase;
      describe(key, () => {
        test(key, async () => {
          const res = await request(app)
            .post('/api/changePassword')
            .send(payload);
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toEqual('All fields are required');
        });
      });
    });
  });
});

describe('deleteUser endpoint', () => {
  describe('should delete the user account', () => {
    Object.entries(mockVALID_USERS).forEach(testCase => {
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
