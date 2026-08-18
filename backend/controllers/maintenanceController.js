import Maintenance from '../models/Maintenance.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private/Admin/Manager
export const getMaintenanceRecords = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user.role === 'manager') {
            // Need to find vehicles for this manager's branch
            const vehicles = await Vehicle.find({ branchId: req.user.branchId }).select('_id');
            const vehicleIds = vehicles.map(v => v._id);
            filter = { vehicleId: { $in: vehicleIds } };
        }
        const records = await Maintenance.find(filter).populate('vehicleId', 'brand model registrationNumber branchId');
        res.json(records);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a maintenance record
// @route   POST /api/maintenance
// @access  Private/Admin/Manager
export const createMaintenanceRecord = async (req, res, next) => {
    try {
        const { vehicleId } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            res.status(404);
            throw new Error('Vehicle not found');
        }

        if (req.user.role === 'manager' && vehicle.branchId.toString() !== req.user.branchId?.toString()) {
            res.status(403);
            throw new Error('Not authorized for this branch');
        }

        const record = new Maintenance(req.body);
        const createdRecord = await record.save();

        // If status is Scheduled or In Progress, mark vehicle as Maintenance
        if (record.status !== 'Completed') {
            vehicle.status = 'Maintenance';
            await vehicle.save();
        }

        res.status(201).json(createdRecord);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a maintenance record
// @route   PUT /api/maintenance/:id
// @access  Private/Admin/Manager
export const updateMaintenanceRecord = async (req, res, next) => {
    try {
        const record = await Maintenance.findById(req.params.id).populate('vehicleId');
        
        if (!record) {
            res.status(404);
            throw new Error('Record not found');
        }

        if (req.user.role === 'manager' && record.vehicleId.branchId.toString() !== req.user.branchId?.toString()) {
            res.status(403);
            throw new Error('Not authorized for this branch');
        }

        Object.assign(record, req.body);
        const updatedRecord = await record.save();

        // Handle Vehicle Status update
        const vehicle = await Vehicle.findById(record.vehicleId._id);
        if (updatedRecord.status === 'Completed') {
            vehicle.status = 'Available';
            await vehicle.save();
        } else {
            vehicle.status = 'Maintenance';
            await vehicle.save();
        }

        res.json(updatedRecord);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a maintenance record
// @route   DELETE /api/maintenance/:id
// @access  Private/Admin/Manager
export const deleteMaintenanceRecord = async (req, res, next) => {
    try {
        const record = await Maintenance.findById(req.params.id).populate('vehicleId');
        
        if (!record) {
            res.status(404);
            throw new Error('Record not found');
        }

        if (req.user.role === 'manager' && record.vehicleId.branchId.toString() !== req.user.branchId?.toString()) {
            res.status(403);
            throw new Error('Not authorized for this branch');
        }

        await record.deleteOne();

        // Set vehicle back to Available
        const vehicle = await Vehicle.findById(record.vehicleId._id);
        if (vehicle && vehicle.status === 'Maintenance') {
             vehicle.status = 'Available';
             await vehicle.save();
        }

        res.json({ message: 'Record removed' });
    } catch (error) {
        next(error);
    }
};
