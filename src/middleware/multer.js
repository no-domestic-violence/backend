import multer from 'multer';

export const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './src/assets/images');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

export const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});
