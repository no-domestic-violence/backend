import { signupValidation, loginValidation } from '../utils/authentication';

import express from 'express';
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
router.delete('/deleteUser').delete(deleteUser);

export default router;
