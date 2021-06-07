import { getRedisCache } from '../utils/redisClient';

const hotlinesCache = (req, res, next) => {
  const { searchTerm } = req.query;
  getRedisCache(searchTerm, res, next);
};

const articleCache = (req, res, next) => {
  const { id } = req.params;
  getRedisCache(id, res, next);
};

export { hotlinesCache, articleCache };
