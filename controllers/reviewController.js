import { v4 as uuidv4 } from "uuid";
import reviewModel from "../models/reviewModel.js";
import restaurantModel from "../models/restaurantModel.js";

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        let review = req.body;
        let userId = req.firebaseId;

        // Validate restaurant existence using findById
        const restaurant = await restaurantModel.findById(restaurantId); // Use findById for ObjectId lookup
        if (!restaurant) {
            return res.status(404).send({
                success: false,
                message: "Restaurant not found",
            });
        }

        // Generate unique reviewId
        const reviewId = uuidv4();
        review.reviewId = reviewId;
        review.restaurantId = restaurantId; // Ensure that the review is associated with the correct restaurant
        review.userId = userId;
        // Save the review to the database
        const newReview = await reviewModel.create(review);

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: newReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error creating review",
            error: error.message,
        });
    }
};

export const getReviews = async (req, res) => {
    try {
        let reviews = await reviewModel.find();
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
};
