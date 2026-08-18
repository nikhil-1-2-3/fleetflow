import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceDate: { type: Date, required: true },
    cost: { type: Number, required: true },
    description: { type: String, required: true },
    serviceCenter: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled' }
}, {
    timestamps: true
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
