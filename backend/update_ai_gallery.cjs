const fs = require('fs');
const path = require('path');
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
const fleetDir = path.join(__dirname, '../frontend/public/images/fleet');

const updateDB = async () => {
    await connectDB();
    
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles to process.`);

    for (const vehicle of vehicles) {
        // Create expected filename: lowercase, replace non-alphanumeric with underscore, remove duplicate underscores
        const sanitizedBrand = vehicle.brand.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const sanitizedModel = vehicle.model.toLowerCase().replace(/[^a-z0-9]/g, '_');
        let expectedName = `${sanitizedBrand}_${sanitizedModel}`.replace(/_+/g, '_').replace(/_$/, '');
        
        // Some manual adjustments just in case subagents simplify names
        if (expectedName === 'skoda__rapid') expectedName = 'skoda_rapid';

        const expectedFile = `${expectedName}.jpg`;
        const expectedPath = path.join(fleetDir, expectedFile);
        
        if (fs.existsSync(expectedPath)) {
            // Found the locally generated image
            vehicle.images = [`/images/fleet/${expectedFile}`];
            await vehicle.save();
            console.log(`Updated ${vehicle.brand} ${vehicle.model} with local image: /images/fleet/${expectedFile}`);
        } else {
            console.log(`Waiting on image for ${vehicle.brand} ${vehicle.model} (Expected: ${expectedFile})`);
        }
    }

    console.log('Finished updating DB with local gallery images.');
    process.exit(0);
};

updateDB();
