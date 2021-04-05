import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from './src/utils/database';

beforeAll(() => {
  return connectToDatabase();
});

afterEach(() => {
  return clearDatabase();
});

afterAll(() => {
  return closeDatabase();
});

jest.setTimeout(30000);
