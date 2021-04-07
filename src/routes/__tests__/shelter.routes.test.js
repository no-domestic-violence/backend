import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { connectToDatabase, closeDatabase } from '../../utils/database';

beforeAll(() => {
  return connectToDatabase();
});

afterAll(() => {
  return closeDatabase();
});

describe('Hotlines endpoints', () => {
  test('should get all shelters as array with GET request', async () => {
    const res = await request(app).get('/api/shelters');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.type).toEqual('application/json');
  });
});
