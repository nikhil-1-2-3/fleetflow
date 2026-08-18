const mongoose = require('mongoose');
const google = require('googlethis');
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

const updateImages = async () => {
    await connectDB();
    
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles`);

    for (const vehicle of vehicles) {
        // Only update if we don't have exactly 4 images, or if user forces an update.
        if (vehicle.images && vehicle.images.length >= 4) {
            console.log(`Skipping ${vehicle.brand} ${vehicle.model} (already has 4+ images)`);
            continue;
        }

        try {
            console.log(`Searching for 4 images for ${vehicle.brand} ${vehicle.model}...`);
            const queries = [
                `${vehicle.brand} ${vehicle.model} car front view exterior high quality`,
                `${vehicle.brand} ${vehicle.model} car side profile high quality`,
                `${vehicle.brand} ${vehicle.model} car dashboard interior`,
                `${vehicle.brand} ${vehicle.model} car rear view`
            ];
            
            const newImages = [];
            for (let i = 0; i < queries.length; i++) {
                const images = await google.image(queries[i], { safe: false });
                if (images && images.length > 0) {
                    // Try to find a good quality jpg/png, avoiding very small icons if possible
                    const goodImg = images.find(img => img.url.match(/\.(jpeg|jpg|png)/i) && img.width > 400) || images[0];
                    newImages.push(goodImg.url);
                }
                // Short delay between searches
                await new Promise(r => setTimeout(r, 500));
            }
            
            if (newImages.length > 0) {
                vehicle.images = newImages;
                await vehicle.save();
                console.log(`Successfully updated ${vehicle.brand} ${vehicle.model} with ${newImages.length} images.`);
            }
        } catch (error) {
            console.error(`Failed to get images for ${vehicle.brand} ${vehicle.model}`, error);
        }
        
        // Wait 2 seconds between vehicles to avoid rate limiting
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('Finished updating vehicle images');
    process.exit(0);
};

updateImages();
