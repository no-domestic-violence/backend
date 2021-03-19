import express from 'express';
import { createVideo, getVideos } from '../controllers';
import { upload } from '../middleware/multer';

const router = express.Router();
router
  .route('/videos')
  .post(upload.single('imageData'), createVideo)
  .get(getVideos);

export default router;
