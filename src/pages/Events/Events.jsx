import React, { useState, useEffect } from "react";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";
import Event from "../../components/Event/Event";
import styles from "./Events.module.css";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const idToken = useFirebaseIdToken();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/event/upcoming",
                    {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.success) {
                    setEvents(data.events);
                    setFilteredEvents(data.events);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };

        if (idToken) {
            fetchEvents();
        }
    }, [idToken]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const query = e.target.value.toLowerCase();
        setFilteredEvents(
            events.filter((event) => event.name.toLowerCase().includes(query))
        );
    };

    return (
        <>
            <Navbar />
            <motion.div
                className={styles.eventsContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.h1
                    className={styles.title}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Upcoming Events
                </motion.h1>

                <motion.div
                    className={styles.searchContainer}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <input
                        type="text"
                        placeholder="Search events..."
                        className={styles.searchBar}
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </motion.div>

                <motion.div
                    className={styles.eventGrid}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event.eventId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Event event={event} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </>
    );
};

export default Events;
