import request from 'supertest';
import app from '../../app';
import { connectToDatabase, clearDatabase, closeDatabase } from '../../utils/database';
import Shelter from '../../models/shelter.model';

const sheltersData = [
  {
    place_name: 'Test name',
    address: 'Berlin, Turmstrasse, 0',
    contact_person: 'Test',
    phone: '+497777777777',
    longitude: 12.12,
    latitude: 13.13,
    description: 'Test description',
  },
  {
    place_name: 'Test name2',
    address: 'Berlin, Wicherstr, 10',
    contact_person: 'Test contact',
    phone: '+497777779999',
    longitude: 12.12,
    latitude: 13.13,
    description: 'Test description',
  },
];

beforeEach(async () => {
  const shelterTest1 = new Shelter(sheltersData[0]);
  const shelterTest2 = new Shelter(sheltersData[1]);
  await shelterTest1.save();
  await shelterTest2.save();
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
