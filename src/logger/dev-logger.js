/* eslint-disable import/prefer-default-export */
import { format, createLogger, transports } from 'winston';

const { combine, printf, errors } = format;

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
    transports: [new transports.Console()],
  });
};

export { buildDevLogger };