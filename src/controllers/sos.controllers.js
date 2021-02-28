import User from '../models/User';

export const editContact = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      {
        username: req.params.username,
      },
      {
        $set: {
          'contacts.$[contact].name': req.body.name,
          'contacts.$[contact].phone': req.body.phone,
          'contacts.$[contact].message': req.body.message,
        },
      },
      {
        arrayFilters: [{ 'contact._id': req.params._id }],
      },
    );
    res.status(201).json({ message: 'Successfully edited contact' });
  } catch (e) {
    res.send(e);
  }
};

export const getContact = async (req, res) => {
  try {
    const foundContact = await User.findOne(
      {
        username: req.params.username,
      },
      ['contacts'],
    );
    res.status(200).send(foundContact);
  } catch (e) {
    res.send(e);
  }
};

export const addContact = async (req, res) => {
  try {
    await User.updateOne(
      { username: req.params.username }, // condition
      {
        $push: {
          contacts: {
            name: req.body.name,
            phone: req.body.phone,
            message: req.body.message,
          },
        },
      },
    );
    res.status(201).json({ message: 'Successfully added contact' });
  } catch (e) {
    res.send(e);
  }
};

export const deleteContact = async (req, res) => {
  try {
    await User.updateOne(
      { username: req.params.username },
      {
        $pull: {
          contacts: {
            _id: req.query.id,
          },
        },
      },
    );
    res.status(202).json({ message: 'Successfully deleted contact' });
  } catch (e) {
    res.send(e);
  }
};
