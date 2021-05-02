import { validationResult } from 'express-validator';
import Error from './error/ErrorHandler';

const validationErrors = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      Error.unprocessableEntity('Please provide a valid username or password'),
    );
  } else {
    next();
  }
};

const requireAllfields = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    next(Error.badRequest('All fields are required'));
  } else {
    next();
  }
};

const requireCredentials = async (req, res, next) => {
  const { email, oldPassword, password } = req.body;
  if (!email || !oldPassword || !password) {
    next(Error.badRequest('All fields are required'));
  } else {
    next();
  }
};
export { validationErrors, requireAllfields, requireCredentials };
