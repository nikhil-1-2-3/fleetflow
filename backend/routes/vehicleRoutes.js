import express from 'express';
import {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} from '../controllers/vehicleController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getVehicles)
    .post(protect, authorizeRoles('admin', 'manager'), createVehicle);

router.route('/:id')
    .get(getVehicleById)
    .put(protect, authorizeRoles('admin', 'manager'), updateVehicle)
    .delete(protect, authorizeRoles('admin', 'manager'), deleteVehicle);

export default router;
