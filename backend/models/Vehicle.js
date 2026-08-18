import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, enum: ['Car', 'Bike'], default: 'Car' },
    category: { type: String },
    registrationNumber: { type: String, required: true, unique: true },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
    transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
    seats: { type: Number, default: 4 },
    mileage: { type: Number, default: 15 }, // kmpl
    features: [{ type: String }],
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number, required: true, default: 0 },
    extraHourCharge: { type: Number, required: true, default: 0 },
    depositAmount: { type: Number, required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    images: [{ type: String }], // Array of image URLs
    status: {
        type: String,
        enum: ['Available', 'Reserved', 'Active', 'Maintenance'],
        default: 'Available'
    },
    currentOdometer: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, {
    timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
