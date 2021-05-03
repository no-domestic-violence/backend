import Error from '../middleware/error/ErrorHandler';

const validateUser = (user, errMessage, next) => {
  if (!user) {
    next(Error.notFound(errMessage));
    return;
  }
  return user;
};

// check if id is valid ObjectId - to resolve mongoose castError
const validateObjId = (id, item, next) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    next(Error.notFound(`${item} does not exist`));
  } else {
    return;
  }
};

export { validateUser, validateObjId };
