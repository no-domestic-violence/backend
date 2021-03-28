import Hotline from '../models/hotline.model';
import Error from '../middleware/error/ErrorHandler';
import redis from 'redis';

//TODO: move it to initialisation file
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

//log error to the console if any occurs
client.on('error', err => {
  console.log(err);
});

/* eslint-disable  import/prefer-default-export */
export const searchHotline = async (req, res, next) => {
  try {
    const querySearch = req.query.searchTerm;

    client.get(querySearch, async (err, hotlinesResponse) => {
      if (err) throw err;

      if (hotlinesResponse) {
        res.status(200).send(hotlinesResponse);
      } else {
        const hotlinesResponse = await Hotline.find({
          $or: [
            { city: { $regex: querySearch, $options: 'i' } },
            { organisation_name: { $regex: querySearch, $options: 'i' } },
          ],
        }).sort({ organisation_name: 1 });
        client.setex(querySearch, 600, JSON.stringify(hotlinesResponse));
        res.status(200).send(hotlinesResponse);
      }
    });
  } catch (error) {
    next(Error.badRequest('Bad request.'));
  }
};
