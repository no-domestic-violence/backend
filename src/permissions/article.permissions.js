/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
import { ROLE } from '../constants';

export const canDeleteArticle = (user, article) => {
  return user.role === ROLE.ADMIN || user._id === article.user_id.toString();
};

export const canCreateArticle = (user) => {
  return user.role === ROLE.ADMIN || user.role === ROLE.EDITOR;
};
