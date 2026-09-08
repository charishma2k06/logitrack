const Shipment = require('../models/Shipment');

exports.trackShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await Shipment.findOne({ shipmentId: id })
            .select('shipmentId status origin destination expectedDeliveryDate createdAt');

        if (!shipment) {
            return res.status(404).json({ success: false, error: 'Shipment not found' });
        }

        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
