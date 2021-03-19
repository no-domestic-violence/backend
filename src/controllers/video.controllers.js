import Video from '../models/video.model';

export const createVideo = async (req, res) => {
  try {
    const newVideo = new Video({
      title: req.body.title,
      url_to_video: req.body.url_to_video,
      imageData: req.file.filename,
    });
    const result = await newVideo.save();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).send(videos);
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};
