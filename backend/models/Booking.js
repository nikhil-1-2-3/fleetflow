import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentId: { type: String }, // Provider payment ID (Razorpay)
    isPaid: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
