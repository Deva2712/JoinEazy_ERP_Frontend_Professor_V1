import { apiCall } from "../client";


export const studentCoursesService = {
    /**
     * Single call to hydrate the Registration tab.
     * Returns { registrationConfig, registrationCourses, myRegistrations }
     */
    getOverview: () => apiCall("/student/courses/overview"),
 
    /** Submit a registration for a set of selected courses. */
    submitRegistration: (courses) =>
        apiCall("/student/courses/register", {
            method: "POST",
            body: JSON.stringify({ courses }),
        }),
 
    /** Cancel a single pending registration by ID. */
    cancelRegistration: (regId) =>
        apiCall(`/student/courses/register/${regId}`, {
            method: "DELETE",
        }),
 
    /**
     * Swap one elective registration for another course.
     * @param {string} regId       — existing registration to replace
     * @param {string} newCourseId — course to swap to
     */
    swapElective: (regId, newCourseId) =>
        apiCall(`/student/courses/register/${regId}/swap`, {
            method: "PATCH",
            body: JSON.stringify({ newCourseId }),
        }),
 
    /** Submit feedback ratings + comment for a cohort. */
    submitFeedback: (cohortId, feedback) =>
        apiCall(`/student/courses/${cohortId}/feedback`, {
            method: "POST",
            body: JSON.stringify(feedback),
        }),
};