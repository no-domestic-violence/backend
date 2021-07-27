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
router
  .route('/changePassword')
  .post(verifyToken, requireCredentials, changePassword);
router.route('/deleteUser').delete(deleteUser);
router.route('/refreshToken').post(verifyToken, refreshUserToken);

export default router;
