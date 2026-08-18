const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

const Vehicle = require('./models/Vehicle.js').default;
const fleetDir = path.join(__dirname, '../frontend/public/images/fleet');

const itemsToFix = [
    { brand: 'Skoda', model: 'Rapid', wiki: 'Škoda_Rapid_(2011)' },
    { brand: 'MG', model: 'Hector', wiki: 'MG_Hector' },
    { brand: 'Bajaj', model: 'Pulsar 150', wiki: 'Bajaj_Pulsar' },
    { brand: 'TVS', model: 'Apache RTR', wiki: 'TVS_Apache' },
    { brand: 'Honda', model: 'Activa 6G', wiki: 'Honda_Activa' },
    { brand: 'Yamaha', model: 'R15 V4', wiki: 'Yamaha_YZF-R15' },
    { brand: 'KTM', model: 'Duke 390', wiki: 'KTM_390_series' },
    { brand: 'Ather', model: '450X', wiki: 'Ather_Energy' },
    { brand: 'Suzuki', model: 'Access 125', wiki: 'Suzuki_Access_125' },
    { brand: 'Hero', model: 'Xpulse 200', wiki: 'Hero_Motocorp' },
    { brand: 'Jawa', model: '42', wiki: 'Jawa_Moto' },
    { brand: 'Honda', model: 'Unicorn', wiki: 'Honda_Unicorn' },
    { brand: 'Royal Enfield', model: 'Continental GT 650', wiki: 'Royal_Enfield_Interceptor_650' },
    { brand: 'Ola', model: 'S1 X', wiki: 'Ola_Electric' },
    { brand: 'Kawasaki', model: 'Z900', wiki: 'Kawasaki_Z900' },
    { brand: 'Bajaj', model: 'Platina', wiki: 'Bajaj_Platina' },
    { brand: 'Royal Enfield', model: 'Meteor 350', wiki: 'Royal_Enfield_Meteor' },
    { brand: 'Ola', model: 'S1 Pro', wiki: 'Ola_Electric' },
];

async function getWikiImage(title) {
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=1000`;
        const res = await axios.get(url, { headers: { 'User-Agent': 'RentHereApp/1.0 (nikhil@example.com)' } });
        const pages = res.data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== '-1' && pages[pageId].thumbnail) {
            return pages[pageId].thumbnail.source;
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function downloadImage(url, filename) {
    const p = path.join(fleetDir, filename);
    const writer = fs.createWriteStream(p);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

const fixAll = async () => {
    await connectDB();
    if (!fs.existsSync(fleetDir)){
        fs.mkdirSync(fleetDir, { recursive: true });
    }

    for (const item of itemsToFix) {
        try {
            console.log(`Processing ${item.brand} ${item.model}...`);
            const url = await getWikiImage(item.wiki);
            if (url) {
                const filename = `${item.brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${item.model.toLowerCase().replace(/[^a-z0-9]/g, '_')}_wiki.jpg`;
                await downloadImage(url, filename);
                console.log(`Downloaded image for ${item.brand} ${item.model}`);

                const dbVehicle = await Vehicle.findOne({ 
                    brand: new RegExp(`^${item.brand}$`, 'i'), 
                    model: new RegExp(`^${item.model}$`, 'i') 
                });
                
                if (dbVehicle) {
                    dbVehicle.images = Array(4).fill(`/images/fleet/${filename}`);
                    await dbVehicle.save();
                    console.log(`Updated DB for ${item.brand} ${item.model} with local file /images/fleet/${filename}`);
                }
            } else {
                console.log(`Could not find wiki image for ${item.wiki}`);
            }
        } catch (error) {
            console.error(`Error on ${item.brand} ${item.model}:`, error.message);
        }
    }
    
    console.log('Finished fixing all bikes and cars.');
    process.exit(0);
};

fixAll();
