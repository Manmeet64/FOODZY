import React, { useState } from "react";
import styles from "./DeliveryForm.module.css";
import { toast } from "react-toastify";

const DeliveryForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        current_location: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch("http://localhost:8000/delivery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Delivery Agent added successfully!");
                setFormData({
                    name: "",
                    current_location: "",
                    phone: "",
                });
            } else {
                toast.error("Failed to add delivery agent");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className={styles.formWrapper}>
            <div className={styles.formContent}>
                <h2 className={styles.formTitle}>Add Delivery Agent</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="current_location">
                            Current Location
                        </label>
                        <input
                            type="text"
                            id="current_location"
                            name="current_location"
                            value={formData.current_location}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                            placeholder="Enter current location"
                        />
                    </div>

                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? "Adding..." : "Add Delivery Agent"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeliveryForm;
