import mongoose from 'mongoose';
import config from '../config/key';
import logger from '../logger';

const connectToDatabase = async (
  url = config.mongoURI || process.env.mongoURI,
) => {
  try {
    await mongoose.set('useCreateIndex', true);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    /* eslint-disable no-console */
    logger.info('MongoDB is connected!');
  } catch (e) {
    logger.error(e);
  }
};

export default connectToDatabase;
