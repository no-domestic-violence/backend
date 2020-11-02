const express = require('express');
const Contact = require('../models/User');

const router = express.Router();

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
      function (err) {
        if (!err) {
          res.send('Successfully added contact');
          console.log(req.body);
        } else {
          res.send(err);
        }
      },
    );
  });

// .delete(function (req, res){
//     Contact.deleteOne( { })
// })

module.exports = router;
