import Video from '../models/video.model';
import Error from '../middleware/error/ErrorHandler';

export const createVideo = async (req, res, next) => {
  try {
    const newVideo = new Video({
      title: req.body.title,
      url_to_video: req.body.url_to_video,
      imageData: req.file.filename,
    });
    const { title, url_to_video } = req.body;
    if (!title || !url_to_video ) {
      next(
        Error.badRequest('All the fields are required and must be non blank!'),
      );
      return;
    }
    const result = await newVideo.save();
    res.status(201).json({
      success: true,
      video: result,
    });
  } catch (e) {
    next(e);
  }
};

export const getVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({});
    res.status(200).json({ success: true, videos });
  } catch (e) {
    next(e);
  }
};
