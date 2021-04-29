import express from 'express';
import { signupValidation, loginValidation } from '../utils/authentication';

import {
  signup,
  login,
  changePassword,
  deleteUser,
  requireAllfields,
  validationErrors,
  // eslint-disable-next-line import/named
  requireCredentials,
} from '../controllers';

const router = express.Router();

router
  .route('/signup')
  .post(signupValidation, requireAllfields, validationErrors, signup);
router.route('/login').post(loginValidation, validationErrors, login);
router.route('/changePassword').post(requireCredentials, changePassword);
router.route('/deleteUser').delete(deleteUser);

export default router;
