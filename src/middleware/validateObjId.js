import Error from './error/ErrorHandler';

// check if id is valid ObjectId - to resolve mongoose castError
const validateObjId = (item) => (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    next(Error.notFound(`${item} does not exist`));
  }
  next();
};

export default validateObjId;
