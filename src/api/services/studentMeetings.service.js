import { apiCall } from "../client";

// Student Meetings APIs

export const studentMeetingsService = {
    // Get all meeting requests for a specific cohort
    getMeetingRequests: (cohortId) =>
        apiCall(`/cohort/${cohortId}/student/meeting-requests`),

    // Get accepted meetings for a specific cohort
    getAcceptedMeetings: (cohortId) =>
        apiCall(`/cohort/${cohortId}/student/meetings`),

    // Create a new meeting request for a professor
    createMeetingRequest: (cohortId, meetingData) =>
        apiCall(`/cohort/${cohortId}/student/meeting-requests`, {
            method: "POST",
            body: JSON.stringify(meetingData),
        }),

    // Cancel a pending meeting request
    cancelMeetingRequest: (cohortId, requestId) =>
        apiCall(`/cohort/${cohortId}/student/meeting-requests/${requestId}`, {
            method: "DELETE",
        }),
};
