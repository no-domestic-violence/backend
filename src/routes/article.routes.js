import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
} from '../controllers';
import {
  verifyToken,
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
} from '../middleware';

const router = express.Router();

router
  .route('/articles')
  .get(getArticles)
  .post(verifyToken, checkCreateArticlePermission, createArticle);

router
  .route('/articles/:id')
  .get(getArticleById)
  .delete(verifyToken, checkDeleteArticlePermission, deleteArticle);

export default router;
