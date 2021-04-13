import mongoose from 'mongoose';
import {
  normalUser,
  userWithoutUsername,
  userWithoutEmail,
  userWithoutPassword,
} from '../__mocks__/user';
import User from '../user.model';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';

beforeAll(() => {
  connectToDatabase();
});

afterEach(() => {
  clearDatabase();
});

afterAll(() => {
  closeDatabase();
});

describe('Normal user', () => {
  let user;

  beforeEach(async () => {
    user = await User.create(normalUser);
  });

  test('can be created correctly', async () => {
    expect(user).toBeTruthy();
    expect(user.username).toBe(normalUser.username);
    expect(user.email).toBe(normalUser.email);
    expect(user.password).toBe(normalUser.password);
    expect(Array.isArray(user.contacts)).toBeTruthy();
    expect(user.role).toEqual('basic');
    expect(user._id).toBeTruthy();
  });
});

describe('User model', () => {
  test('should require username, email, and password', async () => {
    await expect(User.create(userWithoutUsername)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(User.create(userWithoutEmail)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(User.create(userWithoutPassword)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
