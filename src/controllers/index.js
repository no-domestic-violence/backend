/* eslint-disable object-curly-newline */
import { searchHotline } from './hotline.controllers';
import { getShelters } from './shelter.controllers';

import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
} from './article.controllers';

import { createVideo, getVideos } from './video.controllers';

import {
  editContact,
  getContact,
  addContact,
  deleteContact,
} from './user.controllers';

import { signup, login, changePassword, deleteUser, logout, verifyRefreshToken } from './auth.controllers';

export {
  searchHotline,
  getShelters,
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
  editContact,
  getContact,
  addContact,
  deleteContact,
  getVideos,
  createVideo,
  signup,
  login,
  changePassword,
  deleteUser,
  logout,
  verifyRefreshToken
};
