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

    res.send('Successfully edited contact');
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
    res.send(foundContact);
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
    res.send('Successfully added contact');
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
    res.send('Successfully deleted Contact');
  } catch (e) {
    res.send(e);
  }
};
