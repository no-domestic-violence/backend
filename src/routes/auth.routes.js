import express from 'express';
import { signupValidation, loginValidation } from '../utils/authentication';
import {
  validationErrors,
  requireAllfields,
  requireCredentials,
} from '../middleware/authMiddlewares';

// eslint-disable-next-line object-curly-newline
import { signup, login, changePassword, deleteUser } from '../controllers';

const router = express.Router();

router
  .route('/signup')
  .post(signupValidation, requireAllfields, validationErrors, signup);
router.route('/login').post(loginValidation, validationErrors, login);
router.route('/changePassword').post(requireCredentials, changePassword);
router.route('/deleteUser').delete(deleteUser);

export default router;
