const express = require('express');
const hotlines = require('../models/Hotline');

const router = express.Router();

export const searchHotline = async (req, res) => {
  try {
    const querySearch = req.query.searchTerm;
    const hotlinesResponse = await hotlines
      .find({
        $or: [
          { city: { $regex: querySearch, $options: 'i' } },
          { organisation_name: { $regex: querySearch, $options: 'i' } },
        ],
      })
      .sort({ organisation_name: 1 });
    res.send(hotlinesResponse);
  } catch (error) {
    res.send(error);
  }
};
