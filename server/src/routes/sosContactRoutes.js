const express = require('express');
const Contact = require('../models/User');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const validate = [
  check('contact_1.name').notEmpty().withMessage('Contact name is required.'),
  check('contact_1.phone')
    .notEmpty()
    .withMessage('Contact phone number is required.'),
  check('contact_1.message').notEmpty().withMessage('Please enter a message.'),
];

router.route('/emergency').get(function (req, res) {
  Contact.find(function (err, foundContacts) {
    if (!err) {
      res.send(foundContacts);
    } else {
      res.send(err);
    }
  });
});
router
  .route('/emergency/:username')

  .get(function (req, res) {
    Contact.findOne(
      {
        username: req.params.username,
      },
      function (err, foundContact) {
        if (foundContact) {
          res.send(foundContact);
          console.log(req.params);
        } else {
          res.send('No user matching that username was found.');
        }
      },
    );
  })

  .patch(function (req, res) {
    Contact.updateOne(
      { username: req.params.username }, //condition
      { $set: req.body },
      //{ upsert: true },
      function (err) {
        if (!err) {
          res.send('Successfully added contact');
          console.log(req.body);
          console.log(req.params);
        } else {
          res.send(err);
        }
      },
    );
  });

//   .patch(validate, async (req, res) => {
//     const errors = validationResult(req);
//     const hasErrors = !errors.isEmpty();
//     if (hasErrors) {
//       return res.status(422).json({ errors: errors.array() });
//     }
//     const foundUser = await Contact.findOneAndUpdate(
//       { username: req.params.username },
//       { $set: req.body },
//       { new: true },
//       function (err, foundContact) {
//         if (!err) {
//           res.send('Successfully added contact.');
//           console.log(req.body);
//           console.log(req.params);
//         } else {
//           res.send(err);
//         }
//       },
//     );
//   });

// .delete(function (req, res){
//     Contact.deleteOne( { })
// })

module.exports = router;
