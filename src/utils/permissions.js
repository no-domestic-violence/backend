/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
import { ROLE } from '../constants';

const { EDITOR, ADMIN } = ROLE;

export const hasDeleteArticlePermission = (user, authorId) => {
  return user.role === ADMIN || user._id === authorId.toString();
};

// remove permission from basic when admin,editor assign is implemented
export const hasCreateArticlePermission = user => {
<<<<<<< HEAD
  return user.role === ADMIN || user.role === EDITOR;
=======
  return user.role === BASIC || user.role === EDITOR || user.role === ADMIN;
>>>>>>> master
};

export const hasEditArticlePermission = (user, authorId) => {
  return user._id === authorId.toString();
};
// use it when admin role created
export const hasDeleteVideoPermission = user => {
  return user.role === ADMIN;
};

export const hasCreateEditVideoPermission = user => {
  return user.role === BASIC || user.role === ADMIN;
};
