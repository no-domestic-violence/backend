import express from 'express';
import { createVideo, getVideos } from '../controllers';
import { upload } from '../middleware/multer';
import {
  videoValidationRules,
  validateRequest,
} from '../middleware/validation/index';

const router = express.Router();
router
  .route('/videos')
  .post(
    upload.single('imageData'),
    videoValidationRules,
    validateRequest,
    createVideo,
  )
  .get(getVideos);

export default router;
