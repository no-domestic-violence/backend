const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true },

  contacts: [
    {
      name: { type: String },
      phone: { type: String },
      message: { type: String },
    },
  ],
});
module.exports = mongoose.model('User', userSchema);
