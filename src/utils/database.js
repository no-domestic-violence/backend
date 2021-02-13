import mongoose from 'mongoose';
import config from '../config/key';

export const connectToDatabase = (
  url = config.mongoURI || process.env.mongoURI,
) => {
  mongoose.set('useCreateIndex', true);
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB is connected!!!!'))
    .catch((err) => console.log(err));
};
