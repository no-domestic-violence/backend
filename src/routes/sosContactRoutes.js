const express = require('express');
const Contact = require('../models/User');
const verifyToken  = require('./verifyToken')

const router = express.Router();
// updating an existing contact
router.route('/users/:username/contacts/:_id').patch((req, res) => {
  Contact.findOneAndUpdate(
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
    { arrayFilters: [{ 'contact._id': req.params._id }] },
    (err) => {
      if (!err) {
        res.send('Successfully edited contact');
      } else {
        res.send(err);
      }
    },
  );
});

router
  .route('/users/:username/contacts')

  .get(verifyToken, (req, res) => {
    Contact.findOne(
      {
        username: req.params.username,
      },
      (err, foundContact) => {
        if (foundContact) {
          res.send(foundContact);
        } else {
          res.send('No user matching that username was found.');
        }
      },
    );
  })
  // adding new contact
  
  .patch(verifyToken, (req, res) => {
    Contact.updateOne(
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
      (err) => {
        if (!err) {
          res.send('Successfully added contact');
        } else {
          res.send(err);
        }
      },
    );
  })

  .delete(verifyToken, (req, res) => {
    Contact.updateOne(
      { username: req.params.username },
      {
        $pull: {
          contacts: {
            _id: req.query.id,
          },
        },
      },
      { safe: true },
      (err) => {
        if (!err) {
          res.send('Successfully deleted Contact');
        } else {
          res.send(err);
        }
      },
    );
  });

module.exports = router;
