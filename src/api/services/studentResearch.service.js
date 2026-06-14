import { apiCall } from "../client";
// Student Research APIs
export const studentResearchService = {
    /**
     * Single call to hydrate the entire StudentResearchUI in one round-trip.
     * Returns { myProjects, myPublications, availableProjects, availablePublications,
     *           myApplications, allUsers }
     */
    getDashboard: () => apiCall("/student/research/dashboard"),

    /** Submit an application to a research project or publication. */
    applyToItem: (itemId, data) =>
        apiCall(`/student/research/apply/${itemId}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** Toggle starred status on a research item. */
    toggleStar: (itemId) =>
        apiCall(`/student/research/star/${itemId}`, {
            method: "POST",
        }),
};