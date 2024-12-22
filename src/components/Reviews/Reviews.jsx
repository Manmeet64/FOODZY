import React, { useState, useEffect } from "react";
import styles from "./Reviews.module.css";
import { Rating } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("http://localhost:8000/reviews");
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data.data.slice(0, 6)); // Get only first 6 reviews
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading reviews...</div>;
    }

    return (
        <section className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>Our Reviews</h2>
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    {[...reviews, ...reviews].map((review, index) => (
                        <div key={index} className={styles.reviewCard}>
                            <div className={styles.quoteIcon}>
                                <FormatQuoteIcon fontSize="large" />
                            </div>
                            <div className={styles.ratingContainer}>
                                <Rating
                                    value={review.rating}
                                    readOnly
                                    precision={0.1}
                                    size="small"
                                />
                                <span className={styles.ratingValue}>
                                    {review.rating.toFixed(1)}
                                </span>
                            </div>
                            <p className={styles.reviewComment}>
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
