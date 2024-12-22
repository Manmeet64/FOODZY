import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Box,
    Rating,
    Chip,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken"; // Custom hook to get Firebase ID token

const StyledCard = styled(motion(Card))(({ theme }) => ({
    width: "100%",
    maxWidth: 380,
    height: 480,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(94, 135, 119, 0.08)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    border: "1px solid rgba(94, 135, 119, 0.1)",
    "&:hover": {
        transform: "translateY(-10px)",
        boxShadow: "0 8px 30px rgba(94, 135, 119, 0.15)",
    },
}));

const StyledCardMedia = styled(CardMedia)({
    height: 240,
    position: "relative",
    overflow: "hidden",
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40%",
        background:
            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
    },
});

const PriceTag = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: theme.palette.primary.main,
    borderRadius: "25px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontWeight: 600,
    backdropFilter: "blur(8px)",
}));

const ContentWrapper = styled(CardContent)({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "24px !important",
    background:
        "linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))",
});

const RatingWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: "6px 12px",
    backgroundColor: "rgba(94, 135, 119, 0.08)",
    borderRadius: "20px",
    width: "fit-content",
}));

const QuantityControl = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    backgroundColor: "rgba(94, 135, 119, 0.08)",
    borderRadius: "30px",
    padding: "8px 16px",
    width: "80%",
    margin: "0 auto",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "rgba(94, 135, 119, 0.12)",
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    width: "80%",
    margin: "0 auto",
    borderRadius: "30px",
    textTransform: "none",
    fontWeight: 600,
    padding: "10px 24px",
    background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(94, 135, 119, 0.2)",
    "&:hover": {
        background: "linear-gradient(135deg, #2d3436 0%, #4a7056 100%)",
        boxShadow: "0 6px 20px rgba(94, 135, 119, 0.3)",
        transform: "translateY(-2px)",
    },
}));

const Dish = ({
    dishId,
    name,
    price,
    description,
    imageUrl,
    ratings,
    restaurantId,
    cuisine,
}) => {
    const [quantity, setQuantity] = useState(0);
    const idToken = useFirebaseIdToken(); // Get the Firebase ID token from the custom hook
    console.log(idToken);
    const handleAddToCart = async () => {
        if (quantity === 0) {
            setQuantity(1); // Start from 1 when clicked "Add to Cart"
        } else {
            setQuantity(quantity + 1); // Increment the quantity by 1
        }

        // Send a POST request to create the order or update the order
        try {
            const response = await fetch(
                "http://localhost:8000/orders/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`, // Add authorization token
                    },
                    body: JSON.stringify({
                        dish: {
                            dishId,
                            name,
                            description,
                            quantity: 1, // Always add 1 when adding to cart
                            price,
                            cuisine, // You may want to adjust this based on your data
                            imageUrl,
                        },
                        restaurantId,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                console.log("Order created/updated:", data);
            } else {
                console.error("Error creating/updating order:", data);
            }
        } catch (error) {
            console.error("Error creating/updating order:", error);
        }
    };

    const handleRemoveFromCart = async () => {
        if (quantity === 0) return; // If quantity is 0, don't do anything

        // Decrease quantity by 1 if it's greater than 1, otherwise set quantity to 0
        const newQuantity = quantity > 1 ? quantity - 1 : 0;
        setQuantity(newQuantity); // Update the local state

        try {
            const response = await fetch(
                "http://localhost:8000/orders/delete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`, // Add authorization token
                    },
                    body: JSON.stringify({
                        restaurantId,
                        dish: {
                            dishId,
                            name,
                            description,
                            quantity: 1, // Pass the updated quantity (0 if removed)
                            price,
                            cuisine,
                            imageUrl,
                        },
                    }),
                }
            );

            // Check if the response is ok (status 200-299)
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting order item:", error);
        }
    };

    return (
        <StyledCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <StyledCardMedia
                image={imageUrl || "https://via.placeholder.com/200"}
                alt={name}
            />
            <PriceTag>
                <CurrencyRupeeIcon sx={{ fontSize: 18, mr: 0.5 }} />
                {price.toFixed(2)}
            </PriceTag>

            <ContentWrapper>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        mb: 1,
                        height: "2.4em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        color: "#2d3436",
                        letterSpacing: "-0.3px",
                    }}
                >
                    {name}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mb: 2,
                        height: "3em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        color: "#666",
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                    }}
                >
                    {description}
                </Typography>

                <RatingWrapper>
                    <Rating
                        value={ratings?.average || 0}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{
                            color: "#5e8777",
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: "#5e8777",
                        }}
                    >
                        {ratings?.average?.toFixed(1) || "0.0"}
                    </Typography>
                </RatingWrapper>

                <Box
                    sx={{
                        mt: "auto",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {quantity === 0 ? (
                        <ActionButton
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </ActionButton>
                    ) : (
                        <QuantityControl>
                            <IconButton
                                size="small"
                                onClick={handleRemoveFromCart}
                                sx={{
                                    color: "#5e8777",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(94, 135, 119, 0.12)",
                                    },
                                }}
                            >
                                <RemoveIcon />
                            </IconButton>
                            <Typography
                                variant="body1"
                                sx={{
                                    minWidth: 30,
                                    textAlign: "center",
                                    fontWeight: 600,
                                    color: "#2d3436",
                                }}
                            >
                                {quantity}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={handleAddToCart}
                                sx={{
                                    color: "#5e8777",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(94, 135, 119, 0.12)",
                                    },
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </QuantityControl>
                    )}
                </Box>
            </ContentWrapper>
        </StyledCard>
    );
};

Dish.propTypes = {
    dishId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    ratings: PropTypes.shape({
        average: PropTypes.number.isRequired,
    }).isRequired,
    restaurantId: PropTypes.string.isRequired, // Ensure restaurantId is passed as a prop
};

Dish.defaultProps = {
    imageUrl: "https://via.placeholder.com/200", // Placeholder image if not provided
};

export default Dish;
