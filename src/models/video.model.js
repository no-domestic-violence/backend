import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url_to_video: {
      type: String,
      required: true,
    },
    imageData: {
      type: String,
      required: true,
    },
  },
  { collection: 'videos' },
);

export default mongoose.model('videos', videoSchema);
