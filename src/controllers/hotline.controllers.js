import Hotline from '../models/hotline.model';
import Error from '../middleware/error/ErrorHandler';
import redisClient from '../utils/redisClient';

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
    process.env.NODE_ENV === 'development' && redisClient.setex(searchTerm, 3600, JSON.stringify(hotlinesResponse));
    res.status(200).send(hotlinesResponse);
  } catch (error) {
    next(Error.badRequest('Bad request.'));
  }
};
