const fs = require('fs');
const path = require('path');
const axios = require('axios');
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
const destDir = path.join(__dirname, '../frontend/public/images/fleet');

const specificCars = [
    { brand: 'Tata', model: 'Nexon', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/2023_Tata_Nexon_Creative_%28facelift%29%2C_front_view.jpg' },
    { brand: 'Mahindra', model: 'Thar', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/2021_Mahindra_Thar_LX_front_view.png' },
    { brand: 'Hyundai', model: 'Creta', url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/2024_Hyundai_Creta_Alpha_%28facelift%29.jpg' },
    { brand: 'Kia', model: 'Seltos', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Kia_Seltos_1.6_EX_2020_%2850406856512%29.jpg' },
    { brand: 'Honda', model: 'City', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/2020_Honda_City_1.5_RS_sedan_%28GN5%29_%2820210212%29.jpg' },
    { brand: 'Maruti', model: 'Eeco', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/2022_Maruti_Suzuki_Eeco_5-seater_AC_%28India%29_front_view.png' },
    { brand: 'Volvo', model: 'XC90', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Volvo_XC90_T8_Twin_Engine_AWD_Inscription_%28II%29_%E2%80%93_Frontansicht%2C_8._April_2017%2C_D%C3%BCsseldorf.jpg' },
    { brand: 'Toyota', model: 'Innova', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/2023_Toyota_Innova_Zenix_2.0_V_%28MAG10R%29%2C_front_view.jpg' },
    { brand: 'Suzuki', model: 'Swift', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/2024_Suzuki_Swift_Hybrid_MZ_front.jpg' },
    { brand: 'Skoda', model: 'Rapid', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Skoda_Rapid_%28India%29.jpg' },
    { brand: 'MG', model: 'Hector', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/MG_Hector_Sharp_Pro_Facelift_Front_View.jpg' },
    { brand: 'Toyota', model: 'Camry', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg' }
];

async function downloadImage(url, filename) {
    const p = path.join(destDir, filename);
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

const runFix = async () => {
    await connectDB();
    
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir, { recursive: true });
    }

    for (const car of specificCars) {
        try {
            console.log(`Fixing ${car.brand} ${car.model}...`);
            const ext = car.url.endsWith('.png') ? '.png' : '.jpg';
            const filename = `${car.brand.toLowerCase()}_${car.model.toLowerCase().replace(/ /g, '_')}_fix${ext}`;
            
            await downloadImage(car.url, filename);
            console.log(`Downloaded image to ${filename}`);
            
            // Allow matching "Skoda" and "Skoda "
            const dbVehicle = await Vehicle.findOne({ 
                brand: new RegExp(car.brand, 'i'), 
                model: new RegExp(car.model, 'i') 
            });
            
            if (dbVehicle) {
                // Duplicate the 1 good image 4 times to fill the gallery so it doesn't crash or look empty
                dbVehicle.images = Array(4).fill(`/images/fleet/${filename}`);
                await dbVehicle.save();
                console.log(`Updated DB for ${car.brand} ${car.model}`);
            } else {
                console.log(`Could not find ${car.brand} ${car.model} in DB`);
            }
        } catch (error) {
            console.error(`Error fixing ${car.brand} ${car.model}:`, error.message);
        }
    }
    
    console.log('Finished fixing specified cars.');
    process.exit(0);
};

runFix();
