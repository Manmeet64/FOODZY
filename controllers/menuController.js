import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique ids
import menuModel from "../models/menuModel.js"; // Import the menu model
import restaurantModel from "../models/restaurantModel.js"; // Import the restaurant model to validate restaurant existence

//This is mood key mapping
const moodKeywordMapping = {
    happy: [
        "chocolate",
        "cake",
        "burger",
        "pizza",
        "ice cream",
        "fries",
        "donut",
    ],
    sad: ["soup", "macaroni", "cheese", "stew", "broth", "comfort"],
    angry: ["spicy", "curry", "chili", "wings", "hot", "pepper"],
    romantic: ["steak", "pasta", "wine", "chocolate", "dessert", "fondue"],
    anxious: ["tea", "herbal", "salad", "smoothie", "oats"],
    depressed: ["comfort", "indulgent", "fried", "dessert", "cake"],
    excited: ["sushi", "fresh", "wrap", "fruit", "taco", "energetic"],
    nostalgic: ["traditional", "homemade", "classic", "authentic", "grandma"],
    energetic: ["protein", "bar", "bowl", "shake", "nuts"],
    cozy: ["warm", "hot chocolate", "soup", "latte", "stew"],
    craving: [
        "cheeseburger",
        "pizza",
        "milkshake",
        "fries",
        "nachos",
        "chips",
        "fried chicken",
        "cake",
        "pasta",
        "tacos",
    ],
};

// This is the function to assign moodtags to a dish
const assignMoodTags = (dishName, dishDescription) => {
    const tags = new Set(); // Use a Set to avoid duplicate tags

    // Combine name and description for keyword matching
    const text = `${dishName.toLowerCase()} ${
        dishDescription?.toLowerCase() || ""
    }`;

    // Match keywords to moods
    Object.entries(moodKeywordMapping).forEach(([mood, keywords]) => {
        if (keywords.some((keyword) => text.includes(keyword))) {
            tags.add(mood);
        }
    });

    return Array.from(tags); // Convert Set to Array
};

export const addMenu = async (req, res) => {
    try {
        // Extract restaurantId and dishes from the request body
        const { dishes } = req.body;
        const { restaurantId } = req.params;

        // Validate if the restaurant exists using findOne for restaurantId
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        // Generate a unique menuId (you can generate this ID if necessary, or use other ways to make it unique)
        const menuId = uuidv4();

        // Generate random unique dishId for each dish in the dishes array
        const dishesWithIds = dishes.map((dish) => ({
            ...dish,
            dishId: uuidv4(), // Assign a unique dishId to each dish
        }));

        // Create the menu object
        const menu = {
            menuId,
            restaurantId,
            dishes: dishesWithIds,
        };

        // Create and save the menu
        const newMenu = await menuModel.create(menu);

        res.status(201).json({
            success: true,
            message: "Menu created successfully",
            menu: newMenu,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating menu",
            error: error.message,
        });
    }
};

// This function will fetch all dishes associated with a specific mood tag.

export const getDishesByMood = async (req, res) => {
    try {
        const { mood } = req.params; // Mood tag sent from the frontend

        // Find all menus that have dishes with the specified mood tag
        const menus = await menuModel
            .find({
                "dishes.moodTags": mood,
            })
            .populate("restaurantId"); // Populate restaurantId to include restaurant details

        // Collect all dishes matching the mood and attach restaurantId to each dish
        const dishes = menus.reduce((acc, menu) => {
            const matchingDishes = menu.dishes.filter((dish) =>
                dish.moodTags.includes(mood)
            );

            // Add restaurantId to each dish
            matchingDishes.forEach((dish) => {
                acc.push({
                    ...dish.toObject(),
                    restaurantId: menu.restaurantId,
                }); // Convert dish to plain object and add restaurantId
            });
            return acc;
        }, []);
        console.log(dishes[0].restaurantId._id);
        if (dishes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No dishes found for the given mood",
            });
        }

        res.status(200).json({
            success: true,
            mood: mood,
            dishes: dishes, // Send the dishes with restaurantId included
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching dishes by mood",
            error: error.message,
        });
    }
};
