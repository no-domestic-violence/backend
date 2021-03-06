import shelters from '../models/shelter.model';

/* eslint-disable  import/prefer-default-export */
export const getShelters = async (req, res, next) => {
  try {
    const sheltersList = await shelters.find(
      {},
      {
        place_name: 1,
        address: 1,
        contact_person: 1,
        phone: 1,
        locs: 1,
      },
    );
    res.status(200).json({ success: true, shelters: sheltersList });
  } catch (e) {
    next(e);
  }
};
