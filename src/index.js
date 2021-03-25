import connectToDatabase from './utils/database';
import app from './app';

const startServer = async () => {
  try {
    await connectToDatabase();
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      /* eslint-disable no-console */
      console.log(`Server is running on http://localhost:${port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();
