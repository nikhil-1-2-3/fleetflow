const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const updateRates = async () => {
    try {
        await connectDB();
        
        const db = mongoose.connection.db;
        const vehicles = await db.collection('vehicles').find({}).toArray();
        
        let count = 0;
        for (const vehicle of vehicles) {
            const pricePerDay = vehicle.pricePerDay;
            const pricePerHour = Math.round(pricePerDay / 12);
            const extraHourCharge = Math.round(pricePerHour * 1.5);
            
            await db.collection('vehicles').updateOne(
                { _id: vehicle._id },
                { $set: { pricePerHour, extraHourCharge } }
            );
            count++;
        }
        
        console.log(`Updated ${count} vehicles with hourly rates.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateRates();
