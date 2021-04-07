import redisClient from '../utils/redisClient';

const hotlinesCache = (req, res, next) => {
  const { searchTerm } = req.query;
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
