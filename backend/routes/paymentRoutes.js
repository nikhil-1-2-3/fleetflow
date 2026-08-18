import express from 'express';
import { createOrder, verifyPayment, getRazorpayKey } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/key', protect, getRazorpayKey);
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
