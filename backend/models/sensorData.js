const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    sensorId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['temperature', 'humidity', 'pressure']
    },
    value: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SensorData', sensorDataSchema); 