import RentalRecord from '../models/RentalRecord.js';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Get all rental records
// @route   GET /api/rentals
// @access  Private/Admin/Manager
export const getRentalRecords = async (req, res, next) => {
    try {
        let records = await RentalRecord.find({})
            .populate({
                path: 'bookingId',
                populate: { path: 'vehicleId customerId' }
            })
            .populate('pickup.handledBy', 'name')
            .populate('return.handledBy', 'name');

        if (req.user.role === 'manager') {
            // Filter records to only those associated with the manager's branch
            records = records.filter(r => r.bookingId?.vehicleId?.branchId?.toString() === req.user.branchId?.toString());
        }

        res.json(records);
    } catch (error) {
        next(error);
    }
};

// @desc    Process Check-Out (Create rental record)
// @route   POST /api/rentals/checkout
// @access  Private/Admin/Manager
export const processCheckOut = async (req, res, next) => {
    try {
        const { bookingId, odometer, fuelLevel, conditionNotes } = req.body;
        
        const booking = await Booking.findById(bookingId).populate('vehicleId');
        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        if (req.user.role === 'manager' && booking.vehicleId.branchId.toString() !== req.user.branchId?.toString()) {
            res.status(403);
            throw new Error('Not authorized for this branch');
        }

        // Check if a record already exists
        const existingRecord = await RentalRecord.findOne({ bookingId });
        if (existingRecord) {
            res.status(400);
            throw new Error('Check-out already processed for this booking');
        }

        const record = new RentalRecord({
            bookingId,
            pickup: {
                date: Date.now(),
                odometer,
                fuelLevel,
                conditionNotes,
                handledBy: req.user._id
            }
        });

        await record.save();

        // Update booking status
        booking.status = 'Active';
        await booking.save();

        // Update vehicle status & odometer
        const vehicle = await Vehicle.findById(booking.vehicleId._id);
        vehicle.status = 'Active';
        vehicle.currentOdometer = odometer;
        await vehicle.save();

        res.status(201).json(record);
    } catch (error) {
        next(error);
    }
};

// @desc    Process Check-In (Update rental record)
// @route   PUT /api/rentals/checkin/:id
// @access  Private/Admin/Manager
export const processCheckIn = async (req, res, next) => {
    try {
        const { odometer, fuelLevel, conditionNotes, damageCharges, lateCharges } = req.body;
        
        const record = await RentalRecord.findById(req.params.id).populate({
            path: 'bookingId',
            populate: { path: 'vehicleId' }
        });

        if (!record) {
            res.status(404);
            throw new Error('Rental record not found');
        }

        const booking = record.bookingId;

        if (req.user.role === 'manager' && booking.vehicleId.branchId.toString() !== req.user.branchId?.toString()) {
            res.status(403);
            throw new Error('Not authorized for this branch');
        }

        record.return = {
            date: Date.now(),
            odometer,
            fuelLevel,
            conditionNotes,
            damageCharges: damageCharges || 0,
            lateCharges: lateCharges || 0,
            handledBy: req.user._id
        };

        await record.save();

        // Update booking status
        booking.status = 'Completed';
        await booking.save();

        // Update vehicle status & odometer
        const vehicle = await Vehicle.findById(booking.vehicleId._id);
        vehicle.status = 'Available';
        vehicle.currentOdometer = odometer;
        await vehicle.save();

        res.json(record);
    } catch (error) {
        next(error);
    }
};
