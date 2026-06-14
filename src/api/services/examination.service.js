import { apiCall} from "../client";

// Examination APIs (Student)
export const examinationService = {
    /**
     * Single call that hydrates the entire ExaminationUI in one round-trip.
     * Returns { examSchedule, results, gradeHistory, revaluationRequests }.
     */
    getOverview: () => apiCall("/student/examination/overview"),

    /** Returns the upcoming exam schedule for the student. */
    getSchedule: () => apiCall("/student/examination/schedule"),

    /**
     * Returns result records, optionally filtered by semester.
     * @param {string|null} semester  e.g. "Semester 4", or null for all
     */
    getResults: (semester = null) =>
        apiCall(
            `/student/examination/results${semester ? `?semester=${encodeURIComponent(semester)}` : ""}`
        ),

    /**
     * Returns grade history entries, optionally filtered by semester.
     * @param {string|null} semester
     */
    getGradeHistory: (semester = null) =>
        apiCall(
            `/student/examination/grades${semester ? `?semester=${encodeURIComponent(semester)}` : ""}`
        ),

    /** Returns all revaluation requests submitted by the student. */
    getRevaluations: () => apiCall("/student/examination/revaluations"),

    /**
     * Submits a new revaluation request.
     * @param {object} data  — spread of the result row plus { reason, priority }
     */
    submitRevaluation: (data) =>
        apiCall("/student/examination/revaluations", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /**
     * Updates an existing revaluation request (e.g. after rejection).
     * @param {string} requestId
     * @param {object} updates  — partial fields to merge
     */
    updateRevaluation: (requestId, updates) =>
        apiCall(`/student/examination/revaluations/${requestId}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        }),

    /**
     * Cancels (deletes) a pending revaluation request.
     * @param {string} requestId
     */
    cancelRevaluation: (requestId) =>
        apiCall(`/student/examination/revaluations/${requestId}`, {
            method: "DELETE",
        }),
};