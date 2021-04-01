import connectToDatabase from './utils/database';
import app from './app';
import logger from './logger';

const startServer = async () => {
  try {
    await connectToDatabase();
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      /* eslint-disable no-console */
      logger.info(`Server is running on http://localhost:${port}/api`);
    });
  } catch (e) {
    logger.error(e);
  }
};

startServer();
