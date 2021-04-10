import mongoose from 'mongoose';
import articles from '../../models/article.model'

describe('articles schema has all required fields', () => {
    test('should have title', () => {
      const {title} = articles.schema.obj;
      expect(title).toEqual({
        type: String,
        required: true,
      });
    }); 
  
    test('should have author', () => {
      const { author } = articles.schema.obj;
      expect(author).toEqual({
        type: String,
        required: true,
      });
    });
  
    test('should have text', () => {
      const { text } = articles.schema.obj;
      expect(text).toEqual({ 
        type: String,
        required: true,
      });
    });
  
    test('should have url_to_image', () => {
      const { url_to_image } = articles.schema.obj;
      expect(url_to_image).toEqual({
        type: String,
        required: true
      });
    });
    test('should have violence_type', () => {
      const { violence_type } = articles.schema.obj;
      expect(violence_type).toEqual({ 
        type: [String],
        required: true
      });
    });
    test('should have created_at', () => {
      const { created_at } = articles.schema.obj;
      expect(created_at).toEqual({
        type: Date,
        required: true
      });
    });
    test('should have author_id', () => {
      const { author_id } = articles.schema.obj;
      expect (author_id).toEqual({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      });
    });
});
