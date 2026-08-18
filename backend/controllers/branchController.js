import Branch from '../models/Branch.js';

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
export const getBranches = async (req, res, next) => {
    try {
        const branches = await Branch.find({}).populate('managerId', 'name email');
        res.json(branches);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a branch
// @route   POST /api/branches
// @access  Private/Admin
export const createBranch = async (req, res, next) => {
    try {
        const branch = new Branch(req.body);
        const createdBranch = await branch.save();
        res.status(201).json(createdBranch);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
export const updateBranch = async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (branch) {
            Object.assign(branch, req.body);
            const updatedBranch = await branch.save();
            res.json(updatedBranch);
        } else {
            res.status(404);
            throw new Error('Branch not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
export const deleteBranch = async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (branch) {
            await branch.deleteOne();
            res.json({ message: 'Branch removed' });
        } else {
            res.status(404);
            throw new Error('Branch not found');
        }
    } catch (error) {
        next(error);
    }
};
