const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'name email').populate('shipment');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id }).populate('customer', 'name email').populate('shipment');
        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        req.body.customer = req.user.id;
        req.body.orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const order = await Order.create(req.body);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ orderId: req.params.id }, req.body, { new: true, runValidators: true });
        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ orderId: req.params.id });
        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
