import mongoose from 'mongoose';
import config from '../config/key';

const connectToDatabase = async (url = config.mongoURI || process.env.mongoURI) => {
  try {
    await mongoose.set('useCreateIndex', true);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    /* eslint-disable no-console */
    console.log('MongoDB is connected!');
  } catch (e) {
    console.error(e);
  }
};

export default connectToDatabase;
