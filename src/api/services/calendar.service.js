import { apiCall } from "../client";

export const calendarService = {
    // Fetch all events, optionally filtered by type
    getEvents: (type) =>
        apiCall(`/calendar/events${type && type !== "all" ? `?type=${type}` : ""}`),

    // Create a new personal event
    createEvent: (eventData) =>
        apiCall("/calendar/events", {
            method: "POST",
            body: JSON.stringify(eventData),
        }),

    // Delete an event by ID
    deleteEvent: (eventId) =>
        apiCall(`/calendar/events/${eventId}`, {
            method: "DELETE",
        }),
};