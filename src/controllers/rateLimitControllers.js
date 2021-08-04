import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { REDIS_PORT } from '../constants';
import logger from '../logger';

const redisClient = redis.createClient(REDIS_PORT, {
  enable_offline_queue: false,
});

redisClient.on('error', e => {
  logger.error(e);
});

const generalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 1000,
  duration: 60,
  blockDuration: 10,
});

const emailLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 40,
  duration: 60,
  blockDuration: 3600,
});

const ipLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 60,
  duration: 60,
  blockDuration: 3600,
});

const ipEmailLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 20,
  duration: 60,
  blockDuration: 3600,
});

export const GeneralRouteRateLimit = route => async (req, res, next) => {
  try {
    await generalLimiter.consume(route, 2);
    next();
  } catch (err) {
    res.status(429).send('Limit exceeded');
  }
};

// eslint-disable-next-line import/prefer-default-export
export const loginEmailRouteRateLimit = async (req, res, next) => {
  try {
    await emailLimiter.consume(req.body.email, 2);
    next();
  } catch (err) {
    res.status(429).send('Limit exceeded for email');
  }
};

// eslint-disable-next-line import/prefer-default-export
export const loginIpRouteRateLimit = async (req, res, next) => {
  try {
    await ipLimiter.consume(req.ip, 2);
    next();
  } catch (err) {
    res.status(429).send('Limit exceeded for ip');
  }
};

export const uniqueIpEmailKey = (email, ip) => `${email}_${ip}`;
export const uniqueIpEmailKeyReq = req =>
  uniqueIpEmailKey(req.body.email, req.ip);

// eslint-disable-next-line import/prefer-default-export
export const loginIpEmailRouteRateLimit = async (req, res, next) => {
  try {
    await ipEmailLimiter.consume(uniqueIpEmailKeyReq(req), 2);
    next();
  } catch (err) {
    res.status(429).send('Limit exceeded for ip+email combination.');
  }
};
