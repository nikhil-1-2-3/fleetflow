import mongoose from 'mongoose';

const rentalRecordSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    pickup: {
        date: Date,
        odometer: Number,
        fuelLevel: String, // e.g., "Full", "3/4", "Half", "1/4", "Empty"
        conditionNotes: String,
        handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Manager/Employee
    },
    return: {
        date: Date,
        odometer: Number,
        fuelLevel: String,
        conditionNotes: String,
        damageCharges: { type: Number, default: 0 },
        lateCharges: { type: Number, default: 0 },
        handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
}, {
    timestamps: true
});

const RentalRecord = mongoose.model('RentalRecord', rentalRecordSchema);

export default RentalRecord;
