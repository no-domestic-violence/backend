import mongoose from 'mongoose';
import { ROLE } from '../constants';

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
    sparse:true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    sparse:true,
  },
  password: { type: String, required: true, sparse:true },

  contacts: [contactSchema],
  role: {
    type: String,
    required: true,
    default: ROLE.BASIC,
    enum: [ROLE.BASIC, ROLE.EDITOR, ROLE.ADMIN],
  },
});
export default mongoose.model('User', userSchema);
