import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import promMid from 'express-prometheus-middleware';
import fs from 'fs';
import appRoot from 'app-root-path';
import {
  hotlineRoutes,
  shelterRoutes,
  articleRoutes,
  userRoutes,
  videoRoutes,
} from './routes';
import handleError from './middleware/error/handleError';
import Error from './middleware/error/ErrorHandler';
import { BASE_URI } from './constants';
import swaggerDocument from './assets/swagger.json';

const app = express();

const accessLogStream = fs.createWriteStream(`${appRoot}/logs/app.log`, {
  flags: 'a',
});
app.use(morgan('tiny', { stream: accessLogStream }));
app.use(morgan('dev')); // to show in console

app.use(
  promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  }),
);
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
app.use((err, req, res) => {
  handleError(err, req, res);
});

export default app;
