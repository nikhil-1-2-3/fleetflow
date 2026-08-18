import express from 'express';
import {
    getRentalRecords,
    processCheckOut,
    processCheckIn
} from '../controllers/rentalRecordController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, authorizeRoles('admin', 'manager'), getRentalRecords);

router.route('/checkout')
    .post(protect, authorizeRoles('admin', 'manager'), processCheckOut);

router.route('/checkin/:id')
    .put(protect, authorizeRoles('admin', 'manager'), processCheckIn);

export default router;
