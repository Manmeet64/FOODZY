import React, { useEffect, useState } from "react";
import styles from "./Event.module.css";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";
import { requestFirebaseToken } from "../../../firebase.js";
import NotificationManager from "../NotificationManager";

const Event = ({ event }) => {
    const {
        eventId,
        name,
        description,
        startTime,
        endTime,
        image,
        status,
        restaurantId,
    } = event;

    const idToken = useFirebaseIdToken();
    const [restaurantName, setRestaurantName] = useState("");
    const [fcmToken, setFcmToken] = useState(null);
    const [isAttending, setIsAttending] = useState(false);

    // Fetch FCM Token when component mounts
    useEffect(() => {
        const fetchFcmToken = async () => {
            try {
                const token = await requestFirebaseToken();
                setFcmToken(token);
            } catch (error) {
                console.error("Error fetching Firebase token:", error);
            }
        };
        fetchFcmToken();
    }, []);

    const handleNewNotification = (notification) => {
        console.log("Notification received:", notification);
    };

    const handleRSVP = async () => {
        if (isAttending) return;

        try {
            const rsvpResponse = await fetch(
                `http://localhost:8000/event/${eventId}/rsvp`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            const responseData = await rsvpResponse.json();

            if (!rsvpResponse.ok) {
                // Check if the error is due to already attending
                if (
                    responseData.message ===
                    "User has already RSVP'd to this event"
                ) {
                    // Send notification for already attending
                    if (fcmToken) {
                        const notificationResponse = await fetch(
                            "http://localhost:8000/notification/send-notification",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${idToken}`,
                                },
                                body: JSON.stringify({
                                    token: fcmToken,
                                    title: "Foodzy",
                                    body: "You are already registered for this event!",
                                }),
                            }
                        );

                        if (!notificationResponse.ok) {
                            console.error("Failed to send notification");
                        }
                    }
                    // Update attending status since user is already registered
                    setIsAttending(true);
                    return;
                }
                throw new Error(responseData.message || "Failed to RSVP");
            }

            // Update attending status
            setIsAttending(true);

            // Send success notification
            if (fcmToken) {
                const notificationResponse = await fetch(
                    "http://localhost:8000/notification/send-notification",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${idToken}`,
                        },
                        body: JSON.stringify({
                            token: fcmToken,
                            title: "Foodzy",
                            body: "Whoo! You are attending the event",
                        }),
                    }
                );

                if (!notificationResponse.ok) {
                    console.error("Failed to send notification");
                }
            }
        } catch (error) {
            console.error("Error during RSVP:", error);
        }
    };

    useEffect(() => {
        const fetchRestaurantName = async () => {
            try {
                const response = await fetch("http://localhost:8000/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        query: `
                            query Query($getRestaurantByIdId: ID!) {
                              getRestaurantById(id: $getRestaurantByIdId) {
                                name
                              }
                            }
                        `,
                        variables: {
                            getRestaurantByIdId: restaurantId,
                        },
                    }),
                });

                const data = await response.json();
                if (response.ok && data?.data?.getRestaurantById?.name) {
                    setRestaurantName(data.data.getRestaurantById.name);
                }
            } catch (error) {
                console.error("Error fetching restaurant name:", error);
            }
        };

        if (restaurantId && idToken) {
            fetchRestaurantName();
        }
    }, [restaurantId, idToken]);

    return (
        <>
            <NotificationManager onNewNotification={handleNewNotification} />
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    <img src={image} alt={name} className={styles.image} />
                </div>
                <div className={styles.content}>
                    <h2 className={styles.name}>{name}</h2>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.timeContainer}>
                        <p className={styles.time}>
                            <strong>Start:</strong>{" "}
                            {new Date(startTime).toLocaleString()}
                        </p>
                        <p className={styles.time}>
                            <strong>End:</strong>{" "}
                            {new Date(endTime).toLocaleString()}
                        </p>
                    </div>
                    <span className={styles.status}>Status: {status}</span>
                    {restaurantName && (
                        <p className={styles.restaurantName}>
                            <strong>Restaurant:</strong> {restaurantName}
                        </p>
                    )}
                    <button
                        className={`${styles.rsvpButton} ${
                            isAttending ? styles.attending : ""
                        }`}
                        onClick={handleRSVP}
                        disabled={isAttending}
                    >
                        {isAttending ? "Attending" : "RSVP Now"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Event;
