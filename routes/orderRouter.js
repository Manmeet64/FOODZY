import express from "express";
import {
    createOrUpdateOrder,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus,
    deleteOrUpdateOrder,
    getPendingOrdersWithRestaurantNames,
    getPendingOrderByRestaurant,
    createCheckoutSession,
} from "../controllers/orderController.js"; // Importing controller functions

const router = express.Router();

// Route for creating an order
router.post("/create", createOrUpdateOrder);
router.post("/delete", deleteOrUpdateOrder);
// Route for getting orders by user
router.get("/user", getOrdersByUser);
router.get("/pending", getPendingOrdersWithRestaurantNames);
router.get("/pending/:restaurantId", getPendingOrderByRestaurant);
// Route for getting a specific order by orderId
router.get("/:orderId", getOrderById);

// Route for updating the order status (e.g., Cancel or Complete)
router.put("/:orderId/status", updateOrderStatus);

router.post("/checkout/:orderId", createCheckoutSession);
export default router;
