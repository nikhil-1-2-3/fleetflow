const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        process.exit(1);
    }
};

const Vehicle = require('./models/Vehicle.js').default;
const fleetDir = path.join(__dirname, '../frontend/public/images/fleet');

const targets = [
    { brand: 'Skoda', model: 'Rapid', q: 'skoda rapid exterior car -interior' },
    { brand: 'MG', model: 'Hector', q: 'mg hector exterior car -interior' },
    { brand: 'KTM', model: 'Duke 390', q: 'ktm duke 390 motorcycle' },
    { brand: 'Ather', model: '450X', q: 'ather 450x electric scooter' },
    { brand: 'Hero', model: 'Xpulse 200', q: 'hero xpulse 200 motorcycle' },
    { brand: 'Royal Enfield', model: 'Continental GT 650', q: 'royal enfield continental gt 650 motorcycle' },
    { brand: 'Ola', model: 'S1 X', q: 'ola s1 x electric scooter' },
    { brand: 'Bajaj', model: 'Platina', q: 'bajaj platina motorcycle' }
];

async function scrapeDDGImage(query) {
    try {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const $ = cheerio.load(res.data);
        let imgUrl = null;
        
        $('.zcm-wrap a.zcm__link').each((i, el) => {
             // We can't use HTML DDG for images easily as it routes to Bing.
        });
        
        // Actually, let's use the thumbnail from standard web search if available
        const img = $('.result__snippet img.result__icon__img').first().attr('src');
        if (img) {
            return `https:${img}`;
        }
        return null;
    } catch(e) {
        return null;
    }
}

// Fallback to local AI image if we fail
const fix = async () => {
    await connectDB();
    for (const t of targets) {
        console.log(`Fixing ${t.brand} ${t.model}...`);
        
        const fallback = t.brand === 'Skoda' || t.brand === 'MG' 
            ? '/images/fleet/toyota_camry.jpg' 
            : '/images/fleet/royal_enfield_classic_350.jpg';

        const dbVehicle = await Vehicle.findOne({ brand: new RegExp(t.brand, 'i'), model: new RegExp(t.model, 'i') });
        if (dbVehicle) {
            dbVehicle.images = Array(4).fill(fallback);
            await dbVehicle.save();
            console.log(`Updated ${t.brand} ${t.model} with fallback ${fallback}`);
        }
    }
    process.exit(0);
};

fix();
