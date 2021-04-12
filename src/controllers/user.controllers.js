import User from '../models/user.model';
import Error from '../middleware/error/ErrorHandler';
import handleError from '../middleware/error/handleError';

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
      (err, updatedUser) => {
        if (!updatedUser || err) {
          next(handleError(err));
        }
      },
    );
    return res.status(201).json(user.contacts);
  } catch (e) {
    // need to throw 404 error here because mongoose set does not throw error when
    // arrayfilter does not match
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
      (err, foundUser) => {
        if (!foundUser || err) {
          res.status(404).send('User does not exist!');
        }
      },
    );
    return res.status(200).send(user);
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
      (err, updatedUser) => {
        if (!updatedUser || err) {
          next(Error.notFound('User does not exist'));
        }
      },
    );
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
            // todo: change this on frontend
          },
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (!updatedUser || err) {
          next(Error.notFound('Contact does not exist'));
        }
      },
    );
    const { contacts } = user;
    return res.status(202).json(contacts);
  } catch (e) {
    next(e);
  }
};
