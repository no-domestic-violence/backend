import request from 'supertest';
import app from '../../app';
import {
  connectToDatabase,
  clearDatabase,
  closeDatabase,
} from '../../utils/database';
import Video from '../../models/video.model';
import { mockVideos } from '../../models/__mocks__/video';

jest.mock('multer', () => {
  const multer = () => ({
    single: () => {
      return (req, res, next) => {
        req.body = {
          title: 'test title',
          url_to_video: 'www.youtube.com',
          imageData: '1615747990888video1.png',
        };
        req.file = {
          filename: '1615747990888video1',
          mimetype: 'png',
          path: '/assets/images/1615747990888video1.png',
          buffer: Buffer.from('imageData'),
        };
        return next();
      };
    },
  });
  multer.memoryStorage = () => jest.fn();
  multer.diskStorage = () => jest.fn();
  return multer;
});

beforeAll(() => {
  return connectToDatabase();
});

beforeEach(async () => {
  await Video.create(mockVideos[0]);
  await Video.create(mockVideos[1]);
  await Video.create(mockVideos[2]);
});

afterEach(() => {
  return clearDatabase();
});

afterAll(() => {
  return closeDatabase();
});

describe('Videos endpoint', () => {
  test('should create a new videos with POST request', async () => {
    const res = await request(app)
      .post('/api/videos')
      .set('Content-type', 'multipart/form-data');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('success');
  });
  test('should get all videos as array with GET request', async () => {
    const res = await request(app).get('/api/videos');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body).toHaveLength(3);
    expect(res.type).toEqual('application/json');
  });
});
