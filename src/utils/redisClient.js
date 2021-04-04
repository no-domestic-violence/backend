import redis from 'redis';
import { REDIS_PORT } from '../constants';
import logger from '../logger';

/* eslint-disable  import/prefer-default-export */
export const redisClient = redis.createClient(REDIS_PORT);

redisClient.on('error', (e) => {
  logger.error(e);
});
