import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';

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
    const updatedUser = await User.findOneAndUpdate(
      {
        // find the user that contains the contactId
        'contacts._id': editedContactId,
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
    return res.status(201).json(updatedUser.contacts);
  } catch (e) {
    next(Error.notFound('Contact does not exist'));
  }
};

export const getContact = async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        username: req.params.username,
      },
      ['contacts'],
    );
    if (!user) {
      await next(Error.notFound('User does not exist'));
    } else {
      return res.status(200).send(user);
    }
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
      { username: req.params.username },
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
    if (!user) {
      await next(Error.notFound('User does not exist'));
    }
    const { contacts } = user;
    return res.status(201).json(contacts);
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: {
          contacts: {
            _id: req.params._id,
          },
        },
      },
      { new: true },
    );
    const { contacts } = user;
    return res.status(202).json(contacts);
  } catch (e) {
    next(Error.notFound('Contact does not exist'));
  }
};
