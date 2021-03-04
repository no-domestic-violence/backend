import mongoose from 'mongoose';

const hotlineSchema = new mongoose.Schema(
  {
    organisation_name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
  },
  { collection: 'hotlines' },
);

export const Hotline = mongoose.model('hotlines', hotlineSchema);
