import { connectToDatabase } from './utils/database';
import app from './app';
import logger from './logger';
import { PORT } from './constants';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      /* eslint-disable no-console */
      logger.info(`Server is running on http://localhost:${PORT}/api`);
    });
  } catch (e) {
    logger.error(e);
  }
};

startServer();
