import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
} from '../controllers';
import {
  verifyAccessToken,
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
  articleCache,
  validateObjId,
} from '../middleware';

import {
  articleValidationRules,
  validateRequest,
} from '../middleware/validation/index';

const router = express.Router();

router
  .route('/articles')
  .get(getArticles)
  .post(
    verifyAccessToken,
    checkCreateArticlePermission,
    articleValidationRules,
    validateRequest,
    createArticle,
  );

router
  .route('/articles/:id')
  .get(validateObjId('Article'), articleCache, getArticleById)
  .delete(
    verifyAccessToken,
    checkDeleteArticlePermission,
    validateObjId('Article'),
    deleteArticle,
  );

export default router;
