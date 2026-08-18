import Review from '../models/Review.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Customer)
export const createReview = async (req, res, next) => {
    try {
        const { rating, comment, vehicleId, bookingId } = req.body;

        if (!rating || !comment || !vehicleId || !bookingId) {
            res.status(400);
            throw new Error('Please provide rating, comment, and booking details');
        }

        // Verify the user actually completed this booking
        const booking = await Booking.findById(bookingId);
        
        if (!booking || booking.customerId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to review this booking');
        }

        if (booking.status !== 'Completed') {
            res.status(400);
            throw new Error('You can only review a vehicle after the rental is completed');
        }

        if (booking.vehicleId.toString() !== vehicleId.toString()) {
            res.status(400);
            throw new Error('Vehicle ID mismatch');
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ bookingId, userId: req.user._id });
        if (existingReview) {
            res.status(400);
            throw new Error('You have already reviewed this booking');
        }

        const review = new Review({
            rating: Number(rating),
            comment,
            userId: req.user._id,
            vehicleId,
            bookingId
        });

        await review.save();

        // Update Vehicle average rating and num reviews
        const reviews = await Review.find({ vehicleId });
        const numReviews = reviews.length;
        const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        await Vehicle.findByIdAndUpdate(vehicleId, {
            averageRating: parseFloat(averageRating.toFixed(1)),
            numReviews
        });

        // Also mark the booking as reviewed (optional, but let's just rely on the existingReview check)
        
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reviews for a specific vehicle
// @route   GET /api/reviews/vehicle/:vehicleId
// @access  Public
export const getVehicleReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ vehicleId: req.params.vehicleId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin/Manager or Author)
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'manager') {
            res.status(403);
            throw new Error('Not authorized to delete this review');
        }

        const vehicleId = review.vehicleId;
        await review.deleteOne();

        // Update Vehicle average rating
        const reviews = await Review.find({ vehicleId });
        const numReviews = reviews.length;
        const averageRating = numReviews === 0 ? 0 : reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        await Vehicle.findByIdAndUpdate(vehicleId, {
            averageRating: parseFloat(averageRating.toFixed(1)),
            numReviews
        });

        res.json({ message: 'Review removed' });
    } catch (error) {
        next(error);
    }
};
