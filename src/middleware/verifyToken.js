import jwt from 'jsonwebtoken';
import Error from './error/ErrorHandler';

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    next(Error.unauthorized('Access denied'));
    return;
  }
  try {
    const verified = jwt.verify(token, 'SECRET_KEY');
    req.user = verified;
    next();
  } catch (error) {
    next(Error.badRequest('Invalid token'));
  }
};

export default verifyToken;
