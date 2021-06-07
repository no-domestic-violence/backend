import redis from 'redis';
import { REDIS_PORT } from '../constants';
import logger from '../logger';

const redisClient = redis.createClient(REDIS_PORT);
redisClient.on('error', e => {
  logger.error(e);
});

const setRedisCache = (keyName, data) => {
  return (
    process.env.NODE_ENV === 'development' &&
    redisClient.setex(keyName, 3600, JSON.stringify(data))
  );
};

const getRedisCache = (keyName, serverResponse, next) => {
  process.env.NODE_ENV === 'production' && next();
  redisClient.get(keyName, (err, data) => {
    if (err) throw err;
    if (data) {
      serverResponse.status(200).send(data);
    } else {
      next();
    }
  });
};

export { redisClient, setRedisCache, getRedisCache };
