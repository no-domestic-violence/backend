import express from 'express';
import { signupValidation, loginValidation } from '../utils/authentication';

import {
  signup,
  login,
  changePassword,
  deleteUser,
} from '../controllers';

const router = express.Router();

router.route('/signup').post(signupValidation, signup);
router.route('/login').post(loginValidation, login);
router.route('/changePassword').post(changePassword);
router.route('/deleteUser').delete(deleteUser);

export default router;
