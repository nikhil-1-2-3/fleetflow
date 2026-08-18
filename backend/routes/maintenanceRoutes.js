import express from 'express';
import {
    getMaintenanceRecords,
    createMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord
} from '../controllers/maintenanceController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, authorizeRoles('admin', 'manager'), getMaintenanceRecords)
    .post(protect, authorizeRoles('admin', 'manager'), createMaintenanceRecord);

router.route('/:id')
    .put(protect, authorizeRoles('admin', 'manager'), updateMaintenanceRecord)
    .delete(protect, authorizeRoles('admin', 'manager'), deleteMaintenanceRecord);

export default router;
