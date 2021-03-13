import User from '../models/user.model';

export const editContact = async (req, res) => {
  try {
    const editedContactId = req.params._id;
    const user = await User.findOneAndUpdate(
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
        arrayFilters: [{ 'contact._id': editedContactId }],
        new: true,
      },
    );
    res.status(201).json(user.contacts);
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

// https://stackoverflow.com/questions/54944980/updateone-returns-a-mongoose-object-and-not-document

export const addContact = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
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
      { new: true },
    );
    const { contacts } = user;
    res.status(201).json(contacts);
  } catch (e) {
    res.send(e);
  }
};

export const deleteContact = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: {
          contacts: {
            _id: req.query.id,
          },
        },
      },
      { new: true },
    );
    const { contacts } = user;
    res.status(202).json(contacts);
  } catch (e) {
    res.send(e);
  }
};
