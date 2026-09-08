const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('driver', 'name email');
        res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ vehicleId: req.params.id }).populate('driver', 'name email');
        if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.createVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate({ vehicleId: req.params.id }, req.body, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ vehicleId: req.params.id });
        if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
