import express from 'express';
import { getArticles, getArticleById, createArticle } from '../controllers';

const router = express.Router();

router.route('/articles').get(getArticles).post(createArticle);

router.get('/articles/:id', getArticleById);

export default router;
