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

const backfill = async () => {
    await connectDB();
    
    const vehicles = await Vehicle.find({});
    
    for (const v of vehicles) {
        if (v.type === 'Bike') {
            v.seats = 2;
            v.mileage = v.fuelType === 'Electric' ? 120 : Math.floor(Math.random() * (60 - 35 + 1)) + 35; // 35-60 kmpl for bikes
            v.features = ['Helmet Included', 'First Aid Kit'];
        } else {
            v.seats = ['Endeavour', 'Innova', 'Hector', 'Thar'].some(n => v.model.includes(n)) ? 7 : 5;
            v.mileage = v.fuelType === 'Electric' ? 400 : Math.floor(Math.random() * (22 - 12 + 1)) + 12; // 12-22 kmpl for cars
            v.features = ['AC', 'Bluetooth', 'Airbags', 'GPS'];
        }
        await v.save();
    }
    
    console.log('Backfilled stats for all vehicles');
    process.exit(0);
};

backfill();
