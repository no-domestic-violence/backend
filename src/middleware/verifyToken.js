import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied');
  try {
    const verified = jwt.verify(token, 'SECRET_KEY');
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).send('Invalid token');
  }
};

export default verifyToken;
