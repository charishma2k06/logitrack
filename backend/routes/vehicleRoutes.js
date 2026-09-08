const express = require('express');
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All vehicle routes protected, only Admin and Manager can fully manage them
router.use(protect);
router.use(authorize('Admin', 'Manager'));

router.route('/')
    .get(getVehicles)
    .post(createVehicle);

router.route('/:id')
    .get(getVehicle)
    .put(updateVehicle)
    .delete(deleteVehicle);

module.exports = router;
