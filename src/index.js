import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import {
  hotlineRoutes,
  shelterRoutes,
  articleRoutes,
  userRoutes,
  videoRoutes,
} from './routes';
import handleError from './middleware/error/handleError';
import Error from './middleware/error/ErrorHandler';
import connectToDatabase from './utils/database';
import { BASE_URI } from './constants';
import swaggerDocument from './assets/swagger.json';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO refactor authRoutes - split controller logic
const authRoutes = require('./routes/auth');

app.use(BASE_URI, express.static('./src/assets/images'));
app.use(BASE_URI, authRoutes);
app.use(BASE_URI, shelterRoutes);
app.use(BASE_URI, hotlineRoutes);
app.use(BASE_URI, userRoutes);
app.use(BASE_URI, articleRoutes);
app.use(BASE_URI, videoRoutes);

app.get(BASE_URI, (req, res) => {
  res.send('Welcome to the "Pool" project API');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('*', (req, res, next) => {
  setImmediate(() => {
    next(Error.notFound('Not found.'));
  });
});
app.use(handleError);

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
