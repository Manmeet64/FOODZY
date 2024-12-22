import cuisineModel from "../models/cuisineModel.js";
import restaurantModel from "../models/restaurantModel.js";
// Add a cuisine to a restaurant
export const addCuisine = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        let cuisine = req.body;
        cuisine.restaurantId = restaurantId;
        console.log(cuisine);

        // Validate if the restaurant exists
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        let createdCuisine = await cuisineModel.create(cuisine);

        res.status(201).json({
            success: true,
            message: "Cuisine added successfully",
            cuisine: createdCuisine,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding cuisine",
            error: error.message,
        });
    }
};
