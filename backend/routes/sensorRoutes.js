const express = require('express');
const router = express.Router();
const SensorData = require('../models/sensorData');

// Get all sensor data
router.get('/data', async (req, res) => {
    try {
        const data = await SensorData.find().sort({ timestamp: -1 }).limit(100);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Post new sensor data
router.post('/data', async (req, res) => {
    const sensorData = new SensorData({
        sensorId: req.body.sensorId,
        type: req.body.type,
        value: req.body.value,
        unit: req.body.unit
    });

    try {
        const newData = await sensorData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 