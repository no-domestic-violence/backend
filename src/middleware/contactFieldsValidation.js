import { validationResult, check } from 'express-validator';
import Error from './error/ErrorHandler';

const validateContactFields = [
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
    .matches(/(\(?([\d \-\)\–\+\/\(]+){6,}\)?([ .\-–\/]?)([\d]+))/)
    .withMessage('Invalid phone number format'),
  check('phone')
    .isLength({ min: 7, max: 15 })
    .withMessage('Phone number should be between 7 and 15 digits'),
];

const contactValidationErrors = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const firstErrorMsg = result.errors[0].msg;
    next(Error.badRequest(firstErrorMsg));
    return;
  }
  next();
};

export { contactValidationErrors, validateContactFields };
