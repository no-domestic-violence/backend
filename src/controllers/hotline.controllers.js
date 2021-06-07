import Hotline from '../models/hotline.model';
import Error from '../middleware/error/ErrorHandler';
import { setRedisCache } from '../utils/redisClient';

/* eslint-disable  import/prefer-default-export */
export const searchHotline = async (req, res, next) => {
  const { searchTerm } = req.query;
  try {
    const hotlinesResponse = await Hotline.find({
      $or: [
        { city: { $regex: searchTerm, $options: 'i' } },
        { organisation_name: { $regex: searchTerm, $options: 'i' } },
      ],
    }).sort({ organisation_name: 1 });
    setRedisCache(searchTerm, hotlinesResponse);
    res.status(200).json({ success: true, hotlines: hotlinesResponse });
  } catch (error) {
    next(Error.badRequest('Bad request.'));
  }
};
