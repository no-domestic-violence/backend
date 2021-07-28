import express from 'express';
import { signupValidation, loginValidation } from '../utils/authentication';
// import {
//   validationErrors,
//   requireAllfields,
//   requireCredentials,
// } from '../middleware/authMiddlewares';
import { verifyAccessToken, validationErrors,
  requireAllfields,
  requireCredentials, } from '../middleware'
// eslint-disable-next-line object-curly-newline
import { signup, login, changePassword, deleteUser, verifyRefreshToken, logout } from '../controllers';

const router = express.Router();

router
  .route('/signup')
  .post(signupValidation, requireAllfields, validationErrors, signup);
router.route('/login').post(loginValidation, validationErrors, login);
router.route('/logout').post(logout);
router.route('/refreshToken').post(verifyRefreshToken);
router.route('/changePassword').post(verifyAccessToken, requireCredentials, changePassword);
router.route('/deleteUser').delete(verifyAccessToken, deleteUser);

export default router;
