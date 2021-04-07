import Article from '../models/article.model';
import Error from '../middleware/error/ErrorHandler';
import redisClient from '../utils/redisClient';

export const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({});
    res.status(200).send(articles);
  } catch (e) {
    next(e);
  }
};

export const getArticleById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const articleData = await Article.findById(id);
    redisClient.setex(id, 3600, JSON.stringify(articleData));
    res.status(200).send(articleData);
  } catch (e) {
    next(Error.notFound('Article not found.'));
  }
};

export const createArticle = async (req, res, next) => {
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    text: req.body.text,
    violence_type: req.body.violence_type,
    url_to_image: req.body.url_to_image,
    created_at: new Date(),
    author_id: req.body.author_id,
  });
  try {
    const {
      title, author, text, violence_type, url_to_image,
    } = req.body;
    if (!title || !author || !text || !violence_type || !url_to_image) {
      next(
        Error.badRequest('All the fields are required and must be non blank!'),
      );
      return;
    }
    await article.save();
    res.status(201).json({ success: true, data: article });
  } catch (e) {
    next(e);
  }
};

export const deleteArticle = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Article.findOneAndDelete({ _id: id });
    return res.status(202).json({ message: 'Article was deleted!' });
  } catch (e) {
    next(e);
  }
};
