import { apiCall } from "../client";


// Schedule & Meetings APIs
export const scheduleService = {
    // Get professor's schedule, meetings, and pending requests
    getScheduleOverview: () => apiCall("/professor/schedule"),

    // Update office hours and weekly timetable
    updateSchedule: (scheduleData) =>
        apiCall("/professor/schedule", {
            method: "PUT",
            body: JSON.stringify(scheduleData),
        }),

    // Create a new meeting/event directly from the schedule view
    createMeeting: (meetingData) =>
        apiCall("/professor/meetings", {
            method: "POST",
            body: JSON.stringify(meetingData),
        }),

    // Accept a meeting request with venue/link details
    acceptMeetingRequest: (requestId, details) =>
        apiCall(`/professor/meetings/${requestId}/accept`, {
            method: "POST",
            body: JSON.stringify(details),
        }),

    // Reject a meeting request with a reason
    rejectMeetingRequest: (requestId, reason) =>
        apiCall(`/professor/meetings/${requestId}/reject`, {
            method: "POST",
            body: JSON.stringify({ reason }),
        }),

    // Propose a new time for a meeting request
    rescheduleMeetingRequest: (requestId, newDateTime) =>
        apiCall(`/professor/meetings/${requestId}/reschedule`, {
            method: "POST",
            body: JSON.stringify({ newDateTime }),
        }),

    // Create a new outgoing meeting request (e.g. professor requesting a meeting with another professor)
    createOutgoingRequest: (requestData) =>
        apiCall("/professor/meetings/outgoing", {
            method: "POST",
            body: JSON.stringify(requestData),
        }),
};