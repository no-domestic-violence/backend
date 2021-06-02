import { check, validationResult } from 'express-validator';
import Error from '../error/ErrorHandler';

const articleValidationRules = [
  check('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Article title must be between 1 and 100 characters'),
  check('author')
    .isLength({ min: 1, max: 20 })
    .withMessage('Author must be between 1 and 20 characters'),
  check('text')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Article must be between 1 and 10000 characters'),
  check('url_to_image')
    .notEmpty()
    .matches(
      '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
    )
    .withMessage('Provide url to image'),
  check('created_at').notEmpty(),
  check('author_id').notEmpty(),
];

const videoValidationRules = [
  check('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Video title must be between 1 and 100 characters'),
  check('url_to_video')
    .notEmpty()
    .matches(
      '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
    )
    .withMessage('Provide correct url to video'),
];

const validateRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push(err.msg));
  next(Error.badRequest(extractedErrors[0]));
};

export { articleValidationRules, videoValidationRules, validateRequest };
