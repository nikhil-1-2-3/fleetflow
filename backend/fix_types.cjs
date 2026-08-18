const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

const Vehicle = require('./models/Vehicle.js').default;

const fixTypes = async () => {
    await connectDB();
    
    // Default all existing to Car
    await Vehicle.updateMany({ type: { $exists: false } }, { $set: { type: 'Car' } });

    // Explicitly set bikes
    const bikeBrands = ['Hero', 'Royal Enfield', 'Ola', 'Bajaj', 'TVS', 'Yamaha', 'KTM', 'Ather', 'Jawa'];
    await Vehicle.updateMany({ brand: { $in: bikeBrands } }, { $set: { type: 'Bike' } });
    
    // Handle Honda Activa & Suzuki Access
    await Vehicle.updateMany({ model: { $regex: /Activa|Access/i } }, { $set: { type: 'Bike' } });

    console.log('Successfully fixed vehicle types');
    process.exit(0);
};

fixTypes();
