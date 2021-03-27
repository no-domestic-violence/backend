/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
import { ROLE } from '../constants';

export const hasDeleteArticlePermission = (user, authorId) => {
  return user.role === ROLE.ADMIN || user._id === authorId.toString();
};

// remove permission from basic when admin,editor assign is implemented
export const hasCreateArticlePermission = (user) => {
  return (
    user.role === ROLE.BASIC
    || user.role === ROLE.ADMIN
    || user.role === ROLE.EDITOR
  );
};

export const hasEditArticlePermission = (user, authorId) => {
  return user._id === authorId.toString();
};
