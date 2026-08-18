import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Booking', 'Deposit', 'Refund'], required: true },
    providerPaymentId: { type: String }, // Razorpay Payment ID
    providerOrderId: { type: String }, // Razorpay Order ID
    status: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
