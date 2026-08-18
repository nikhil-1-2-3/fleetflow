import express from 'express';
import {
    createBooking,
    getMyBookings,
    getBookings,
    updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createBooking)
    .get(protect, authorizeRoles('admin', 'manager'), getBookings);

router.route('/mybookings')
    .get(protect, getMyBookings);

router.route('/:id/status')
    .put(protect, authorizeRoles('admin', 'manager'), updateBookingStatus);

export default router;
