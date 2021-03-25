import { canDeleteArticle } from '../permissions/article.permissions';

const authDeleteArticle = (req, res, next) => {
  if (!canDeleteArticle(req.user, req.article)) {
    return res.status(401).json({ message: 'Not allowed' });
  }
  next();
};

export default authDeleteArticle;
