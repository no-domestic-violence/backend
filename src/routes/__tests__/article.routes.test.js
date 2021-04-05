import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import {
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
} from '../../middleware/authorization';
import verifyToken from '../../middleware/verifyToken';
import Article from '../../models/article.model';

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
  id: '603e9b3325d3c5c9c205c903',
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
    expect(verifyToken).toHaveBeenCalled();
    expect(checkCreateArticlePermission).toHaveBeenCalled();
  });
  test('should get all articles as an array with GET request', async () => {
    await Article.create(articleData);
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('should get specific article with GET request to specific id', async () => {
    const article = await Article.create(articleData);
    let res = await request(app).get('/api/articles/' + article.id);
    expect(res.statusCode).toEqual(200);
  });

  test('should delete specific article with DELETE request to specific id', async () => {
    const article = await Article.create(articleData);
    let res = await request(app).delete('/api/articles/' + article.id);
    expect(res.statusCode).toEqual(202);
    expect(res.body.message).toEqual('Article was deleted!');
    expect(verifyToken).toHaveBeenCalled();
    expect(checkDeleteArticlePermission).toHaveBeenCalled();
  });
});
