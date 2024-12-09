const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/iot-dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
    console.log('Connection Details:', {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
    });
    
    // Create a test document
    const TestModel = mongoose.model('Test', new mongoose.Schema({
        name: String,
        date: { type: Date, default: Date.now }
    }));

    return TestModel.create({ name: 'test' });
})
.then((doc) => {
    console.log('Successfully created test document:', doc);
    process.exit(0);
})
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
}); 