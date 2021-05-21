import verifyToken from './verifyToken';
import multer from './multer';
import {
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
} from './authorization';
import { articleCache, hotlinesCache } from './cache';
import {
  validationErrors,
  requireAllfields,
  requireCredentials,
} from './authMiddlewares';
import requireAllContactFields from './requireAllContactFields';
import {
  contactValidationErrors,
  validateContactFields,
} from './contactFieldsValidation';

export {
  verifyToken,
  multer,
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
  articleCache,
  hotlinesCache,
  validationErrors,
  requireAllfields,
  requireCredentials,
  requireAllContactFields,
  validateContactFields,
  contactValidationErrors,
};
