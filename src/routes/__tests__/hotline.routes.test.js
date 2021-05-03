import request from 'supertest';
import app from '../../app';
import Hotline from '../../models/hotline.model';
import {
  connectToDatabase,
  clearDatabase,
  closeDatabase,
} from '../../utils/database';

import { mockHotline } from '../../models/__mocks__/hotline';

beforeEach(async () => {
  await Hotline.create(mockHotline);
});
beforeAll(() => {
  return connectToDatabase();
});

afterEach(() => {
  return clearDatabase();
});

afterAll(() => {
  return closeDatabase();
});

describe('Shelter endpoints', () => {
  test('should get shelters by search param as array with GET request', async () => {
    const testQuery = 'Berlin';

    const res = await request(app).get(`/api/hotlines?searchTerm=${testQuery}`);
    expect(Array.isArray(res.body.hotlines)).toBeTruthy();
    expect(res.statusCode).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.hotlines[0].city).toContain(testQuery);
  });
  test('should get empty array if there is no match for search param', async () => {
    const testQuery = 'Center';
    const res = await request(app).get(`/api/hotlines?searchTerm=${testQuery}`);
    expect(Array.isArray(res.body.hotlines)).toBeTruthy();
    expect(res.statusCode).toEqual(200);
    expect(res.body.hotlines).toEqual([]);
  });
});
