import redis from 'redis';
import { REDIS_PORT } from '../constants';
import logger from '../logger';

const redisClient = redis.createClient(REDIS_PORT);
redisClient.on('error', (e) => {
  logger.error(e);
});

export default redisClient;
