// Feature.jsx
import React from "react";
import styles from "./Feature.module.css";

const Feature = () => {
    const features = [
        {
            id: 1,
            icon: "fas fa-truck",
            title: "Fast Delivery",
            description:
                "Experience lightning-fast delivery right to your doorstep. Our dedicated delivery partners ensure your food arrives hot and fresh.",
        },
        {
            id: 2,
            icon: "fas fa-store",
            title: "Restaurant Events",
            description:
                "Join exclusive dining events, food tastings, and chef's specials. Experience unique culinary moments at top restaurants.",
        },
        {
            id: 3,
            icon: "fas fa-brain",
            title: "Aura AI",
            description:
                "Let our AI understand your mood and preferences to suggest the perfect dishes from your favorite restaurants.",
        },
    ];

    return (
        <div className={styles.featureContainer}>
            <div className={styles.decorativeCurve}></div>
            <h2 className={styles.sectionTitle}>Why Choose Us</h2>
            <div className={styles.featuresWrapper}>
                {features.map((feature) => (
                    <div key={feature.id} className={styles.featureCard}>
                        <div className={styles.iconWrapper}>
                            <i className={feature.icon}></i>
                        </div>
                        <h3 className={styles.title}>{feature.title}</h3>
                        <p className={styles.description}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feature;
