import Vehicle from '../models/Vehicle.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = async (req, res, next) => {
    try {
        const pageSize = 100;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                  $or: [
                      { brand: { $regex: req.query.keyword, $options: 'i' } },
                      { model: { $regex: req.query.keyword, $options: 'i' } },
                  ]
              }
            : {};

        const count = await Vehicle.countDocuments({ ...keyword });
        const vehicles = await Vehicle.find({ ...keyword })
            .populate('branchId', 'name location')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ vehicles, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('branchId', 'name location');
        if (vehicle) {
            res.json(vehicle);
        } else {
            res.status(404);
            throw new Error('Vehicle not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Admin/Manager
export const createVehicle = async (req, res, next) => {
    try {
        if (req.user.role === 'manager') {
            if (!req.user.branchId) {
                res.status(403);
                throw new Error('Manager is not assigned to a branch');
            }
            req.body.branchId = req.user.branchId; // Force the branch ID to the manager's branch
        }
        
        const vehicle = new Vehicle(req.body);
        const createdVehicle = await vehicle.save();
        res.status(201).json(createdVehicle);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin/Manager
export const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (vehicle) {
            // Check manager branch access
            if (req.user.role === 'manager' && vehicle.branchId.toString() !== req.user.branchId?.toString()) {
                res.status(403);
                throw new Error('Not authorized to update vehicles for this branch');
            }
            if (req.user.role === 'manager') {
                req.body.branchId = req.user.branchId; // Ensure they don't change the branch
            }

            Object.assign(vehicle, req.body);
            const updatedVehicle = await vehicle.save();
            res.json(updatedVehicle);
        } else {
            res.status(404);
            throw new Error('Vehicle not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin/Manager
export const deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (vehicle) {
            // Check manager branch access
            if (req.user.role === 'manager' && vehicle.branchId.toString() !== req.user.branchId?.toString()) {
                res.status(403);
                throw new Error('Not authorized to delete vehicles for this branch');
            }

            await vehicle.deleteOne();
            res.json({ message: 'Vehicle removed' });
        } else {
            res.status(404);
            throw new Error('Vehicle not found');
        }
    } catch (error) {
        next(error);
    }
};
