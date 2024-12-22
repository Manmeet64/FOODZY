import express from "express";
import {
    createEvent,
    getEventsByRestaurant,
    rsvpToEvent,
    deleteEvent,
    updateEventStatus,
    getUpcomingEvents,
    getUserEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent); // Create a new event
router.get("/upcoming", getUpcomingEvents); // Get all events
router.get("/restaurant/:restaurantId", getEventsByRestaurant); // Get events by restaurant
router.put("/:eventId/rsvp", rsvpToEvent); // RSVP to an event
router.delete("/:eventId", deleteEvent); // Delete an event
router.put("/status/:eventId", updateEventStatus);
router.get("/user", getUserEvents);
export default router;
