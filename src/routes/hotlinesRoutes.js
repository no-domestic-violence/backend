const express = require('express');
const shelters = require('../models/Hotline');

const router = express.Router();

router.get('/hotlines', async (req, res) => {
  try {
    const hotlines = await shelters.find();
    res.send(hotlines);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
