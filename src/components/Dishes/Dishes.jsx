import React, { useState, useEffect } from "react";
import styles from "./Dishes.module.css";
import Dish from "../Dish/Dish"; // Import the Dish component

const Dishes = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/menus/mood/happy"
                );
                if (response.ok) {
                    const data = await response.json();
                    setDishes(data.dishes.slice(0, 6)); // Get only first 6 dishes
                }
            } catch (error) {
                console.error("Error fetching dishes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <section className={styles.dishesSection}>
            <h2 className={styles.sectionTitle}>Top Dishes</h2>
            <div className={styles.dishesContainer}>
                {dishes.map((dish) => (
                    <Dish
                        key={dish._id}
                        dishId={dish._id}
                        name={dish.name}
                        price={dish.price}
                        description={dish.description}
                        imageUrl={dish.imageUrl}
                        ratings={dish.ratings}
                        restaurantId={dish.restaurantId}
                        cuisine={dish.cuisine}
                    />
                ))}
            </div>
        </section>
    );
};

export default Dishes;
