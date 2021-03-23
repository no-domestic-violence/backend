import Hotline from '../models/hotline.model';
import Error from '../middleware/error/ErrorHandler';

/* eslint-disable  import/prefer-default-export */
export const searchHotline = async (req, res, next) => {
  try {
    const querySearch = req.query.searchTerm;

    const hotlinesResponse = await Hotline.find({
      $or: [
        { city: { $regex: querySearch, $options: 'i' } },
        { organisation_name: { $regex: querySearch, $options: 'i' } },
      ],
    }).sort({ organisation_name: 1 });
    res.status(200).send(hotlinesResponse);
  } catch (error) {
    next(Error.badRequest('Bad request.'));
  }
};
