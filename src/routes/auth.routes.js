import express from 'express';
import { signupValidation, loginValidation } from '../utils/authentication';
import {
  validationErrors,
  requireAllfields,
  requireCredentials,
} from '../middleware/authMiddlewares';

// eslint-disable-next-line object-curly-newline
import {
  signup,
  login,
  changePassword,
  deleteUser,
  refreshUserToken,
} from '../controllers';
import { verifyToken } from '../middleware';

const router = express.Router();

router
  .route('/signup')
  .post(signupValidation, requireAllfields, validationErrors, signup);
router.route('/login').post(loginValidation, validationErrors, login);
router
  .route('/changePassword')
  .post(verifyToken, requireCredentials, changePassword);
router.route('/deleteUser').delete(deleteUser);
router.route('/refreshToken').post(verifyToken, refreshUserToken);

export default router;
