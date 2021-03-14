import express from 'express';

import Video from '../models/video.model';
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/assets/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const router = express.Router();
router.route('/videos').post(upload.single('imageData'), (req, res, next) => {
  console.log(req);
  const newVideo = new Video({
    title: req.body.title,
    url_to_video: req.body.url_to_video,
    imageData: req.file.filename,
  });

  newVideo
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        success: true,
        document: result,
      });
    })
    .catch((err) => next(err));
});
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).send(videos);
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
});

export default router;
