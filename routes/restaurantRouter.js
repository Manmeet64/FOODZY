import express from "express";
import {
    addRestaurant,
    getRestaurantById,
} from "../controllers/restaurantController.js";
const router = express.Router();

// Admin routes for restaurant management
router.post("/restaurants", addRestaurant);
router.get("/restaurants/:restaurantId", getRestaurantById);

export default router;
