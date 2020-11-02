const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  contact_1: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
  },
  contact_2: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
  },
});

module.exports = mongoose.model('User', userSchema);
