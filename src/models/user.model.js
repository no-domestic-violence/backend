const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  message: { type: String },
});

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

  contacts: [contactSchema],
});
module.exports = mongoose.model('User', userSchema);