// https://simonplend.com/how-to-create-an-error-handler-for-your-express-api/
const NODE_ENVIRONMENT = process.env.NODE_ENV || 'development';

const getErrorMessage = (error) => {
  /**
   * If it exists, prefer the error stack as it usually
   * contains the most detail about an error:
   * an error message and a function call stack.
   */
  if (error.stack) {
    return error.stack;
  }
  if (typeof error.toString === 'function') {
    return error.toString();
  }
  return '';
};

const logErrorMessage = (error) => {
  console.error(error);
};

// determines if an HTTP status code falls in the 4xx or 5xx error ranges
const isErrorStatusCode = (statusCode) => {
  return statusCode >= 400 && statusCode < 600;
};

const getHttpStatusCode = ({ error, response }) => {
  /**
   * Check if the error object specifies an HTTP
   * status code which we can use.
   */
  const statusCodeFromError = error.status || error.statusCode;
  if (isErrorStatusCode(statusCodeFromError)) {
    return statusCodeFromError;
  }
  /**
   * The existing response `statusCode`. This is 200 (OK)
   * by default in Express, but a route handler or
   * middleware might already have set an error HTTP
   * status code (4xx or 5xx).
   */
  const statusCodeFromResponse = response.statusCode;
  if (isErrorStatusCode(statusCodeFromResponse)) {
    return statusCodeFromResponse;
  }
  /**
   * Fall back to a generic error HTTP status code.
   * 500 (Internal Server Error).
   */
  return 500;
};

const errorHandlerMiddleware = (error, request, response, next) => {
  const errorMessage = getErrorMessage(error);
  logErrorMessage(errorMessage);
  /**
   * If response headers have already been sent,
   * delegate to the default Express error handler.
   */
  if (response.headersSent) {
    return next(error);
  }

  const errorResponse = {
    statusCode: getHttpStatusCode({ error, response }),
    body: undefined,
  };
  /**
   * Error messages and error stacks often reveal details
   * about the internals of your application, potentially
   * making it vulnerable to attack, so these parts of an
   * Error object should never be sent in a response when
   * your application is running in production.
   */

  if (NODE_ENVIRONMENT !== 'production') {
    errorResponse.body = errorMessage;
  }
  /**
   * Set the response status code.
   */
  response.status(errorResponse.statusCode);

  // Callback to run when `Accept` header contains either
  // `application/json` or `*/*`, or if it isn't set at all.
  response.format({
    'application/json': () => {
      /**
       * Set a JSON formatted response body.
       * Response header: `Content-Type: `application/json`
       */
      response.json({
        status: errorResponse.statusCode,
        message: errorResponse.body,
      });
    },
    /**
     * Callback to run when none of the others are matched.
     */

    default: () => {
      /**
       * Set a plain text response body.
       * Response header: `Content-Type: text/plain`
       */
      response.type('text/plain').send(errorResponse.body);
    },
  });
  /**
   * Ensure any remaining middleware are run.
   */
  next();
};

export default errorHandlerMiddleware;
