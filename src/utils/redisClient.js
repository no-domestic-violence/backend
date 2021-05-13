import redis from 'redis';
import { REDIS_PORT } from '../constants';
import logger from '../logger';

const redisClient = redis.createClient(REDIS_PORT);
redisClient.on('error', (e) => {
  logger.error(e);
});

const setRedisCache = (name, data) => {
  return process.env.NODE_ENV === 'development' &&
      redisClient.setex(name, 3600, JSON.stringify(data));
}

export {redisClient, setRedisCache};

