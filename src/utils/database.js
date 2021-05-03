import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import logger from '../logger';

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

let testDbUri;
let mongoServer;

const setTestURI = async () => {
  mongoServer = new MongoMemoryServer();
  testDbUri = await mongoServer.getUri();
  return testDbUri;
};

export const connectToDatabase = async (url = process.env.mongoURI) => {
  process.env.NODE_ENV === 'test' && (await setTestURI());
  await mongoose.connect(
    process.env.NODE_ENV === 'test' ? testDbUri : url,
    opts,
    err => {
      if (err) {
        logger.error(err);
      }
    },
  );
  logger.info('MongoDB is connected!');
  /* eslint-disable no-console */
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearDatabase = () => {
  const { collections } = mongoose.connection;
  Object.keys(collections).forEach(async collection => {
    await mongoose.connection.collection(collection).deleteMany({});
  });
};
