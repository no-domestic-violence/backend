import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();
const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
};

mongod.getInstanceInfo();

// eslint-disable-next-line import/prefer-default-export
export const connectTestDb = async () => {
    await mongoose.disconnect();
  const mongoUri = await mongod.getUri();
  await mongoose.connect(mongoUri, opts, err => {
    if (err) {
      console.error(err);
    }
  });
};

export const closeTestDb = async () => {
    await mongoose.disconnect();
    await mongod.stop();
}

export const clearTestDb = async () => {
    const { collections } = mongoose.connection;
    for (const key in collections){
        await collections[key].deleteMany();
    }
}

