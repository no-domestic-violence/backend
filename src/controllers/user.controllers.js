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
    const { id } = req.params;
    let user;
    // check if id is valid ObjectId - to resolve mongoose castError
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      next(Error.notFound('Contact does not exist'));
    } else {
      user = await User.findOneAndUpdate(
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
      if (!user) {
        next(Error.notFound('Contact does not exist'));
      } else {
        const { contacts } = user;
        res.status(201).json({ success: true, contacts });
      }
    }
  } catch (e) {
    next(e);
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
      const { contacts } = user;
      return res.status(200).json({ success: true, contacts });
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
    return res.status(201).json({ success: true, contacts });
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    let user;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      next(Error.notFound('Contact does not exist'));
    } else {
      user = await User.findOneAndUpdate(
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
    }
    if (!user) {
      next(Error.notFound('Contact does not exist'));
    } else {
      const { contacts } = user;
      res.status(202).json({ success: true, contacts });
    }
  } catch (e) {
    next(e);
  }
};
