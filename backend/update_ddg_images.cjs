const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
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

async function searchBingImages(query) {
    try {
        const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const images = [];

        $('a.iusc').each((i, el) => {
            const m = $(el).attr('m');
            if (m) {
                try {
                    const mData = JSON.parse(m);
                    if (mData.murl && mData.murl.match(/\.(jpeg|jpg|png)/i)) {
                        images.push(mData.murl);
                    }
                } catch (e) {}
            }
        });

        return images;
    } catch (error) {
        console.error('Error fetching Bing images:', error.message);
        return [];
    }
}

const updateImages = async () => {
    await connectDB();
    
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles`);

    for (const vehicle of vehicles) {
        if (vehicle.images && vehicle.images[0] && vehicle.images[0].includes('/images/fleet/')) {
            console.log(`Skipping ${vehicle.brand} ${vehicle.model} (has local AI image)`);
            continue;
        }

        try {
            console.log(`Searching Bing Images for ${vehicle.brand} ${vehicle.model}...`);
            
            const queries = [
                `${vehicle.brand} ${vehicle.model} car front view exterior high quality`,
                `${vehicle.brand} ${vehicle.model} car side profile high quality`,
                `${vehicle.brand} ${vehicle.model} car dashboard interior`,
                `${vehicle.brand} ${vehicle.model} car rear view`
            ];
            
            const newImages = [];
            for (let i = 0; i < queries.length; i++) {
                const images = await searchBingImages(queries[i]);
                if (images && images.length > 0) {
                    newImages.push(images[0]); // Grab the top result
                } else {
                    console.log(`No image found for query: ${queries[i]}`);
                }
                await new Promise(r => setTimeout(r, 1000)); // Delay between Bing queries
            }
            
            if (newImages.length > 0) {
                vehicle.images = newImages;
                await vehicle.save();
                console.log(`Successfully updated ${vehicle.brand} ${vehicle.model} with ${newImages.length} real images.`);
            }
            
        } catch (error) {
            console.error(`Failed to update images for ${vehicle.brand} ${vehicle.model}`, error);
        }
    }

    console.log('Finished updating vehicle images');
    process.exit(0);
};

updateImages();
