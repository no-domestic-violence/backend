import express from 'express';
import { signupValidation, loginValidation } from '../utils/authentication';
import {
  verifyAccessToken,
  validationErrors,
  requireAllfields,
  requireCredentials,
} from '../middleware';
// eslint-disable-next-line object-curly-newline
import {
  signup,
  login,
  changePassword,
  deleteUser,
  verifyRefreshToken,
  logout,
} from '../controllers';

import {
  GeneralRouteRateLimit,
  loginEmailRouteRateLimit,
  loginIpRouteRateLimit,
  loginIpEmailRouteRateLimit,
} from '../controllers/rateLimitControllers';

const router = express.Router();

router
  .route('/signup')
  .post(
    GeneralRouteRateLimit('signup'),
    signupValidation,
    requireAllfields,
    validationErrors,
    signup,
  );
router
  .route('/login')
  .post(
    GeneralRouteRateLimit('login'),
    loginEmailRouteRateLimit,
    loginIpRouteRateLimit,
    loginIpEmailRouteRateLimit,
    loginValidation,
    validationErrors,
    login,
  );
router.route('/logout').post(logout);
router.route('/refreshToken').post(verifyRefreshToken);
router
  .route('/changePassword')
  .post(verifyAccessToken, requireCredentials, changePassword);
router.route('/deleteUser').delete(verifyAccessToken, deleteUser);

export default router;
