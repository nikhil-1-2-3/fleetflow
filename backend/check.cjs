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

const check = async () => {
    await connectDB();
    const v = await Vehicle.find({model: {$in: [new RegExp('Camry', 'i'), new RegExp('Rapid', 'i'), new RegExp('Hector', 'i')]}});
    console.log(JSON.stringify(v.map(x => ({model: x.model, images: x.images})), null, 2));
    process.exit(0);
};
check();
