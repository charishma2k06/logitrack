const express = require('express');
const { getOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .get(getOrder)
    .put(authorize('Admin', 'Manager'), updateOrder)
    .delete(authorize('Admin'), deleteOrder);

module.exports = router;
