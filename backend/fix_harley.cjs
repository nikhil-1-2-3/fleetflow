const mongoose = require('mongoose');
require('dotenv').config();
const Vehicle = require('./models/Vehicle.js').default;

const fixHarley = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Vehicle.updateMany({ brand: { $regex: /harley/i } }, { $set: { type: 'Bike' } });
    console.log(`Updated ${result.modifiedCount} Harley vehicles`);
    
    // Check total bikes count
    const bikesCount = await Vehicle.countDocuments({ type: 'Bike' });
    console.log(`Total bikes now: ${bikesCount}`);
    
    process.exit(0);
};
fixHarley();
