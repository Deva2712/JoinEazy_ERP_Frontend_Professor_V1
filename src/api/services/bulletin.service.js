import { apiCall } from "../client";

// Bulletin APIs
export const bulletinService = {
    // Fetches bulletins based on level (institution, department, course)
    getBulletins: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/bulletins${query ? `?${query}` : ""}`);
    },

    // Creates a new bulletin with priority and attachment support
    createBulletin: (data) =>
        apiCall("/bulletins", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Deletes a specific bulletin
    deleteBulletin: (bulletinId) =>
        apiCall(`/bulletins/${bulletinId}`, {
            method: "DELETE",
        }),
};