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
        // 10 Cars
        { brand: 'Honda', model: 'City', type: 'Car', category: 'Sedan', pricePerDay: 40, depositAmount: 150, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, registrationNumber: 'HN-101', branchId, images: [getImg('1553440569-1c9cd240974b')], features: ['AC', 'Bluetooth', 'Sunroof'] },
        { brand: 'Hyundai', model: 'Creta', type: 'Car', category: 'SUV', pricePerDay: 50, depositAmount: 200, fuelType: 'Diesel', transmission: 'Manual', seats: 5, registrationNumber: 'HY-102', branchId, images: [getImg('1568605117036-5fe5e7bab0b7')], features: ['AC', 'Spacious'] },
        { brand: 'Tata', model: 'Nexon', type: 'Car', category: 'SUV', pricePerDay: 45, depositAmount: 150, fuelType: 'Electric', transmission: 'Automatic', seats: 5, registrationNumber: 'TA-103', branchId, images: [getImg('1492144534655-ae79c964c9d7')], features: ['AC', 'Electric'] },
        { brand: 'Mahindra', model: 'Thar', type: 'Car', category: 'SUV', pricePerDay: 60, depositAmount: 250, fuelType: 'Diesel', transmission: 'Manual', seats: 4, registrationNumber: 'MH-104', branchId, images: [getImg('1533473359331-0135ef1b58bf')], features: ['4x4', 'Offroad'] },
        { brand: 'Kia', model: 'Seltos', type: 'Car', category: 'SUV', pricePerDay: 55, depositAmount: 200, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, registrationNumber: 'KI-105', branchId, images: [getImg('1503376713356-f1559868f780')], features: ['AC', 'Bluetooth'] },
        { brand: 'Ford', model: 'Endeavour', type: 'Car', category: 'SUV', pricePerDay: 90, depositAmount: 400, fuelType: 'Diesel', transmission: 'Automatic', seats: 7, registrationNumber: 'FD-106', branchId, images: [getImg('1502877338535-773905fc9bea')], features: ['AC', 'Luxury'] },
        { brand: 'Jeep', model: 'Compass', type: 'Car', category: 'SUV', pricePerDay: 80, depositAmount: 300, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, registrationNumber: 'JP-107', branchId, images: [getImg('1519641471654-76ce0107ad1b')], features: ['AC', 'Premium'] },
        { brand: 'Renault', model: 'Kiger', type: 'Car', category: 'SUV', pricePerDay: 35, depositAmount: 100, fuelType: 'Petrol', transmission: 'Manual', seats: 5, registrationNumber: 'RN-108', branchId, images: [getImg('1494976388531-d1058494cdd8')], features: ['AC', 'Budget'] },
        { brand: 'Nissan', model: 'Magnite', type: 'Car', category: 'SUV', pricePerDay: 35, depositAmount: 100, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, registrationNumber: 'NS-109', branchId, images: [getImg('1550355291-bbee04aed9c2')], features: ['AC', 'Compact'] },
        { brand: 'MG', model: 'Hector', type: 'Car', category: 'SUV', pricePerDay: 65, depositAmount: 250, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, registrationNumber: 'MG-110', branchId, images: [getImg('1542362567-b07e54358753')], features: ['AC', 'Smart'] },

        // 10 Bikes
        { brand: 'Bajaj', model: 'Pulsar 150', type: 'Bike', category: 'Economy', pricePerDay: 12, depositAmount: 50, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'BJ-201', branchId, images: [getImg('1558981420-c532902e58b4')], features: ['Sporty'] },
        { brand: 'TVS', model: 'Apache RTR', type: 'Bike', category: 'Economy', pricePerDay: 15, depositAmount: 60, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'TV-202', branchId, images: [getImg('1558981285-6f0c94958bb6')], features: ['Racing'] },
        { brand: 'Honda', model: 'Activa 6G', type: 'Bike', category: 'Economy', pricePerDay: 10, depositAmount: 40, fuelType: 'Petrol', transmission: 'Automatic', seats: 2, registrationNumber: 'HN-203', branchId, images: [getImg('1596701859664-90aeb32883f3')], features: ['Scooter'] },
        { brand: 'Yamaha', model: 'R15 V4', type: 'Bike', category: 'Premium', pricePerDay: 25, depositAmount: 100, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'YM-204', branchId, images: [getImg('1568772585407-9361fdcb8ba6')], features: ['Sports'] },
        { brand: 'KTM', model: 'Duke 390', type: 'Bike', category: 'Premium', pricePerDay: 35, depositAmount: 150, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'KT-205', branchId, images: [getImg('1599813295822-0cc6323c6c11')], features: ['Street'] },
        { brand: 'Ather', model: '450X', type: 'Bike', category: 'Premium', pricePerDay: 18, depositAmount: 80, fuelType: 'Electric', transmission: 'Automatic', seats: 2, registrationNumber: 'AT-206', branchId, images: [getImg('1625828859714-386d38e2d274')], features: ['Electric', 'Smart'] },
        { brand: 'Suzuki', model: 'Access 125', type: 'Bike', category: 'Economy', pricePerDay: 12, depositAmount: 40, fuelType: 'Petrol', transmission: 'Automatic', seats: 2, registrationNumber: 'SZ-207', branchId, images: [getImg('1611175655325-1e08920958b4')], features: ['Scooter'] },
        { brand: 'Hero', model: 'Xpulse 200', type: 'Bike', category: 'Economy', pricePerDay: 20, depositAmount: 80, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'HR-208', branchId, images: [getImg('1605337227441-df0eb0385fc8')], features: ['Offroad'] },
        { brand: 'Royal Enfield', model: 'Classic 350', type: 'Bike', category: 'Premium', pricePerDay: 30, depositAmount: 120, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'RE-209', branchId, images: [getImg('1558981806-ec527fa84c39')], features: ['Cruiser'] },
        { brand: 'Jawa', model: '42', type: 'Bike', category: 'Premium', pricePerDay: 28, depositAmount: 100, fuelType: 'Petrol', transmission: 'Manual', seats: 2, registrationNumber: 'JW-210', branchId, images: [getImg('1590457682220-334da4656ec9')], features: ['Retro'] }
    ];

    await Vehicle.insertMany(vehicles);
    console.log('Successfully seeded 20 more vehicles');
    process.exit(0);
};

seedVehicles();
