import eventModel from "../models/eventModel.js";
//get all upcoming events
export const getUpcomingEvents = async (req, res) => {
    try {
        const events = await eventModel.find({ status: "upcoming" });

        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching upcoming events",
            error: error.message,
        });
    }
};

export const getUserEvents = async (req, res) => {
    try {
        // Retrieve the userId from the Firebase token
        const userId = req.firebaseId;

        // Fetch events where the user is listed as an attendee
        const userEvents = await eventModel.find({
            "attendees.userId": userId,
        });

        // Respond with the events
        res.status(200).json({
            success: true,
            events: userEvents,
        });
    } catch (error) {
        console.error("Error fetching user events:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user events",
            error: error.message,
        });
    }
};

//For users to RSVP to attend an event.

export const rsvpToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.firebaseId;

        const event = await eventModel.findOne({ eventId });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Check if user has already RSVP'd
        const isAlreadyAttending = event.attendees.some(
            (attendee) => attendee.userId === userId
        );
        if (isAlreadyAttending) {
            return res.status(400).json({
                success: false,
                message: "User has already RSVP'd to this event",
            });
        }

        // Add the user to attendees
        event.attendees.push({ userId });

        await event.save();

        res.status(200).json({
            success: true,
            message: "RSVP successful",
            event,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error RSVPing to event",
            error: error.message,
        });
    }
};

export const updateEventStatus = async (req, res) => {
    const { eventId } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ["upcoming", "active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid status value. Allowed values are: 'upcoming', 'active', 'completed', 'cancelled'.",
        });
    }

    try {
        // Find the event by eventId and update the status
        const event = await eventModel.findOneAndUpdate(
            { eventId },
            { status },
            { new: true } // Return the updated document
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: `Event with id ${eventId} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event status updated successfully.",
            event,
        });
    } catch (error) {
        console.error("Error updating event status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};
