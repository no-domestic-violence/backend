const express = require('express');
const shelters = require('../models/Hotline');

const router = express.Router();

router.get('/hotlines', async (req, res) => {
  try {
    const querySearch = req.query.searchTerm;

    const hotlines = await shelters.find({
      $or: [
        { city: { $regex: querySearch, $options: 'i' } },
        { organisation_name: { $regex: querySearch, $options: 'i' } },
      ],
    });
    res.send(hotlines);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
