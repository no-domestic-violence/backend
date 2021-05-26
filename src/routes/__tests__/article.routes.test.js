import request from 'supertest';
import app from '../../app';
import Article from '../../models/article.model';
import { mockDefaultArticle } from '../../models/__mocks__/article';
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

describe('Aricle endpoints', () => {
  test('should create a new article with POST request', async () => {
    const createdMockArticle = await Article.create(mockDefaultArticle);
    const res = await request(app)
      .post('/api/articles')
      .send(mockDefaultArticle);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('article');
    expect(res.body).toHaveProperty('success');
    expect(res.body.article.title).toBe(createdMockArticle.title);
    expect(res.body.article.author).toBe(createdMockArticle.author);
    expect(res.body.article.text).toBe(createdMockArticle.text);
    expect(res.body.article.url_to_image).toBe(createdMockArticle.url_to_image);
  });
  test('should call checkCreateArticlePermission middleware with POST', async () => {
    await request(app)
      .post('/api/articles')
      .send(mockDefaultArticle);
    expect(checkCreateArticlePermission).toBeCalledTimes(1);
    expect(verifyToken).toBeCalledTimes(1);
  });
  test('should send the right error status code in case not all reqired fields are sent with POST', async () => {
    const res = await request(app)
      .post('/api/articles')
      .send({});
    expect(res.statusCode).toEqual(400);
  });
  test('should get all articles as an array with GET', async () => {
    await Article.create(mockDefaultArticle);
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.articles)).toBeTruthy();
    expect(res.body.articles.length).toBe(1);
  });

  test('should get specific article with GET request to specific id', async () => {
    const createdMockArticle = await Article.create(mockDefaultArticle);
    let res = await request(app).get('/api/articles/' + createdMockArticle._id);
    expect(res.statusCode).toEqual(200);
    expect(res.body.article).toMatchObject({
      title: 'Test title',
      author: 'Test User',
      text: 'Lorem ipsum',
      violence_type: ['emotional'],
      url_to_image: 'https://www.google.com/',
    });
  });

  test('should respond with an error when objectId of article is wrong with GET', async () => {
    const invalidFormatId = '6062e6501e80a94test40522';
    let res = await request(app).get(`/api/articles/${invalidFormatId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Article does not exist');
  });

  test('should delete specific article with DELETE request to specific id', async () => {
    const createdMockArticle = await Article.create(mockDefaultArticle);
    let res = await request(app).delete(
      '/api/articles/' + createdMockArticle._id,
    );
    expect(res.statusCode).toEqual(202);
    expect(res.body.message).toEqual('Article was deleted!');
  });

  test('should respond with not found error when objectId format is wrong with DELETE request', async () => {
    const invalidFormatId = '6062e6501e80a94test40522';
    let res = await request(app).delete(`/api/articles/${invalidFormatId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Article does not exist');
  });

  test('should respond with No Content error when cannot find the id with DELETE request', async () => {
    const validFormatId = '6062e6501e80a94123440522';
    let res = await request(app).delete(`/api/articles/${validFormatId}`);
    expect(res.statusCode).toEqual(204);
  });
  test('should call verifyToken and checkDeleteArticlePermission middlewares with DELETE request', async () => {
    const createdMockArticle = await Article.create(mockDefaultArticle);
    await request(app).delete('/api/articles/' + createdMockArticle._id);
    expect(checkDeleteArticlePermission).toBeCalledTimes(1);
    expect(verifyToken).toBeCalledTimes(1);
  });
});
