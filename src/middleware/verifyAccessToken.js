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
    next(Error.unauthorized('Invalid token'));
  }
};

export default verifyAccessToken;