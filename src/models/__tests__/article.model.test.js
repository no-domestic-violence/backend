import mongoose from 'mongoose';
import {
  normalArticle,
  articleWithoutTitle,
  articleWithoutAuthor,
  articleWithoutText,
  articleWithoutViolenceType,
  articleWithoutUrlToImage,
  articleWithoutCreatedAt
} from '../__mocks__/article';
import articles from '../article.model';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';

beforeAll(() => {
  connectToDatabase();
});

afterEach(() => {
  clearDatabase();
});

afterAll(() => {
  closeDatabase();
});

describe('Normal article', () => {
  let article;

  beforeEach(async () => {
    article = await articles.create(normalArticle);
  });

  test('can be created correctly', async () => {
    expect(article).toBeTruthy();
    expect(article.title).toBe(normalArticle.title);
    expect(article.author).toBe(normalArticle.author);
    expect(article.text).toBe(normalArticle.text);
    expect(article.url_to_image).toBe(normalArticle.url_to_image);
    expect(article.violence_type).toContainEqual('emotional');
    expect(Array.isArray(article.violence_type)).toBeTruthy();
  });
});

describe('articles model', () => {
  test('should require title, author, text, url_to_image, violence_type and created_at ', async () => {
    await expect(articles.create(articleWithoutTitle)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(articleWithoutAuthor)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(articleWithoutText)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(articleWithoutViolenceType)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(articleWithoutUrlToImage)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(articleWithoutCreatedAt)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
