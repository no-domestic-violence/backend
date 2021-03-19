import User from '../models/user.model';
import Error from '../utils/error/ErrorHandler';

export const editContact = async (req, res, next) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      next(
        Error.badRequest('All the fields are required and must be non blank!'),
      );
      return;
    }
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
    next(e);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const foundContact = await User.findOne(
      {
        username: req.params.username,
      },
      ['contacts'],
    );
    res.status(200).send(foundContact);
  } catch (e) {
    next(e);
  }
};

// https://stackoverflow.com/questions/54944980/updateone-returns-a-mongoose-object-and-not-document

export const addContact = async (req, res, next) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      next(
        Error.badRequest('All the fields are required and must be non blank!'),
      );
      return;
    }
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
    next(e);
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
