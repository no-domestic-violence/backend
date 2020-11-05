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
  // contact_1: {
  //   name: { type: String, default: '' },
  //   phone: { type: String, default: '' },
  //   message: { type: String, default: '' },
  // },
  // contact_2: {
  //   name: { type: String, default: '' },
  //   phone: { type: String, default: '' },
  //   message: { type: String, default: '' },
  // },
  contacts: [
    {
      name: { type: String },
      phone: { type: String },
      message: { type: String },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
