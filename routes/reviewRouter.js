import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js"; // Import controller functions

const router = express.Router();

// Route to create a new review
router.post("/:restaurantId", createReview);

router.get("/", getReviews);

export default router;
