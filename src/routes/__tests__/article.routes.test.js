import request from 'supertest';
import app from '../../app';
import Article from '../../models/article.model';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';

beforeAll(() => {
  return connectToDatabase();
});

afterEach(() => {
  return clearDatabase();
});

afterAll(() => {
  return closeDatabase();
});

jest.mock('../../middleware/verifyToken', () =>
  jest.fn((req, res, next) => {
    next();
  }),
);

jest.mock('../../middleware/authorization', () => ({
  checkCreateArticlePermission: jest.fn((req, res, next) => {
    next();
  }),
  checkDeleteArticlePermission: jest.fn((req, res, next) => {
    next();
  }),
}));

const articleData = {
  title: 'Test title',
  author: 'Test User',
  text: 'Lorem ipsum',
  violence_type: ['emotional'],
  url_to_image: '"https://www.google.com/',
  created_at: new Date(),
};

describe('Aricle endpoints', () => {
  test('should create a new article with POST request', async () => {
    await Article.create(articleData);
    const res = await request(app)
      .post('/api/articles')
      .send(articleData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('success');
  });
  test('should send the right error status code in case not all reqired fields are sent', async () => {
    const res = await request(app)
      .post('/api/articles')
      .send({});
    expect(res.statusCode).toEqual(400);
  });
  test('should get all articles as an array with GET request', async () => {
    await Article.create(articleData);
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
  });

  test('should get specific article with GET request to specific id', async () => {
    const article = await Article.create(articleData);
    let res = await request(app).get('/api/articles/' + article._id);
    expect(res.statusCode).toEqual(200);
  });

  test('should delete specific article with DELETE request to specific id', async () => {
    const article = await Article.create(articleData);
    let res = await request(app).delete('/api/articles/' + article._id);
    expect(res.statusCode).toEqual(202);
    expect(res.body.message).toEqual('Article was deleted!');
  });
});
