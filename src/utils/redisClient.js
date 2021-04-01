import redis from 'redis';
import { REDIS_PORT } from '../constants';
import logger from '../logger';

// TODO: how to make it work on prod?

export const redisClient = redis.createClient(REDIS_PORT);

redisClient.on('error', (e) => {
  logger.log(e);
});
