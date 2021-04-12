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
    return user.save();
  });

  test('can be created correctly', async () => {
    expect(user).toBeTruthy();
    expect(user.username).toBe(normalUser.username);
  });

  test('should have basic role as default', async () => {
    const { role } = user;
    expect(role).toEqual('basic');
  });

  test('should contain mongoDB _id field', async () => {
    const { _id } = user;
    expect(_id).toBeTruthy();
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
