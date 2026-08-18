const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const srcDir = 'C:\\Users\\nikhil singh\\.gemini\\antigravity\\brain\\94213e44-c5b7-4c42-849e-15e7eb978c16';
const destDir = 'c:\\Projects\\renthere\\frontend\\public\\images';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
    'skoda_car_1786259199421.jpg': 'skoda.jpg',
    'suzuki_swift_1786259214966.jpg': 'swift.jpg',
    'toyota_innova_1786259232509.jpg': 'innova.jpg',
    'volvo_xc90_1786259245444.jpg': 'xc90.jpg',
    'maruti_eeco_1786259272266.jpg': 'eeco.jpg',
    'hero_splendor_1786259286505.jpg': 'splendor.jpg',
    'royal_enfield_1786259299462.jpg': 'meteor.jpg',
    'ola_s1_1786259314593.jpg': 'ola.jpg'
};

for (const [src, dest] of Object.entries(fileMap)) {
    const srcPath = path.join(srcDir, src);
    const destPath = path.join(destDir, dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${src} to ${dest}`);
    } else {
        console.log(`Source file not found: ${srcPath}`);
    }
}

// Update DB
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
};

const Vehicle = require('./models/Vehicle.js').default;

const updateVehicles = async () => {
    await connectDB();
    await Vehicle.updateMany({ brand: { $regex: /skoda/i } }, { $set: { images: ['/images/skoda.jpg'] } });
    await Vehicle.updateMany({ brand: { $regex: /suzuki/i } }, { $set: { images: ['/images/swift.jpg'] } });
    await Vehicle.updateMany({ brand: { $regex: /toyota/i } }, { $set: { images: ['/images/innova.jpg'] } });
    await Vehicle.updateMany({ brand: { $regex: /volvo/i } }, { $set: { images: ['/images/xc90.jpg'] } });
    await Vehicle.updateMany({ brand: { $regex: /maruti/i } }, { $set: { images: ['/images/eeco.jpg'] } });
    await Vehicle.updateMany({ brand: { $regex: /hero/i } }, { $set: { images: ['/images/splendor.jpg'] } });
    await Vehicle.updateMany({ brand: { $regex: /royal enfield/i } }, { $set: { images: ['/images/meteor.jpg'] } });
    await Vehicle.updateMany({ brand: { $regex: /ola/i } }, { $set: { images: ['/images/ola.jpg'] } });
    console.log('Updated DB image URLs');
    process.exit(0);
};

updateVehicles();
