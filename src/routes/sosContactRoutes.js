const express = require('express');
const Contact = require('../models/User');
// const { check, validationResult } = require('express-validator');
const router = express.Router();

// const validate = [
//   check('contact_1.name').notEmpty().withMessage('Contact name is required.'),
//   check('contact_1.phone')
//     .notEmpty()
//     .withMessage('Contact phone number is required.'),
//   check('contact_1.message').notEmpty().withMessage('Please enter a message.'),
// ];

// this gets all the user data
router.route('/users').get((req, res) => {
  Contact.find((err, foundContacts) => {
    if (!err) {
      return res.send(foundContacts);
    }
    return res.send(err);
  });
});

// updating an existing contact
router.route('/users/:username/contacts/:_id').patch((req, res) => {
  Contact.findOneAndUpdate(
    {
      username: req.params.username,
    }, // condition
    {
      $set: {
        'contacts.$[el].name': req.body.name,
        'contacts.$[el].phone': req.body.phone,
        'contacts.$[el].message': req.body.message,
      },
    },
    { arrayFilters: [{ 'el._id': req.params._id }] },
    (err) => {
      if (!err) {
        res.send('Successfully edited contact');
        console.log(req.params);
      } else {
        res.send(err);
        console.log(req.params);
      }
    },
  );
});

router
  .route('/users/:username/contacts')

  .get((req, res) => {
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
  .patch((req, res) => {
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

  .delete((req, res) => {
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

// TODO: Validation

// .patch(validate, async (req, res) => {
//   const errors = validationResult(req);
//   const hasErrors = !errors.isEmpty();
//   if (hasErrors) {
//     return res.status(422).json({ errors: errors.array() });
//   }
//   const foundUser = await Contact.findOneAndUpdate(
//     { username: req.params.username },
//     { $set: req.body },
//     { new: true },
//     function (err, foundContact) {
//       if (!err) {
//         res.send('Successfully added contact.');
//         console.log(req.body);
//         console.log(req.params);
//       } else {
//         res.send(err);
//       }
//     },
//   );
// });

// delete first contact
// .patch((req, res)=>{
//     Contact.updateOne( { username: req.params.username },
//       { $pull: { contacts[0]}})
// })

module.exports = router;
