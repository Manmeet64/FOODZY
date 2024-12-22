import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Tab,
    Rating,
    Paper,
    Grid,
    TextField,
    Button,
    Avatar,
    Tabs,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import Dish from "../../components/Dish/Dish";
import Navbar from "../../components/Navbar/Navbar";
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    CalendarToday as CalendarTodayIcon,
    DeliveryDining as DeliveryDiningIcon,
} from "@mui/icons-material";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";
import { toast } from "react-toastify";

const HeroOverlay = styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
        "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
});

const HeroSection = styled(Box)({
    position: "relative",
    height: "60vh",
    width: "100%",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "0",
});

const HeroImageWrapper = styled(motion.div)({
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
            "linear-gradient(45deg, rgba(45, 52, 54, 0.02) 0%, rgba(94, 135, 119, 0.02) 100%)",
        zIndex: 1,
    },
});

const HeroImage = styled("img")({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    filter: "brightness(1.02) contrast(1.02)",
    transform: "scale(1.01)",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

const ContentSection = styled(motion.div)({
    background: "white",
    padding: "32px",
    borderRadius: "20px",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "1200px",
    margin: "-50px auto 32px",
    width: "90%",
    "@media (max-width: 600px)": {
        padding: "24px",
        width: "85%",
        margin: "-30px auto 32px",
    },
});

const RestaurantHeader = styled(Box)({
    textAlign: "center",
    marginBottom: "32px",
    padding: "20px 0 32px 0",
    borderBottom: "1px solid rgba(94, 135, 119, 0.1)",
    position: "relative",
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: "-1px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "150px",
        height: "3px",
        background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
        borderRadius: "1.5px",
    },
});

const RestaurantTitle = styled(Typography)({
    fontSize: "3.5rem",
    fontWeight: 800,
    marginBottom: "16px",
    background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    "@media (max-width: 960px)": {
        fontSize: "2.8rem",
    },
    "@media (max-width: 600px)": {
        fontSize: "2.2rem",
    },
});

const RestaurantDescription = styled(Typography)({
    fontSize: "1.15rem",
    color: "#555",
    maxWidth: "750px",
    margin: "20px auto",
    lineHeight: 1.8,
    fontWeight: 400,
    padding: "0 20px",
    "@media (max-width: 600px)": {
        fontSize: "1rem",
        lineHeight: 1.6,
    },
});

const LocationBadge = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "25px",
    fontSize: "1rem",
    fontWeight: 500,
    marginBottom: "24px",
    boxShadow: "0 4px 15px rgba(94, 135, 119, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(94, 135, 119, 0.3)",
    },
    "& svg": {
        fontSize: "20px",
    },
});

const MenuSection = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "28px",
    padding: "24px 0",
});

const MenuItem = styled(motion.div)({
    background: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    },
});

const MenuItemImage = styled("img")({
    width: "100%",
    height: "240px",
    objectFit: "cover",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        transform: "scale(1.08)",
    },
});

const MenuItemContent = styled(Box)({
    padding: "28px",
    background: "linear-gradient(to bottom, rgba(255,255,255,0.95), white)",
});

const MenuItemName = styled(Typography)({
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: "12px",
    background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
});

const MenuItemDescription = styled(Typography)({
    color: "#666",
    fontSize: "1rem",
    marginBottom: "16px",
    lineHeight: 1.7,
});

const MenuItemPrice = styled(Typography)({
    color: "#5e8777",
    fontWeight: 700,
    fontSize: "1.5rem",
    background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
    padding: "4px 0",
});

const TabContainer = styled(Paper)({
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    background: "white",
    marginBottom: "24px",
});

const StyledTabs = styled(Tabs)({
    background: "#f5f5f5",
    padding: "8px",
    "& .MuiTabs-indicator": {
        height: "3px",
        borderRadius: "1.5px",
    },
});

const StyledTab = styled(Tab)({
    fontSize: "1rem",
    fontWeight: 500,
    textTransform: "none",
    padding: "12px 24px",
    color: "#666",
    "&.Mui-selected": {
        color: "#5e8777",
    },
});

const ReviewCard = styled(motion.div)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    backgroundColor: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
}));

const InfoSection = styled(motion.div)({
    background: "white",
    borderRadius: "15px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
});

const SectionTitle = styled(Typography)({
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "16px",
    color: "#2d3436",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "& svg": {
        color: "#5e8777",
    },
});

const DetailGrid = styled(Grid)({
    "& .MuiGrid-item": {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
});

const DetailLabel = styled(Typography)({
    color: "#666",
    fontSize: "0.9rem",
});

const DetailValue = styled(Typography)({
    color: "#2d3436",
    fontWeight: 500,
});

const ReviewSection = styled(Box)({
    padding: "24px",
    background: "white",
    borderRadius: "16px",
    marginTop: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
});

const ReviewInput = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        background: "#f5f5f5",
    },
});

const ContentHeader = styled(Box)({
    background: "white",
    padding: "40px",
    borderRadius: "24px",
    marginBottom: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    textAlign: "center",
    border: "1px solid rgba(94, 135, 119, 0.1)",
});

const ContentTitle = styled(Typography)({
    fontSize: "3.2rem",
    fontWeight: 800,
    marginBottom: "16px",
    background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    "@media (max-width: 960px)": {
        fontSize: "2.6rem",
    },
    "@media (max-width: 600px)": {
        fontSize: "2rem",
    },
});

const ContentDescription = styled(Typography)({
    fontSize: "1.2rem",
    color: "#555",
    maxWidth: "800px",
    margin: "20px auto",
    lineHeight: 1.8,
    padding: "0 20px",
    fontWeight: 400,
    "@media (max-width: 600px)": {
        fontSize: "1rem",
        lineHeight: 1.6,
    },
});

const RestaurantDetail = () => {
    const { restaurantId } = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [restaurant, setRestaurant] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const idToken = useFirebaseIdToken();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const query = `
                query Query($getRestaurantByIdId: ID!) {
                    getRestaurantById(id: $getRestaurantByIdId) {
                        _id
                        name
                        description
                        photos {
                            url
                        }
                        cuisines {
                            cuisines
                        }
                        reviews {
                            comment
                            rating
                        }
                        address {
                            city
                            street
                            state
                            locality
                            postalCode
                        }
                        menu {
                            name
                            price
                            imageUrl
                            dishId
                            description
                            ratings {
                                average
                            }
                            cuisine
                        }
                        estimatedDeliveryTime
                        contact {
                            phone
                            email
                        }
                        ratings {
                            average
                        }
                        hours {
                            day
                            close
                            open
                        }
                    }
                }
            `;
            const variables = { getRestaurantByIdId: restaurantId };

            try {
                const response = await fetch("http://localhost:8000/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, variables }),
                });

                const result = await response.json();
                console.log("Restaurant Data:", result.data.getRestaurantById);
                setRestaurant(result.data.getRestaurantById);
            } catch (error) {
                console.error("Error fetching restaurant details:", error);
            }
        };

        fetchRestaurantDetails();
    }, [restaurantId]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    const handleSubmitReview = async () => {
        if (!reviewText || !rating) {
            toast.error("Please provide both a review and rating");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/reviews/${restaurantId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        comment: reviewText,
                        rating: parseFloat(rating),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            // Clear the form
            setReviewText("");
            setRating(0);

            // Show success message
            toast.success("Review submitted successfully!");

            // Optionally refresh the reviews
            // You might want to add a function to fetch updated reviews
            // and call it here
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review. Please try again.");
        }
    };

    if (!restaurant) {
        return (
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h5">Loading...</Typography>
            </Box>
        );
    }

    console.log("Current Restaurant State:", restaurant);
    console.log("Current Restaurant State:", restaurant.reviews);
    return (
        <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar />

            <HeroSection>
                <HeroImageWrapper>
                    <HeroImage
                        src={
                            restaurant?.photos?.[0]?.url || "/default-image.jpg"
                        }
                        alt={restaurant?.name || "Restaurant"}
                    />
                </HeroImageWrapper>

                <HeroOverlay>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            textAlign: "center",
                            padding: "0 20px",
                            maxWidth: "1200px",
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: "2.5rem", md: "4.5rem" },
                                fontWeight: 800,
                                mb: 3,
                                textTransform: "capitalize",
                                letterSpacing: "-0.5px",
                                lineHeight: 1.2,
                                color: "#ffffff",
                                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                            }}
                        >
                            {restaurant?.name}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                maxWidth: "800px",
                                margin: "0 auto",
                                fontSize: { xs: "1.1rem", md: "1.4rem" },
                                lineHeight: 1.6,
                                color: "rgba(255, 255, 255, 0.9)",
                                fontWeight: 500,
                                letterSpacing: "0.3px",
                                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                            }}
                        >
                            {restaurant?.description}
                        </Typography>
                    </motion.div>
                </HeroOverlay>

                <ContentSection>
                    <ContentHeader>
                        <LocationBadge>
                            <LocationOnIcon />
                            {restaurant?.address?.locality || "Location"}
                        </LocationBadge>
                    </ContentHeader>

                    <TabContainer>
                        <StyledTabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                        >
                            <StyledTab label="Menu" />
                            <StyledTab label="Reviews" />
                            <StyledTab label="Info" />
                        </StyledTabs>
                    </TabContainer>

                    <MenuSection>
                        {restaurant.menu.map((dish, index) => (
                            <MenuItem
                                key={dish.dishId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Dish {...dish} restaurantId={restaurantId} />
                            </MenuItem>
                        ))}
                    </MenuSection>
                </ContentSection>
            </HeroSection>

            <Container
                maxWidth="lg"
                sx={{ mt: -8, position: "relative", zIndex: 2, pb: 8 }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <InfoSection
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <SectionTitle>
                                <LocationOnIcon />
                                Location & Contact
                            </SectionTitle>
                            <DetailGrid container spacing={2}>
                                <Grid item xs={12}>
                                    <LocationOnIcon sx={{ color: "#5e8777" }} />
                                    <Box>
                                        <DetailLabel>Address</DetailLabel>
                                        <DetailValue>
                                            {`${restaurant.address.street}, ${restaurant.address.locality}`}
                                            <br />
                                            {`${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.postalCode}`}
                                        </DetailValue>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <PhoneIcon sx={{ color: "#5e8777" }} />
                                    <Box>
                                        <DetailLabel>Phone</DetailLabel>
                                        <DetailValue>
                                            {restaurant.contact.phone}
                                        </DetailValue>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <EmailIcon sx={{ color: "#5e8777" }} />
                                    <Box>
                                        <DetailLabel>Email</DetailLabel>
                                        <DetailValue>
                                            {restaurant.contact.email}
                                        </DetailValue>
                                    </Box>
                                </Grid>
                            </DetailGrid>
                        </InfoSection>

                        <InfoSection
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <SectionTitle>
                                <AccessTimeIcon />
                                Hours & Delivery
                            </SectionTitle>
                            <DetailGrid container spacing={2}>
                                <Grid item xs={12}>
                                    <CalendarTodayIcon
                                        sx={{ color: "#5e8777" }}
                                    />
                                    <Box>
                                        <DetailLabel>Working Days</DetailLabel>
                                        <DetailValue>
                                            {restaurant.hours.day}
                                        </DetailValue>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <AccessTimeIcon sx={{ color: "#5e8777" }} />
                                    <Box>
                                        <DetailLabel>Timings</DetailLabel>
                                        <DetailValue>{`${restaurant.hours.open} - ${restaurant.hours.close}`}</DetailValue>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <DeliveryDiningIcon
                                        sx={{ color: "#5e8777" }}
                                    />
                                    <Box>
                                        <DetailLabel>
                                            Estimated Delivery Time
                                        </DetailLabel>
                                        <DetailValue>
                                            {restaurant.estimatedDeliveryTime}
                                        </DetailValue>
                                    </Box>
                                </Grid>
                            </DetailGrid>
                        </InfoSection>

                        <InfoSection
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <SectionTitle>
                                <StarIcon />
                                Ratings
                            </SectionTitle>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    variant="h3"
                                    sx={{ color: "#5e8777", fontWeight: 700 }}
                                >
                                    {restaurant.ratings.average}
                                </Typography>
                                <Rating
                                    value={restaurant.ratings.average}
                                    precision={0.5}
                                    readOnly
                                    sx={{ color: "#5e8777" }}
                                />
                                <Typography sx={{ color: "#666", mt: 1 }}>
                                    Based on {restaurant.ratings.count} reviews
                                </Typography>
                            </Box>
                        </InfoSection>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <TabContainer elevation={0}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <StyledTab
                                    label="Menu"
                                    onClick={() => setActiveTab(0)}
                                />
                                <StyledTab
                                    label="Reviews"
                                    onClick={() => setActiveTab(1)}
                                />
                            </Box>
                        </TabContainer>

                        <AnimatePresence mode="wait">
                            {activeTab === 0 && (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Grid container spacing={3}>
                                        {restaurant.menu.map((dish, index) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                key={dish.dishId}
                                            >
                                                <motion.div
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    transition={{
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    <Dish
                                                        {...dish}
                                                        restaurantId={
                                                            restaurantId
                                                        }
                                                    />
                                                </motion.div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </motion.div>
                            )}

                            {activeTab === 1 && (
                                <ReviewSection>
                                    <SectionTitle>
                                        <StarIcon />
                                        Customer Reviews
                                    </SectionTitle>

                                    <Box sx={{ mb: 3 }}>
                                        <ReviewInput
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Write your review..."
                                            value={reviewText}
                                            onChange={(e) =>
                                                setReviewText(e.target.value)
                                            }
                                        />
                                        <Box
                                            sx={{
                                                mt: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                            }}
                                        >
                                            <Rating
                                                value={rating}
                                                onChange={(event, newValue) => {
                                                    setRating(newValue);
                                                }}
                                                precision={0.5}
                                                sx={{ color: "#5e8777" }}
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={handleSubmitReview}
                                                sx={{
                                                    background:
                                                        "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
                                                    color: "white",
                                                    "&:hover": {
                                                        background:
                                                            "linear-gradient(135deg, #2d3436 20%, #5e8777 100%)",
                                                    },
                                                }}
                                            >
                                                Submit Review
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mt: 4 }}>
                                        {restaurant.reviews?.map(
                                            (review, index) => (
                                                <ReviewCard
                                                    key={index}
                                                    rating={review.rating}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <Rating
                                                            value={
                                                                review.rating
                                                            }
                                                            readOnly
                                                            precision={0.5}
                                                            sx={{
                                                                color: "#5e8777",
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            color: "#2d3436",
                                                        }}
                                                    >
                                                        {review.comment}
                                                    </Typography>
                                                </ReviewCard>
                                            )
                                        )}
                                    </Box>
                                </ReviewSection>
                            )}
                        </AnimatePresence>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RestaurantDetail;
