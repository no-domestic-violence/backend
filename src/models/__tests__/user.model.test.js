import mongoose from 'mongoose';
import {
  mockUser,
  mockUserWithoutUsername,
  mockUserWithoutEmail,
  mockUserWithoutPassword,
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

describe('User', () => {
  let user;

  beforeEach(async () => {
    user = await User.create(mockUser);
  });

  test('can be created correctly', async () => {
    expect(user).toBeTruthy();
    expect(user.username).toBe(mockUser.username);
    expect(user.email).toBe(mockUser.email);
    expect(user.password).toBe(mockUser.password);
    expect(Array.isArray(user.contacts)).toBeTruthy();
    expect(user.role).toEqual('basic');
    expect(user._id).toBeTruthy();
  });
});

describe('User model', () => {
  test('should require username, email, and password', async () => {
    await expect(User.create(mockUserWithoutUsername)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(User.create(mockUserWithoutEmail)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(User.create(mockUserWithoutPassword)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
