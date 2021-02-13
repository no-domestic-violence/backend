const express = require('express');
const { getShelters } = require('../controllers');

const router = express.Router();

router.get('/shelters', getShelters);

export default router;
