// src/api/services/revaluation.service.js
// Student-side revaluation APIs

import { apiCall } from "../client";

export const revaluationService = {
    /**
     * Fetches all data needed for the student revaluation page in one call.
     * Returns { eligibleSubjects, requests }
     */
    getOverview: () => apiCall("/student/revaluation/overview"),

    /** Returns subjects eligible for revaluation (results declared). */
    getEligibleSubjects: () => apiCall("/student/revaluation/subjects"),

    /** Returns all revaluation requests submitted by the student. */
    getRequests: () => apiCall("/student/revaluation/requests"),

    /**
     * Submits a new revaluation request.
     * @param {object} data — { subjectCode, subjectName, semester, examType, reason, priority }
     */
    submitRequest: (data) =>
        apiCall("/student/revaluation/requests", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /**
     * Cancels a pending revaluation request.
     * @param {string} requestId
     */
    cancelRequest: (requestId) =>
        apiCall(`/student/revaluation/requests/${requestId}`, {
            method: "DELETE",
        }),
};
