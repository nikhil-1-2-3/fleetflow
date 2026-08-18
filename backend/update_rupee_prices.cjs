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

const updatePrices = async () => {
    try {
        await connectDB();
        
        const db = mongoose.connection.db;
        const vehicles = await db.collection('vehicles').find({}).toArray();
        
        let count = 0;
        for (const vehicle of vehicles) {
            let pricePerDay = 4999;
            
            const isPremium = ['Porsche', 'Ferrari', 'BMW', 'Mercedes', 'Audi', 'Lamborghini', 'Bentley', 'Rolls Royce'].some(brand => vehicle.brand && vehicle.brand.includes(brand)) || 
                              ['Luxury', 'Sports', 'Premium'].includes(vehicle.category);
            
            const isLower = vehicle.type === 'Bike' || ['Economy', 'Compact'].includes(vehicle.category) || 
                            ['Honda', 'Toyota', 'Ford', 'Hyundai', 'Tata', 'Maruti'].some(brand => vehicle.brand && vehicle.brand.includes(brand));
            
            if (isPremium) {
                pricePerDay = 5999;
            } else if (isLower) {
                pricePerDay = 3999;
            } else {
                pricePerDay = 4999;
            }
            
            // User requested extra charge around 250 average.
            // Let's scale it slightly based on base price:
            // 3999 -> 200
            // 4999 -> 250
            // 5999 -> 300
            const extraHourCharge = Math.round((pricePerDay / 4999) * 250);
            const pricePerHour = extraHourCharge; // standardizing hourly rate to be same as extra hour
            const depositAmount = pricePerDay * 2; // Arbitrary deposit rule (2 days worth)
            
            await db.collection('vehicles').updateOne(
                { _id: vehicle._id },
                { $set: { pricePerDay, pricePerHour, extraHourCharge, depositAmount } }
            );
            count++;
        }
        
        console.log(`Updated ${count} vehicles with new INR prices.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updatePrices();
