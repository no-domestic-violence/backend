import Error from './ErrorHandler';

function handleError(err, req, res) {
  if (err instanceof Error) {
    res.status(err.statusCode).json(err.message);
    return;
  }

  res.status(500).json('Something went wrong!');
}

export default handleError;
