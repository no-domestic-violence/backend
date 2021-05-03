import Error from './error/ErrorHandler';

const requireAllContactFields = async (req, res, next) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    next(
      Error.badRequest('All the fields are required and must be non blank!'),
    );
  }
  next();
};

export default requireAllContactFields;
