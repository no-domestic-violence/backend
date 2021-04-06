import morgan from 'morgan';
import json from 'morgan-json';
import fs from 'fs';
import appRoot from 'app-root-path';
import logger from './index';

const accessLogStream = fs.createWriteStream(`${appRoot}/logs/app.log`, {
  flags: 'a',
});

const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time',
});

const devHttpLogger = morgan(
  ':date[iso] :method :url :status :res[content-length] - :response-time ms',
  {
    stream: accessLogStream,
  },
);

const prodHttpLogger = morgan(format, {
  stream: {
    write: message => {
      const { method, url, status, contentLength, responseTime } = JSON.parse(
        message,
      );

      logger.info('HTTP Access Log', {
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime),
      });
    },
  },
});

// eslint-disable-next-line import/no-mutable-exports
let httpLogger = null;
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  httpLogger = devHttpLogger;
} else {
  httpLogger = prodHttpLogger;
}

export default httpLogger;
