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
const Branch = require('./models/Branch.js').default;

const seedVehicles = async () => {
    await connectDB();
    const branch = await Branch.findOne();
    const branchId = branch ? branch._id : '6a777604281aa1e6a25284b1';

    // Update Skoda
    await Vehicle.updateMany({ brand: { $regex: /skoda/i } }, { $set: { images: ['https://upload.wikimedia.org/wikipedia/commons/4/4b/2020_Skoda_Octavia_SE_L_First_Edition_TSI_1.5_Front.jpg'] } });

    const vehicles = [
        { brand: 'Suzuki', model: 'Swift', type: 'Car', category: 'Economy', pricePerDay: 30, depositAmount: 100, fuelType: 'Petrol', transmission: 'Manual', seats: 5, registrationNumber: 'SZ-101', branchId, images: ['https://upload.wikimedia.org/wikipedia/commons/e/e0/2017_Suzuki_Swift_GLX_1.0_Front.jpg'], features: ['AC', 'Bluetooth'] },
        { brand: 'Toyota', model: 'Innova', type: 'Car', category: 'SUV', pricePerDay: 70, depositAmount: 200, fuelType: 'Diesel', transmission: 'Automatic', seats: 7, registrationNumber: 'IN-202', branchId, images: ['https://upload.wikimedia.org/wikipedia/commons/2/23/2023_Toyota_Kijang_Innova_Zenix_2.0_V_AG10_%2820230531%29.jpg'], features: ['AC', 'Spacious', 'Captain Seats'] },
        { brand: 'Volvo', model: 'XC90', type: 'Car', category: 'Luxury', pricePerDay: 150, depositAmount: 500, fuelType: 'Hybrid', transmission: 'Automatic', seats: 7, registrationNumber: 'VL-303', branchId, images: ['https://upload.wikimedia.org/wikipedia/commons/c/c8/Volvo_XC90_T8_Twin_Engine_AWD_R-Design_%28II%29_%E2%80%93_Frontansicht%2C_28._August_2016%2C_M%C3%BCnster.jpg'], features: ['Panoramic Sunroof', 'Premium Audio', 'AWD'] },
        { brand: 'Maruti', model: 'Eeco', type: 'Car', category: 'Economy', pricePerDay: 25, depositAmount: 100, fuelType: 'Petrol', transmission: 'Manual', seats: 5, registrationNumber: 'EC-404', branchId, images: ['https://upload.wikimedia.org/wikipedia/commons/c/c1/Suzuki_Every_001.JPG'], features: ['Basic', 'High Utility'] },
        { brand: 'Hero', model: 'Splendor Plus', type: 'Bike', category: 'Economy', pricePerDay: 10, depositAmount: 50, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'SP-505', branchId, images: ['https://upload.wikimedia.org/wikipedia/commons/9/91/Hero_Honda_Splendor.jpg'], features: ['High Mileage', 'Lightweight'] },
        { brand: 'Royal Enfield', model: 'Meteor 350', type: 'Bike', category: 'Premium', pricePerDay: 25, depositAmount: 100, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'RE-606', branchId, images: ['https://upload.wikimedia.org/wikipedia/commons/d/df/Royal_Enfield_Meteor_350_Fireball_Yellow.jpg'], features: ['Cruiser', 'Navigation'] },
        { brand: 'Ola', model: 'S1 Pro', type: 'Bike', category: 'Premium', pricePerDay: 20, depositAmount: 80, fuelType: 'Electric', transmission: 'Automatic', seats: 2, registrationNumber: 'OL-707', branchId, images: ['https://upload.wikimedia.org/wikipedia/commons/e/ee/Ola_S1_Pro_Electric_Scooter.jpg'], features: ['Electric', 'Touchscreen'] }
    ];

    await Vehicle.insertMany(vehicles);
    console.log('Successfully seeded vehicles');
    process.exit(0);
};

seedVehicles();
