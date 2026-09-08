const express = require('express');
const { trackShipment } = require('../controllers/trackingController');

const router = express.Router();

router.get('/:id', trackShipment);

module.exports = router;
