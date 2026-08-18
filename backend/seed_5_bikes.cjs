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

    const getImg = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

    const vehicles = [
        { brand: 'Honda', model: 'Unicorn', type: 'Bike', category: 'Economy', pricePerDay: 12, depositAmount: 50, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'HN-211', branchId, images: [getImg('1558981420-c532902e58b4')], features: ['Commuter', 'Reliable'] },
        { brand: 'Royal Enfield', model: 'Continental GT 650', type: 'Bike', category: 'Premium', pricePerDay: 40, depositAmount: 150, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'RE-212', branchId, images: [getImg('1611175655325-1e08920958b4')], features: ['Cafe Racer', 'Twin Cylinder'] },
        { brand: 'Ola', model: 'S1 X', type: 'Bike', category: 'Economy', pricePerDay: 15, depositAmount: 60, fuelType: 'Electric', transmission: 'Automatic', seats: 2, registrationNumber: 'OL-213', branchId, images: [getImg('1625828859714-386d38e2d274')], features: ['Electric', 'Budget'] },
        { brand: 'Kawasaki', model: 'Z900', type: 'Bike', category: 'Premium', pricePerDay: 80, depositAmount: 300, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'KW-214', branchId, images: [getImg('1568772585407-9361fdcb8ba6')], features: ['Superbike', 'Inline 4'] },
        { brand: 'Bajaj', model: 'Platina', type: 'Bike', category: 'Economy', pricePerDay: 8, depositAmount: 30, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'BJ-215', branchId, images: [getImg('1596701859664-90aeb32883f3')], features: ['High Mileage', 'Commuter'] }
    ];

    await Vehicle.insertMany(vehicles);
    console.log('Successfully seeded 5 specific bikes');
    process.exit(0);
};

seedVehicles();
