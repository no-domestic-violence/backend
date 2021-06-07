import Error from '../middleware/error/ErrorHandler';

const validateUser = (user, errMessage, next) => {
  if (!user) {
    next(Error.notFound(errMessage));
    return;
  }
  next();
};

export default validateUser;
