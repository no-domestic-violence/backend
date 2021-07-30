import jwt from 'jsonwebtoken';
import Error from './error/ErrorHandler';

const verifyAccessToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    next(Error.forbidden('No access token provided'));
    return;
  }
  try {
    const bearer = bearerHeader.split(' ')[1];
    const verified = jwt.verify(bearer, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(Error.forbidden('Access token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(Error.forbidden('Invalid token'));
    } else {
      next(Error.internal('Something went wrong'));
    }
  }
};

export default verifyAccessToken;
