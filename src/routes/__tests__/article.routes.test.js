import request from 'supertest';
import app from '../../app';
import Article from '../../models/article.model';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';
import {
  verifyToken,
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
} from '../../middleware';

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
    expect(res.body.data.title).toBe(articleData.title);
    expect(res.body.data.author).toBe(articleData.author);
    expect(res.body.data.text).toBe(articleData.text);
    expect(res.body.data.url_to_image).toBe(articleData.url_to_image);
  });
  test('should call checkCreateArticlePermission middleware with POST request', async () => {
    await Article.create(articleData);
    await request(app)
      .post('/api/articles')
      .send(articleData);
    expect(checkCreateArticlePermission).toBeCalledTimes(1);
    expect(verifyToken).toBeCalledTimes(1);
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

  test('should respond with not found error when the article does not exists', async () => {
    const id = '1223';
    let res = await request(app).get('/api/articles/' + id);
    expect(res.statusCode).toEqual(404);
  });

  test('should delete specific article with DELETE request to specific id', async () => {
    const article = await Article.create(articleData);
    let res = await request(app).delete('/api/articles/' + article._id);
    expect(res.statusCode).toEqual(202);
    expect(res.body.message).toEqual('Article was deleted!');
  });
  test('should respond with an error when id is wrong', async () => {
    const id = '1223';
    let res = await request(app).delete('/api/articles/' + id);
    expect(res.statusCode).toEqual(404);
  });
  test('should call verifyToken and checkDeleteArticlePermission middleware with DELETE request', async () => {
    const article = await Article.create(articleData);
    await request(app).delete('/api/articles/' + article._id);
    expect(checkDeleteArticlePermission).toBeCalledTimes(1);
    expect(verifyToken).toBeCalledTimes(1);
  });
});
