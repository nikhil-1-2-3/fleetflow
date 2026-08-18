import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

mongoose.connect('mongodb+srv://23amtics402_db_user:xP5D24MTBszHnlYF@cluster0.eprscly.mongodb.net/fleetflow?appName=Cluster0')
  .then(async () => {
    const admin = await User.findOne({ role: 'admin' });
    console.log("Admin email:", admin?.email);
    if (admin) {
        const token = jwt.sign({ userId: admin._id }, 'supersecretjwtkeyforfleetflowdevelopment', { expiresIn: '30d' });
        console.log("Admin token:", token);
    }
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
