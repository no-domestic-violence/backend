import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import promMid from 'express-prometheus-middleware';
import httpLogger from './logger/http-logger';
import {
  hotlineRoutes,
  shelterRoutes,
  articleRoutes,
  userRoutes,
  videoRoutes,
  authRoutes,
} from './routes';
import handleError from './middleware/error/handleError';
import Error from './middleware/error/ErrorHandler';
import { BASE_URI } from './constants';
import swaggerDocument from './assets/swagger.json';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';

const app = express();

app.use(httpLogger);
app.use(morgan('dev')); // to show in console
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(compression());
app.use(helmet());
app.use(
  promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  }),
);

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

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.status === 404 || error.status === 500) {
        return true;
      }
      return false;
    },
  })
);
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.get('*', (req, res, next) => {
  setImmediate(() => {
    next(Error.notFound('Not found.'));
  });
});
app.use((err, req, res) => {
  handleError(err, req, res);
});

export default app;
