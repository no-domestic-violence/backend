import mongoose from 'mongoose';
import {
  mockDefaultArticle,
  mockArticleWithoutTitle,
  mockArticleWithoutAuthor,
  mockArticleWithoutText,
  mockArticleWithoutViolenceType,
  mockArticleWithoutUrlToImage,
  mockArticleWithoutCreatedAt
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

describe('Default article', () => {
  let article;

  beforeEach(async () => {
    article = await articles.create(mockDefaultArticle);
  });

  test('can be created correctly', async () => {
    expect(article).toBeTruthy();
    expect(article.title).toBe(mockDefaultArticle.title);
    expect(article.author).toBe(mockDefaultArticle.author);
    expect(article.text).toBe(mockDefaultArticle.text);
    expect(article.url_to_image).toBe(mockDefaultArticle.url_to_image);
    expect(article.violence_type).toContainEqual('emotional');
    expect(Array.isArray(mockDefaultArticle.violence_type)).toBeTruthy();
  });
});

describe('articles model', () => {
  test('should require title, author, text, url_to_image, violence_type and created_at ', async () => {
    await expect(articles.create(mockArticleWithoutTitle)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(mockArticleWithoutAuthor)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(mockArticleWithoutText)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(mockArticleWithoutViolenceType)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(mockArticleWithoutUrlToImage)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(articles.create(mockArticleWithoutCreatedAt)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
