import jwt from 'jsonwebtoken';
import Error from './error/ErrorHandler';

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    next(Error.unauthorized('No access token provided'));
    return;
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    next(Error.unauthorized('Invalid token'));
  }
};

export default verifyToken;
