const mongoose = require('mongoose');

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
    },
    created_at: {
      type: Date,
      required: true,
    },
  },
  { collection: 'articles' },
);

module.exports = mongoose.model('articles', articleSchema);
