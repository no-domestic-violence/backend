import shelters from '../models/shelter.model';

export const getShelters = async (req, res) => {
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
    res.status(200).send(sheltersList);
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};
