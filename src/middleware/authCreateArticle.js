import { canCreateArticle } from '../permissions/article.permissions';

const authCreateArticle = (req, res, next) => {
  if (!canCreateArticle(req.user)) {
    return res.status(401).json({ message: 'Not allowed' });
  }
  next();
};

export default authCreateArticle;
