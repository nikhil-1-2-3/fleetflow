import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    contactInfo: {
        phone: String,
        email: String
    }
}, {
    timestamps: true
});

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
