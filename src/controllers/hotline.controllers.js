import Hotline from '../models/hotline.model';
import Error from '../middleware/error/ErrorHandler';
import { setRedisCache } from '../utils/redisClient';

/* eslint-disable  import/prefer-default-export */
export const searchHotline = async (req, res, next) => {
  const { searchTerm } = req.query;
  const query = searchTerm.toString();
  try {
    const hotlinesResponse = await Hotline.find({
      $or: [
        { city: { $regex: query, $options: 'i' } },
        { organisation_name: { $regex: query, $options: 'i' } },
      ],
    }).sort({ organisation_name: 1 });
    setRedisCache(query, hotlinesResponse);
    res.status(200).json({ success: true, hotlines: hotlinesResponse });
  } catch (error) {
    next(Error.badRequest('Bad request.'));
  }
};
