import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import connectToDatabase from '../../utils/database';

describe('Hotlines endpoints', () => {
  // TODO: is mocking DB here needed?
  beforeEach(async () => {
    await connectToDatabase();
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });
  test('should get all shelters as array with GET request', async () => {
    const res = await request(app).get('/api/shelters');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.type).toEqual('application/json');
  });
});
