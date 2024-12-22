import express from "express";
import {
    rsvpToEvent,
    updateEventStatus,
    getUpcomingEvents,
    getUserEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/upcoming", getUpcomingEvents); // Get all events

router.put("/:eventId/rsvp", rsvpToEvent); // RSVP to an event
router.put("/status/:eventId", updateEventStatus);
router.get("/user", getUserEvents);
export default router;
