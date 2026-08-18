import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import Payment from './models/Payment.js';

mongoose.connect('mongodb+srv://23amtics402_db_user:xP5D24MTBszHnlYF@cluster0.eprscly.mongodb.net/fleetflow?appName=Cluster0')
  .then(async () => {
    const bookings = await Booking.find().lean();
    console.log("Bookings:", bookings.length);
    console.log(JSON.stringify(bookings, null, 2));
    
    const payments = await Payment.find().lean();
    console.log("Payments:", payments.length);
    console.log(JSON.stringify(payments, null, 2));
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
