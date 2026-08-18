import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Payment from '../models/Payment.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res, next) => {
    try {
        const { vehicleId, branchId, startDate, endDate, totalAmount, depositAmount } = req.body;

        if (!vehicleId || !branchId || !startDate || !endDate) {
            res.status(400);
            throw new Error('Please provide all required booking details');
        }

        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            res.status(404);
            throw new Error('Vehicle not found');
        }

        // Check for overlapping bookings in the date range
        const requestedStart = new Date(startDate);
        const requestedEnd = new Date(endDate);

        const overlappingBooking = await Booking.findOne({
            vehicleId,
            status: { $nin: ['Cancelled', 'Rejected', 'Completed'] },
            $and: [
                { startDate: { $lt: requestedEnd } },
                { endDate: { $gt: requestedStart } }
            ]
        });

        if (overlappingBooking) {
            res.status(400);
            throw new Error('This vehicle is already reserved for the selected dates');
        }
        const booking = new Booking({
            customerId: req.user._id,
            vehicleId,
            branchId,
            startDate,
            endDate,
            totalAmount,
            depositAmount,
            status: 'Pending'
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private (Customer)
export const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ customerId: req.user._id })
            .populate('vehicleId', 'brand model images')
            .populate('branchId', 'name location')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings (Admin/Manager)
// @route   GET /api/bookings
// @access  Private (Admin/Manager)
export const getBookings = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user.role === 'manager') {
            filter.branchId = req.user.branchId;
        }

        const bookings = await Booking.find(filter)
            .populate('customerId', 'name email phone')
            .populate('vehicleId', 'brand model registrationNumber')
            .populate('branchId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        // Fetch payments for these bookings
        const payments = await Payment.find({ bookingId: { $in: bookings.map(b => b._id) } });

        const bookingsWithPayments = bookings.map(booking => {
            const payment = payments.find(p => p.bookingId.toString() === booking._id.toString());
            return { ...booking, payment };
        });

        res.json(bookingsWithPayments);
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin/Manager)
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            if (req.user.role === 'manager' && booking.branchId.toString() !== req.user.branchId?.toString()) {
                res.status(403);
                throw new Error('Not authorized for this branch');
            }

            booking.status = status;
            const updatedBooking = await booking.save();

            // If approved, maybe update vehicle status to Reserved
            if (status === 'Approved') {
                await Vehicle.findByIdAndUpdate(booking.vehicleId, { status: 'Reserved' });
            } else if (status === 'Completed' || status === 'Cancelled' || status === 'Rejected') {
                 await Vehicle.findByIdAndUpdate(booking.vehicleId, { status: 'Available' });
            }

            res.json(updatedBooking);
        } else {
            res.status(404);
            throw new Error('Booking not found');
        }
    } catch (error) {
        next(error);
    }
};
