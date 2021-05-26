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
  articleCache,
  validateObjId,
} from '../middleware';

const router = express.Router();

router
  .route('/articles')
  .get(getArticles)
  .post(verifyToken, checkCreateArticlePermission, createArticle);

router
  .route('/articles/:id')
  .get(validateObjId('Article'), articleCache, getArticleById)
  .delete(
    verifyToken,
    checkDeleteArticlePermission,
    validateObjId('Article'),
    deleteArticle,
  );

export default router;
