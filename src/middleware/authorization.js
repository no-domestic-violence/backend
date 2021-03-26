import {
  hasCreateArticlePermission,
  hasDeleteArticlePermission,
} from '../utils/permissions';

const checkCreateArticlePermission = (req, res, next) => {
  if (!hasCreateArticlePermission(req.user)) {
    return res.status(401).json({ message: 'Not allowed' });
  }
  next();
};

const checkDeleteArticlePermission = (req, res, next) => {
  if (!hasDeleteArticlePermission(req.user, req.body.author_id)) {
    return res.status(401).json({ message: 'Not allowed' });
  }
  next();
};

export { checkCreateArticlePermission, checkDeleteArticlePermission };
