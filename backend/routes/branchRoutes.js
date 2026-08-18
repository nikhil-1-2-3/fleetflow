import express from 'express';
import { getBranches, createBranch, updateBranch, deleteBranch } from '../controllers/branchController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getBranches)
    .post(protect, authorizeRoles('admin'), createBranch);

router.route('/:id')
    .put(protect, authorizeRoles('admin'), updateBranch)
    .delete(protect, authorizeRoles('admin'), deleteBranch);

export default router;
