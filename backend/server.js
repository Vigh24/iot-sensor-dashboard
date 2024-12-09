require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const SensorData = require('./models/sensorData');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create .env file for environment variables
// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/iot-dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Connection Details:', {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
    });
})
.catch(err => {
    console.error('MongoDB Connection Error:', {
        message: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack
    });
});

// Import routes
const sensorRoutes = require('./routes/sensorRoutes');

// Use routes
app.use('/api/sensors', sensorRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'IoT Dashboard API is running' });
});

// Create HTTP server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    // Send initial connection message
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to WebSocket server' }));

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);
            
            // Broadcasting to all connected clients first
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });

            // Then try to save to MongoDB
            try {
                const sensorData = new SensorData(data);
                await sensorData.save();
                console.log('Data saved to MongoDB');
            } catch (dbError) {
                console.error('MongoDB save error:', dbError);
                // Continue even if MongoDB save fails
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
}); 