import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
} from '../controllers';

const router = express.Router();

router.route('/articles').get(getArticles).post(createArticle);

router.route('/articles/:id').get(getArticleById).delete(deleteArticle);

export default router;
