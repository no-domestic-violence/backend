import User from '../models/user.model';
import validateUser from '../utils/validateUser';

export const editContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      {
        'contacts._id': id,
      },
      {
        $set: {
          'contacts.$[contact].name': req.body.name,
          'contacts.$[contact].phone': req.body.phone,
          'contacts.$[contact].message': req.body.message,
        },
      },
      {
        arrayFilters: [{ 'contact._id': id }],
        new: true,
      },
    );
    validateUser(user, 'User with provided contact does not exist', next);
    const { contacts } = user;
    res.status(201).json({ success: true, contacts });
  } catch (e) {
    next(e);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        username: req.user.username,
      },
      ['contacts'],
    );
    validateUser(user, 'User does not exist', next);
    const { contacts } = user;
    return res.status(200).json({ success: true, contacts });
  } catch (e) {
    next(e);
  }
};

// https://stackoverflow.com/questions/54944980/updateone-returns-a-mongoose-object-and-not-document

export const addContact = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
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
    validateUser(user, 'User does not exist', next);
    const { contacts } = user;
    return res.status(201).json({ success: true, contacts });
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { 'contacts._id': id },
      {
        $pull: {
          contacts: {
            _id: id,
          },
        },
      },
      { new: true },
    );
    validateUser(user, 'User with provided contact does not exist', next);
    const { contacts } = user;
    res.status(202).json({ success: true, contacts });
  } catch (e) {
    next(e);
  }
};
