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

const destDir = 'c:/Projects/renthere/frontend/public/images/';
const srcDir = 'C:/Users/nikhil singh/.gemini/antigravity/brain/94213e44-c5b7-4c42-849e-15e7eb978c16/';

const images = [
    { src: 'honda_unicorn_1786262803712.jpg', dest: 'honda_unicorn.jpg', brand: 'Honda', model: 'Unicorn' },
    { src: 'continental_gt_1786262830916.jpg', dest: 'continental_gt.jpg', brand: 'Royal Enfield', model: 'Continental GT 650' },
    { src: 'kawasaki_z900_1786262852241.jpg', dest: 'kawasaki_z900.jpg', brand: 'Kawasaki', model: 'Z900' },
    { src: 'bajaj_platina_1786262879561.jpg', dest: 'bajaj_platina.jpg', brand: 'Bajaj', model: 'Platina' },
    { src: 'ola_s1_1786259314593.jpg', dest: 'ola_s1_x.jpg', brand: 'Ola', model: 'S1 X' }
];

const updateImages = async () => {
    await connectDB();
    
    for (const img of images) {
        const srcPath = path.join(srcDir, img.src);
        const destPath = path.join(destDir, img.dest);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${img.src} to ${img.dest}`);
            
            await Vehicle.updateOne(
                { brand: img.brand, model: img.model },
                { $set: { images: [`/images/${img.dest}`] } }
            );
            console.log(`Updated DB for ${img.brand} ${img.model}`);
        } else {
            console.log(`Warning: Source file ${srcPath} not found`);
        }
    }

    console.log('Finished updating specific bike images');
    process.exit(0);
};

updateImages();
