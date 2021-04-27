import request from 'supertest';
import app from '../../app';
import { connectToDatabase, clearDatabase, closeDatabase } from '../../utils/database';
import Shelter from '../../models/shelter.model';
import {  mockShelters } from '../../models/__mocks__/shelter';


beforeEach(async () => {
  await Shelter.create(mockShelters[0]);
  await Shelter.create(mockShelters[1]);
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

describe('Shelters endpoint', () => {
  test('should get all shelters as array with GET request', async () => {
    const res = await request(app).get('/api/shelters');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect((res.body)).toHaveLength(2)
    expect(res.type).toEqual('application/json');
  });
});
