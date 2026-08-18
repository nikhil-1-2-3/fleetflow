import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Admin and Manager role authorization middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route`));
        }
        next();
    };
};
