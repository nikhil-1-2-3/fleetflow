import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import sendEmail from '../utils/email.js';

const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// @desc    Get Razorpay Key
// @route   GET /api/payments/key
// @access  Private
export const getRazorpayKey = (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const { amount, bookingId, type } = req.body;

        const options = {
            amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: 'INR',
            receipt: `receipt_order_${bookingId}`,
        };

        let order;
        if (process.env.RAZORPAY_KEY_SECRET === 'mockedsecret') {
            order = { id: `order_mock_${Date.now()}`, amount: options.amount, currency: 'INR' };
        } else {
            const razorpay = getRazorpayInstance();
            order = await razorpay.orders.create(options);
        }

        // Record pending payment in DB
        const payment = new Payment({
            bookingId,
            userId: req.user._id,
            amount,
            type,
            providerOrderId: order.id,
            status: 'Pending'
        });
        await payment.save();

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign || process.env.RAZORPAY_KEY_SECRET === 'mockedsecret') {
            // Find payment and update
            const payment = await Payment.findOne({ providerOrderId: razorpay_order_id });
            if (payment) {
                payment.providerPaymentId = razorpay_payment_id;
                payment.status = 'Paid';
                await payment.save();

                // If it's a booking payment, update booking status
                if (payment.type === 'Booking') {
                    const booking = await Booking.findByIdAndUpdate(payment.bookingId, { isPaid: true }).populate('vehicleId');
                    
                    // Send Email Receipt
                    try {
                        await sendEmail({
                            email: req.user.email,
                            subject: 'FleetFlow - Payment Receipt',
                            message: `Your payment of ₹${payment.amount} for the ${booking?.vehicleId?.brand} ${booking?.vehicleId?.model} was successful! Your booking is confirmed.\n\nIMPORTANT: You MUST bring your original Aadhar card and last month's electricity bill to the center for security verification before vehicle handover.`
                        });
                    } catch (emailErr) {
                        console.error('Failed to send receipt email', emailErr);
                    }
                }

                res.status(200).json({ message: "Payment verified successfully" });
            } else {
                res.status(404);
                throw new Error('Payment record not found');
            }
        } else {
            res.status(400);
            throw new Error('Invalid signature sent!');
        }
    } catch (error) {
        next(error);
    }
};
