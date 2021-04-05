import Error from './ErrorHandler';
import logger from '../../logger';

function handleError(err, req, res) {
  if (err instanceof Error) {
    res.status(err.statusCode).json(err.message);
    logger.error(err.message);
    return;
  }

  res.status(500).json('Something went wrong!');
}

export default handleError;
