import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Branch from './models/Branch.js';
import Vehicle from './models/Vehicle.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Branch.deleteMany();
        await Vehicle.deleteMany();

        // 1. Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@fleetflow.com',
            password: 'password123',
            role: 'admin',
            phone: '1234567890'
        });

        // 2. Create a Branch
        const mainBranch = await Branch.create({
            name: 'Downtown Main Branch',
            location: {
                address: '123 Main St',
                city: 'Metropolis',
                state: 'NY',
                zipCode: '10001'
            },
            managerId: adminUser._id,
            contactInfo: {
                phone: '123-456-7890',
                email: 'downtown@fleetflow.com'
            }
        });

        // 3. Create Vehicles (Cars and Bikes)
        const vehicles = [
            {
                brand: 'Tesla',
                model: 'Model 3',
                registrationNumber: 'EV-2024-01',
                fuelType: 'Electric',
                transmission: 'Automatic',
                pricePerDay: 85,
                depositAmount: 500,
                branchId: mainBranch._id,
                images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                status: 'Available'
            },
            {
                brand: 'Toyota',
                model: 'Camry',
                registrationNumber: 'TC-2023-45',
                fuelType: 'Petrol',
                transmission: 'Automatic',
                pricePerDay: 45,
                depositAmount: 200,
                branchId: mainBranch._id,
                images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                status: 'Available'
            },
            {
                brand: 'Harley-Davidson',
                model: 'Iron 883',
                registrationNumber: 'HD-M-883',
                fuelType: 'Petrol',
                transmission: 'Manual',
                pricePerDay: 60,
                depositAmount: 300,
                branchId: mainBranch._id,
                images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                status: 'Available'
            },
            {
                brand: 'Royal Enfield',
                model: 'Classic 350',
                registrationNumber: 'RE-C-350',
                fuelType: 'Petrol',
                transmission: 'Manual',
                pricePerDay: 30,
                depositAmount: 150,
                branchId: mainBranch._id,
                images: ['https://images.unsplash.com/photo-1599819811279-d9b8f6281c72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                status: 'Available'
            }
        ];

        await Vehicle.insertMany(vehicles);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
