import { v4 as uuidv4 } from "uuid";
import orderModel from "../models/orderModel.js";
export const createOrUpdateOrder = async (req, res) => {
    try {
        const { restaurantId, dish } = req.body; // Extract restaurantId and dish
        const userId = req.firebaseId; // Extract userId from Firebase token
        console.log(dish);
        if (!dish || !restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Dish and restaurantId are required",
            });
        }

        // Generate a unique orderId for the new order
        const orderId = uuidv4();

        // Check if there's an existing order for the restaurant with pending status
        const existingOrder = await orderModel.findOne({
            restaurantId,
            userId,
            status: "pending",
        });

        if (existingOrder) {
            // Check if the dish already exists in the order
            const existingDishIndex = existingOrder.items.findIndex(
                (item) => item.dishId === dish.dishId
            );

            if (existingDishIndex > -1) {
                // Increment the quantity of the existing dish
                existingOrder.items[existingDishIndex].quantity +=
                    dish.quantity;
            } else {
                // Add the new dish to the items array
                existingOrder.items.push(dish);
            }

            // Recalculate the total amount
            existingOrder.totalAmount = existingOrder.items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            // Save the updated order
            const updatedOrder = await existingOrder.save();

            return res.status(200).json({
                success: true,
                message: "Order updated successfully",
                order: updatedOrder,
            });
        } else {
            // Create a new order if no pending order exists
            const newOrder = await orderModel.create({
                orderId, // Assign the generated orderId
                restaurantId,
                userId,
                items: [dish], // Add the dish to the items array
                totalAmount: dish.quantity * dish.price,
                status: "pending", // Ensure the status is 'pending'
            });

            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                order: newOrder,
            });
        }
    } catch (error) {
        console.error("Error creating or updating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating or updating order",
            error: error.message,
        });
    }
};

export const deleteOrUpdateOrder = async (req, res) => {
    try {
        const { restaurantId, dish } = req.body; // Extract restaurantId and dish
        const userId = req.firebaseId; // Extract userId from Firebase token

        if (!dish || !restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Dish and restaurantId are required",
            });
        }

        // Check if there's an existing order for the restaurant with pending status
        const existingOrder = await orderModel.findOne({
            restaurantId,
            userId,
            status: "pending",
        });

        if (existingOrder) {
            // Check if the dish exists in the order
            const existingDishIndex = existingOrder.items.findIndex(
                (item) => item.dishId === dish.dishId
            );

            if (existingDishIndex > -1) {
                // Decrement the quantity of the existing dish
                existingOrder.items[existingDishIndex].quantity -=
                    dish.quantity;

                // If the quantity becomes zero, remove the dish from the items array
                if (existingOrder.items[existingDishIndex].quantity <= 0) {
                    existingOrder.items.splice(existingDishIndex, 1);
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Dish not found in the order",
                });
            }

            // If no items are left, delete the order
            if (existingOrder.items.length === 0) {
                await orderModel.findByIdAndDelete(existingOrder._id);

                return res.status(200).json({
                    success: true,
                    message: "Order deleted successfully",
                });
            }

            // Recalculate the total amount
            existingOrder.totalAmount = existingOrder.items.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            // Save the updated order
            const updatedOrder = await existingOrder.save();

            return res.status(200).json({
                success: true,
                message: "Order updated successfully",
                order: updatedOrder,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No pending order found for the restaurant",
            });
        }
    } catch (error) {
        console.error("Error deleting or updating order:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting or updating order",
            error: error.message,
        });
    }
};

export const getPendingOrders = async (req, res) => {
    try {
        const userId = req.firebaseId; // Get the userId from the Firebase token

        // Fetch orders with status "pending" for the user
        const pendingOrders = await orderModel.find({
            userId,
            status: "pending",
        });

        // If no orders are found
        if (pendingOrders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending orders found for this user",
            });
        }

        // Return the found orders
        return res.status(200).json({
            success: true,
            message: "Pending orders retrieved successfully",
            orders: pendingOrders,
        });
    } catch (error) {
        console.error("Error fetching pending orders:", error);

        // Handle any error that occurs during the fetch
        return res.status(500).json({
            success: false,
            message: "Error fetching pending orders",
            error: error.message,
        });
    }
};
import restaurantModel from "../models/restaurantModel.js";

export const getPendingOrdersWithRestaurantNames = async (req, res) => {
    try {
        const userId = req.firebaseId; // Get the userId from the Firebase token

        // Fetch all pending orders for the user
        const pendingOrders = await orderModel.find({
            userId,
            status: "pending",
        });

        // If no pending orders are found
        if (pendingOrders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending orders found for this user",
            });
        }

        // Fetch restaurant names corresponding to the pending orders' restaurantIds
        const ordersWithRestaurantNames = await Promise.all(
            pendingOrders.map(async (order) => {
                // Fetch the restaurant name using the restaurantId
                const restaurant = await restaurantModel.findById(
                    order.restaurantId
                );

                // If the restaurant is not found, set a default name
                const restaurantName = restaurant
                    ? restaurant.name
                    : "Unknown Restaurant";
                const restaurantImage = restaurant
                    ? restaurant.photos[0].url
                    : "No Photo Present";
                return {
                    ...order.toObject(), // Convert order to plain object
                    restaurantName,
                    restaurantImage, // Add restaurant name to the order object
                };
            })
        );

        // Return the orders with their restaurant names
        return res.status(200).json({
            success: true,
            message:
                "Pending orders with restaurant names retrieved successfully",
            orders: ordersWithRestaurantNames,
        });
    } catch (error) {
        console.error(
            "Error fetching pending orders with restaurant names:",
            error
        );

        // Handle any error that occurs during the fetch
        return res.status(500).json({
            success: false,
            message: "Error fetching pending orders with restaurant names",
            error: error.message,
        });
    }
};

// Get all orders by a specific user
export const getOrdersByUser = async (req, res) => {
    try {
        const firebaseId = req.firebaseId;
        console.log("Inside fetching orders function: ", firebaseId);
        // Find all orders for the user
        const orders = await orderModel.find({
            userId: firebaseId,
        });
        console.log(orders);
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user",
            });
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        // Extract restaurantId from the request body
        const { restaurantId } = req.body;
        const firebaseId = req.firebaseId;

        // Find and delete the order with the given restaurantId, userId, and pending status
        const deletedOrder = await orderModel.findOneAndDelete({
            restaurantId,
            userId: firebaseId,
            status: "pending",
        });

        // If no matching order is found, return an error message
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "No pending order found for this restaurant.",
            });
        }

        // If the order is successfully deleted, return a success message
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully.",
            deletedOrder,
        });
    } catch (error) {
        console.error("Error deleting order:", error);

        // Handle errors gracefully
        res.status(500).json({
            success: false,
            message: "Error deleting order.",
            error: error.message,
        });
    }
};

// Get a specific order by its orderId
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by orderId
        const order = await orderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching order",
            error: error.message,
        });
    }
};
// Update order status (e.g., Cancel or Complete)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // Status could be "Cancelled", "Completed", etc.

        // Find the order and update its status
        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { $set: { status } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message,
        });
    }
};

// Function to get the pending order of a user for a specific restaurant
export const getPendingOrderByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params; // Get restaurantId from the URL parameters
        const userId = req.firebaseId; // Get the logged-in user's Firebase ID from the middleware or request

        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Restaurant ID is required",
            });
        }

        // Fetch the pending order for the user and restaurant
        const order = await orderModel.findOne({
            restaurantId,
            userId,
            status: "pending", // Only get the pending orders
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No pending order found for this restaurant",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error fetching pending order:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching pending order",
            error: error.message,
        });
    }
};

import Stripe from "stripe";
import userModel from "../models/userModel.js";

const stripe = new Stripe("sk_test_tR3PYbcVNZZ796tH88S4VQ2u"); // Replace with your Stripe secret key

export const createCheckoutSession = async (req, res) => {
    const { orderId } = req.params;
    const { deliveryCharge, restaurantId, finalTotal, couponCode } = req.body;

    try {
        // Fetch the user details from the database using the firebaseId from the request
        const user = await userModel.findOne({ firebaseId: req.firebaseId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the order with the given orderId already exists
        const existingOrder = await orderModel.findOne({ orderId });

        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Update the total amount of the existing order
        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { totalAmount: finalTotal },
            { new: true } // Ensures the updated order is returned
        );

        // Calculate the final total in paise (smallest currency unit for INR)
        const totalAmount = Math.round(finalTotal * 100); // Convert to paise

        // Check the values of finalTotal to ensure it is a valid number
        if (isNaN(totalAmount) || totalAmount <= 0) {
            console.error("Invalid final total value:", finalTotal);
            return res.status(400).json({ error: "Invalid final total value" });
        }

        // Create Stripe Checkout Session with a single line item for the total amount
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Total after delivery charge and discount",
                        },
                        unit_amount: totalAmount, // Final total amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.headers.origin}/track/${restaurantId}/${orderId}`,
            cancel_url: `${req.headers.origin}/cart`,
            shipping_address_collection: {
                allowed_countries: ["IN"], // Only allow Indian addresses
            },
            customer_email: user.email, // Pass customer's email
        });

        // Send session ID to the client
        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
};
