import shelters from '../models/Shelter';

export const getShelters = async (req, res) => {
  try {
    const sheltersList = await shelters.find(
      {},
      {
        place_name: 1, address: 1, contact_person: 1, phone: 1, locs: 1,
      },
    );
    res.send(sheltersList);
  } catch (error) {
    res.send(error);
  }
};
