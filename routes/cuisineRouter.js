import express from "express";
import { addCuisine } from "../controllers/cuisineController.js"; // Importing controller functions

const cuisineRouter = express.Router();

// Create a new cuisine for a restaurant
cuisineRouter.post("/:restaurantId", addCuisine);

export default cuisineRouter;
