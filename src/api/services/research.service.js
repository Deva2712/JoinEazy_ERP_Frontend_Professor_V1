import { apiCall } from "../client";

// Research & Publications APIs

export const researchService = {
    // Aggregates all research data (projects, publications, and applications) into one response
    getResearchDashboard: () => apiCall("/research/dashboard-sync"),

    // Handles creation of new research entries
    createResearch: (data) =>
        apiCall("/research/create", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Handles updates to existing research entries
    updateResearch: (id, data) =>
        apiCall(`/research/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    // API calls for managing specific roles within a research item.
    createRole: (researchId, roleData) =>
        apiCall(`/research/${researchId}/roles/create`, {
            method: "POST",
            body: JSON.stringify(roleData),
        }),

    updateRole: (researchId, roleIndex, roleData) =>
        apiCall(`/research/${researchId}/roles/update/${roleIndex}`, {
            method: "PUT",
            body: JSON.stringify(roleData),
        }),

    // Deletes an open role
    deleteRole: (researchId, roleId) =>
        apiCall(`/research/${researchId}/roles/delete/${roleId}`, {
            method: "DELETE",
        }),

    // Timeline management for tracking project milestones and contributions chronologically
    getTimeline: (researchId) => apiCall(`/research/timeline/${researchId}`),

    addTimelineEvent: (researchId, eventData) =>
        apiCall(`/research/timeline/${researchId}`, {
            method: "POST",
            body: JSON.stringify(eventData),
        }),

    // Deletes a timeline event
    deleteTimelineEvent: (researchId, eventId) =>
        apiCall(`/research/timeline/${researchId}/${eventId}`, {
            method: "DELETE",
        }),

    // Updates an existing milestone in the timeline
    updateTimelineEvent: (researchId, eventId, eventData) =>
        apiCall(`/research/timeline/${researchId}/${eventId}`, {
            method: "PUT",
            body: JSON.stringify(eventData),
        }),

    // Request joining another project/publication
    newApplication: (id, data) =>
        apiCall(`/research/apply/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Handles application status changes
    handleApplication: (applicationId, action, details) =>
        apiCall(`/research/applications/${applicationId}/${action}`, {
            method: "POST",
            body: JSON.stringify(details),
        }),

    updateApplicationStatus: (applicationId, action, details) =>
        apiCall(`/research/applications/${applicationId}/${action}`, {
            method: "POST",
            body: JSON.stringify(details),
        }),

    // Toggles the starred status of a research project or publication.
    toggleStar: (id) =>
        apiCall(`/research/star/${id}`, {
            method: "POST",
        }),

    // Fetches user profiles to display contributors, applicants, and professors.
    getUsers: () => apiCall("/research/users"),

    getUserById: (userId) => apiCall(`/research/users/${userId}`),

    getUserProfile: (userId) => apiCall(`/research/users/profile/${userId}`),

    // Updates a user's profile information (bio, skills, and social URLs).
    updateUserProfile: (userId, profileData) =>
        apiCall(`/research/users/profile/update/${userId}`, {
            method: "PUT",
            body: JSON.stringify(profileData),
        }),
};