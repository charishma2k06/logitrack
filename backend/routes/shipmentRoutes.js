const express = require('express');
const { getShipments, getShipment, createShipment, updateShipment, deleteShipment } = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getShipments)
    .post(protect, authorize('Admin', 'Manager', 'Customer'), createShipment);

router.route('/:id')
    .get(getShipment)
    .put(protect, authorize('Admin', 'Manager', 'Driver'), updateShipment)
    .delete(protect, authorize('Admin', 'Manager'), deleteShipment);

module.exports = router;
