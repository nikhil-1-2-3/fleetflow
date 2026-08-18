import express from 'express';
import {
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    requestPasswordChange,
    verifyPasswordChange,
    verifyOTP
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleLogin);
router.post('/logout', logoutUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.post('/profile/request-password-change', protect, requestPasswordChange);
router.put('/profile/password', protect, verifyPasswordChange);

export default router;
