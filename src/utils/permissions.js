/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
import { ROLE } from '../constants';

const { BASIC, EDITOR, ADMIN } = ROLE;

export const hasDeleteArticlePermission = (user, authorId) => {
  return user.role === ADMIN || user._id === authorId.toString();
};

// remove permission from basic when admin,editor assign is implemented
export const hasCreateArticlePermission = (user) => {
  return (
    user.role === BASIC
    || user.role === ADMIN
    || user.role === EDITOR
  );
};

export const hasEditArticlePermission = (user, authorId) => {
  return user._id === authorId.toString();
};
