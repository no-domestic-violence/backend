/* eslint-disable import/prefer-default-export */
import { format, createLogger, transports } from 'winston';
import appRoot from 'app-root-path';

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
  },
};

const { timestamp, combine, errors, json } = format;

const buildProdLogger = () =>
  createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [new transports.File(options.file)],
  });

export { buildProdLogger };
