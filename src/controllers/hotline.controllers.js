import Hotline from '../models/hotline.model';

/* eslint-disable  import/prefer-default-export */
export const searchHotline = async (req, res) => {
  try {
    const querySearch = req.query.searchTerm;
    const hotlinesResponse = await Hotline.find({
      $or: [
        { city: { $regex: querySearch, $options: 'i' } },
        { organisation_name: { $regex: querySearch, $options: 'i' } },
      ],
    }).sort({ organisation_name: 1 });
    res.status(200).send(hotlinesResponse);
  } catch (e) {
    res.status(404).send({ success: false, error: e.message });
  }
};
