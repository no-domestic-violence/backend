/* eslint-disable import/prefer-default-export */
import { format, createLogger, transports } from 'winston';
import appRoot from 'app-root-path';

const { combine, printf, errors } = format;

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/development.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const buildDevLogger = () => {
  const logFormat = printf(
    ({
      level, message, timestamp, stack,
    }) => `${timestamp} ${level}: ${stack || message}`,
  );

  return createLogger({
    format: combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [
      new transports.File(options.file),
      new transports.Console(options.console),
    ],
  });
};

export { buildDevLogger };
