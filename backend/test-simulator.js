const SensorSimulator = require('./utils/sensorSimulator');

const simulator = new SensorSimulator();
simulator.start();

// Stop the simulator after 1 minute
setTimeout(() => {
    simulator.stop();
    process.exit(0);
}, 60000); 