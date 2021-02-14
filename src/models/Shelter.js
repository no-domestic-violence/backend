import mongoose from 'mongoose';

const shelterSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    place_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    contact_person: {
      type: String,
    },
    phone: {
      type: String,
    },
    loc: {
      type: { type: String },
      coordinates: [Number],
    },
  },
  { collection: 'shelters' },
);

export default mongoose.model('shelters', shelterSchema);
