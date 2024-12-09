const WebSocket = require('ws');

class SensorSimulator {
    constructor(wsUrl = 'ws://localhost:5000') {
        this.ws = new WebSocket(wsUrl);
        this.sensorIds = ['TEMP001', 'HUM001', 'PRESS001'];
        this.interval = null;
    }

    start() {
        this.ws.on('open', () => {
            console.log('Connected to WebSocket server');
            this.interval = setInterval(() => {
                this.generateAndSendData();
            }, 2000); // Generate data every 2 seconds
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    generateAndSendData() {
        const sensorId = this.sensorIds[Math.floor(Math.random() * this.sensorIds.length)];
        let data;

        switch (sensorId) {
            case 'TEMP001':
                data = {
                    sensorId,
                    type: 'temperature',
                    value: 20 + Math.random() * 10, // Random temperature between 20-30°C
                    unit: '°C'
                };
                break;
            case 'HUM001':
                data = {
                    sensorId,
                    type: 'humidity',
                    value: 30 + Math.random() * 40, // Random humidity between 30-70%
                    unit: '%'
                };
                break;
            case 'PRESS001':
                data = {
                    sensorId,
                    type: 'pressure',
                    value: 980 + Math.random() * 40, // Random pressure between 980-1020 hPa
                    unit: 'hPa'
                };
                break;
        }

        this.ws.send(JSON.stringify(data));
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.ws.close();
    }
}

module.exports = SensorSimulator; 