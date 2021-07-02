/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-named-as-default-member */
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import promMid from 'express-prometheus-middleware';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
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

const app = express();

app.use(httpLogger);
app.use(morgan('dev'));
app.use(cors());

app.use(helmet());
// Sets all of the defaults CSP, but overrides some
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ["'self"],
      'script-src': ["'self'"],
      'style-src': ["'self'"],
      'font-src': ["'self'", 'https:'],
      'connect-sources': [
        "'self'",
        'ws://localhost:3001',
        'https://pool-api-mobile.herokuapp.com/',
      ],
      'img-src': ["'self'", 'https:'],
      'upgradeInsecureRequests': [],
    },
  }),
);

// Sets "Strict-Transport-Security: max-age=123456; includeSubDomains"
app.use(
  helmet.hsts({
    maxAge: 123456,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(hpp());

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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
  res.send(
    `Welcome to the Pool project API, ${process.env.INSTANCE} instance running currently`,
  );
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('*', (req, res, next) => {
  setImmediate(() => {
    next(Error.notFound('Not found.'));
  });
});
app.use(Sentry.Handlers.errorHandler());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  handleError(err, req, res);
});

export default app;
