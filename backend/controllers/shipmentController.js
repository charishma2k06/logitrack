const Shipment = require('../models/Shipment');

exports.getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find().populate('customer', 'name email').populate('driver', 'name').populate('vehicle', 'registrationNumber');
        res.status(200).json({ success: true, count: shipments.length, data: shipments });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ shipmentId: req.params.id }).populate('customer', 'name email').populate('driver', 'name').populate('vehicle', 'registrationNumber');

        if (!shipment) {
            return res.status(404).json({ success: false, error: 'Shipment not found' });
        }

        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.createShipment = async (req, res) => {
    try {
        req.body.customer = req.user.id;
        // Generate a new shipment ID
        req.body.shipmentId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;

        const shipment = await Shipment.create(req.body);
        res.status(201).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateShipment = async (req, res) => {
    try {
        let shipment = await Shipment.findOne({ shipmentId: req.params.id });

        if (!shipment) {
            return res.status(404).json({ success: false, error: 'Shipment not found' });
        }

        shipment = await Shipment.findOneAndUpdate({ shipmentId: req.params.id }, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ shipmentId: req.params.id });

        if (!shipment) {
            return res.status(404).json({ success: false, error: 'Shipment not found' });
        }

        await shipment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
