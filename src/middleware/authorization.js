import {
  hasCreateArticlePermission,
  hasDeleteArticlePermission,
} from '../utils/permissions';
import Error from './error/ErrorHandler';

const checkCreateArticlePermission = (req, res, next) => {
  if (!hasCreateArticlePermission(req.user)) {
    next(Error.unauthorized('Not allowed.'));
  }
  next();
};

const checkDeleteArticlePermission = (req, res, next) => {
  if (!hasDeleteArticlePermission(req.user, req.body.author_id)) {
    next(Error.unauthorized('Not allowed.'));
  }
  next();
};

export { checkCreateArticlePermission, checkDeleteArticlePermission };
