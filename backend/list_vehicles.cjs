require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI).then(async () => {
    const vehicles = await require('./models/Vehicle.js').default.find({});
    console.log(vehicles.map((v, i) => `${i+1}. ${v.brand} ${v.model}`).join('\n'));
    process.exit(0);
});
