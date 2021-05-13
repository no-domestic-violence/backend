import { redisClient } from '../utils/redisClient';

const hotlinesCache = (req, res, next) => {
  const { searchTerm } = req.query;
  process.env.NODE_ENV === 'production' && next(); // we do not have redis on production
  redisClient.get(searchTerm, (err, data) => {
    if (err) throw err;
    if (data) {
      res.status(200).send(data);
    } else {
      next();
    }
  });
};

const articleCache = (req, res, next) => {
  const { id } = req.params;
  process.env.NODE_ENV === 'production' && next(); // we do not have redis on production
  redisClient.get(id, (err, data) => {
    if (err) throw err;
    if (data) {
      res.status(200).send(data);
    } else {
      next();
    }
  });
};

export { hotlinesCache, articleCache };
