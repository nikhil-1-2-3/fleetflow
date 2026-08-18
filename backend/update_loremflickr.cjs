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

const updateLoremFlickr = async () => {
    await connectDB();
    
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles`);

    for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        // Skip ones we already have good images for (local images)
        if (vehicle.images && vehicle.images[0] && vehicle.images[0].startsWith('/images/')) {
            continue;
        }

        // For the generic unsplash ones, let's replace with LoremFlickr
        const keyword1 = vehicle.type === 'Bike' ? 'motorcycle' : 'car';
        const keyword2 = vehicle.brand.toLowerCase().replace(/ /g, ''); // e.g. 'honda', 'royalenfield'
        
        // lock parameter keeps the image fixed based on an integer ID
        const lockId = 1000 + i; 
        const newUrl = `https://loremflickr.com/800/600/${keyword1},${keyword2}?lock=${lockId}`;
        
        vehicle.images = [newUrl];
        await vehicle.save();
        console.log(`Updated ${vehicle.brand} ${vehicle.model} -> ${newUrl}`);
    }

    console.log('Finished updating generic vehicle images to LoremFlickr');
    process.exit(0);
};

updateLoremFlickr();
