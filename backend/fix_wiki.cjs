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

const cars = [
    { brand: 'Tata', model: 'Nexon', wiki: 'Tata_Nexon' },
    { brand: 'Mahindra', model: 'Thar', wiki: 'Mahindra_Thar' },
    { brand: 'Hyundai', model: 'Creta', wiki: 'Hyundai_Creta' },
    { brand: 'Kia', model: 'Seltos', wiki: 'Kia_Seltos' },
    { brand: 'Honda', model: 'City', wiki: 'Honda_City' },
    { brand: 'Maruti', model: 'Eeco', wiki: 'Suzuki_Carry' }, 
    { brand: 'Volvo', model: 'XC90', wiki: 'Volvo_XC90' },
    { brand: 'Toyota', model: 'Innova', wiki: 'Toyota_Innova' },
    { brand: 'Suzuki', model: 'Swift', wiki: 'Suzuki_Swift' },
    { brand: 'Skoda', model: 'Rapid', wiki: 'Škoda_Rapid_(2011)' },
    { brand: 'MG', model: 'Hector', wiki: 'MG_Hector' },
    { brand: 'Toyota', model: 'Camry', wiki: 'Toyota_Camry' }
];

async function getWikiImage(title) {
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=800`;
        const res = await axios.get(url, { headers: { 'User-Agent': 'RentHereApp/1.0' } });
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

const fix = async () => {
    await connectDB();
    for (const car of cars) {
        const url = await getWikiImage(car.wiki);
        if (url) {
            const dbVehicle = await Vehicle.findOne({ brand: new RegExp(car.brand, 'i'), model: new RegExp(car.model, 'i') });
            if (dbVehicle) {
                dbVehicle.images = Array(4).fill(url);
                await dbVehicle.save();
                console.log(`Updated ${car.brand} ${car.model} with Wiki image: ${url}`);
            }
        } else {
            console.log(`Could not get Wiki image for ${car.brand} ${car.model}`);
        }
    }
    process.exit(0);
};

fix();
