import express from 'express';
import { getArticles, getArticleById } from '../controllers';

const router = express.Router();

router.get('/articles', getArticles);

router.get('/articles/:id', getArticleById);

export default router;
