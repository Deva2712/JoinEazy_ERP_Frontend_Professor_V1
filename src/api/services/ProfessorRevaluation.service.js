// src/api/services/profRevaluation.service.js
// Professor-side revaluation APIs

import { apiCall } from "../client";

export const profRevaluationService = {
    /**
     * Fetches all data for the professor revaluation dashboard.
     * Returns { pendingRequests, resolvedRequests, myCourses }
     */
    getOverview: () => apiCall("/professor/revaluation/overview"),

    /**
     * Gets all pending revaluation requests assigned to this professor.
     * @param {string|null} subjectCode  — optional filter
     */
    getPendingRequests: (subjectCode = null) =>
        apiCall(
            `/professor/revaluation/requests?status=Pending${
                subjectCode ? `&subject=${encodeURIComponent(subjectCode)}` : ""
            }`
        ),

    /**
     * Gets resolved (Approved/Rejected) revaluation requests.
     */
    getResolvedRequests: () =>
        apiCall("/professor/revaluation/requests?status=resolved"),

    /**
     * Accepts a revaluation request (moves it to UnderReview).
     * @param {string} requestId
     */
    acceptRequest: (requestId) =>
        apiCall(`/professor/revaluation/requests/${requestId}/accept`, {
            method: "POST",
        }),

    /**
     * Uploads revised result marks for a revaluation request.
     * @param {string} requestId
     * @param {object} resultData — { revisedMarks, revisedGrade, remarks }
     */
    uploadResult: (requestId, resultData) =>
        apiCall(`/professor/revaluation/requests/${requestId}/result`, {
            method: "POST",
            body: JSON.stringify(resultData),
        }),

    /**
     * Rejects a revaluation request.
     * @param {string} requestId
     * @param {string} reason
     */
    rejectRequest: (requestId, reason) =>
        apiCall(`/professor/revaluation/requests/${requestId}/reject`, {
            method: "POST",
            body: JSON.stringify({ reason }),
        }),
};
