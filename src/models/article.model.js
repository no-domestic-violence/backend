import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    url_to_image: {
      type: String,
      required: true,
    },
    violence_type: {
      type: [String],
      required: true,
      validate: (v) => v == null || (v.length > 0),
    },
    created_at: {
      type: Date,
      required: true,
    },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { collection: 'articles' },
);

export default mongoose.model('articles', articleSchema);
