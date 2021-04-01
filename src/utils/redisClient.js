import redis from 'redis';
import { REDIS_PORT } from '../constants';
import logger from '../logger';

export const redisClient = redis.createClient(REDIS_PORT);

redisClient.on('error', (e) => {
  logger.log(e);
});
