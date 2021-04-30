// eslint-disable-next-line import/no-unresolved
import * as Sentry from '@sentry/node';
import Error from './ErrorHandler';
import logger from '../../logger';
// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  if (err instanceof Error) {
    res.status(err.statusCode).json({ message: err.message });
    logger.error(err.message);
    Sentry.captureException(err);
    return;
  }

  res.status(500).json('Something went wrong!');
}

export default handleError;
