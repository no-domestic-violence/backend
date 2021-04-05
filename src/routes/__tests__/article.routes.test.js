import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import {
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
} from '../../middleware/authorization';
import verifyToken from '../../middleware/verifyToken';
import Article from '../../models/article.model';
import { connectTestDb, closeTestDb, clearTestDb } from '../../test-setup/db-handler';

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

beforeAll(async() => await connectTestDb());

afterEach(async() => await clearTestDb());

afterAll(async() => await closeTestDb());


describe('Aricle endpoints', () => {
  // beforeEach(async done => {
  //   await mongoose.connect(
  //     'mongodb://localhost:27017/test-db',
  //     { useNewUrlParser: true },
  //     () => done(),
  //   );
  // });

  // afterEach(async done => {
  //   await mongoose.connection.db.dropDatabase(() => {
  //     mongoose.connection.close(() => done());
  //   });
  // });

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
