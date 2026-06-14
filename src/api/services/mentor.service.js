import { apiCall } from "../client";

export const mentorService = {
    getDashboard: () => apiCall("/mentor/dashboard"),

    requestMeeting: (data) =>
        apiCall("/mentor/meetings/request", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    submitFeedback: (data) =>
        apiCall("/mentor/feedback", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};