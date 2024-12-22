import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Banner.module.css";

const Banner = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/search");
    };

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <h1>Be The Fastest In Delivering Your Food</h1>
                <p>
                    Our mission is to deliver delicious food right to your
                    doorstep. Quick, reliable, and always fresh - that's our
                    promise to you.
                </p>
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.getStartedButton}
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </button>
                </div>
            </div>
            <div className={styles.foodImages}>
                <img
                    src="https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto/f_auto,q_auto/w_1120,h_732,c_fill,g_auto/v1661347444/india-food-butter-chicken/india-food-butter-chicken-1120x732.jpg"
                    alt="Main Dish"
                    className={styles.mainImage}
                />
                <img
                    src="https://cdn77-s3.lazycatkitchen.com/wp-content/uploads/2023/04/roasted-new-potatoes-plate-400x600.jpg"
                    alt="Small Dish"
                    className={styles.smallImageTop}
                />
                <img
                    src="https://www.kitchensanctuary.com/wp-content/uploads/2021/06/Simple-Green-Salad-with-Vinaigrette-Square-FS-3241.jpg"
                    alt="Salad"
                    className={styles.smallImageBottom}
                />
            </div>
        </div>
    );
};

export default Banner;
