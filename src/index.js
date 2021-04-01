import connectToDatabase from './utils/database';
import app from './app';
import logger from './logger';
import { PORT } from './constants';

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      /* eslint-disable no-console */
      logger.info(`Server is running on http://localhost:${PORT}/api`);
    });
  } catch (e) {
    logger.error(e);
  }
};

startServer();
