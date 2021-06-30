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

const contactValidationRules = [
  check('name')
    .notEmpty()
    .matches('^[A-Za-z0-9 ]+$')
    .withMessage('Invalid name format'),
  check('name')
    .isLength({ min: 1, max: 16 })
    .withMessage('Name must be between 1 and 16 characters'),
  check('message')
    .matches(/^[a-z\d\-_.!@#\s]+$/i)
    .withMessage('Invalid message format'),
  check('message')
    .isLength({ min: 1, max: 25 })
    .withMessage('Message must be between 1 and 25 characters'),
  check('phone')
    .matches(/(\(?([\d \-\)\–\+\/\(]+){6,}\)?([ .\-–\/]?)([\d]+))/) // eslint-disable-line
    .withMessage('Invalid phone number format'),
  check('phone')
    .isLength({ max: 15 })
    .withMessage('Phone number should be max 15 digits'),
];

const validateRequest = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const firstErrorMsg = result.errors[0].msg;
    next(Error.badRequest(firstErrorMsg));
    return;
  }
  next();
};

export {
  articleValidationRules,
  videoValidationRules,
  contactValidationRules,
  validateRequest,
};
