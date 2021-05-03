import Error from '../middleware/error/ErrorHandler';

const validateUser = (user, errMessage, next) => {
  if (!user) {
    next(Error.notFound(errMessage));
    return;
  }
  return user;
};

export { validateUser };
