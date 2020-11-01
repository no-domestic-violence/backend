const express = require('express');
const shelters = require('../models/Shelter');

const router = express.Router();

router.get('/shelters', async (req, res) => {
  try {
    const sheltersList = await shelters.find();
    res.send(sheltersList);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
