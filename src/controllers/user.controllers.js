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
    const editedContact = user.contacts.filter(
      (contact) => contact._id === editedContactId,
    );
    console.log(editedContact);
    res.status(201).json(req.body);
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
    res
      .status(202)
      .json({ message: 'Successfully deleted contact', id: req.query.id });
  } catch (e) {
    res.send(e);
  }
};
