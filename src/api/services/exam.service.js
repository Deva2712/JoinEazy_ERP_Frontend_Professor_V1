import { apiCall } from "../client";
// Exam APIs
export const examService = {
    // Fetches the complete exam schedule for the user
    getDuties: () => apiCall("/exams/duties"),

    // Handles check-in or rejection status
    updateDutyStatus: (id, payload) =>
        apiCall("/exams/duty/status", {
            method: "POST",
            body: { id, ...payload },
        }),
};
