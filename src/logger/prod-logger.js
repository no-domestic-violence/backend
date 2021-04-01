/* eslint-disable import/prefer-default-export */
import { format, createLogger, transports } from 'winston';

const {
  timestamp, combine, errors, json,
} = format;

const buildProdLogger = () => createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: 'user-service' },
  transports: [new transports.Console()],
  // new file with logging data here
});

export { buildProdLogger };
