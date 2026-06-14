import { apiCall } from "../client";

export const advancesService = {
    // Retrieves the list of all advances
    getAdvances: () => apiCall("/advances/list"),

    // Submits a new advance request
    createAdvance: (advanceData) =>
        apiCall("/advances/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(advanceData),
        }),

    // Updates an existing advance request.
    updateAdvance: (advanceId, advanceData) =>
        apiCall(`/advances/${advanceId}/update`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(advanceData),
        }),

    // Deletes a specific advance request
    deleteAdvance: (advanceId) =>
        apiCall(`/advances/${advanceId}`, {
            method: "DELETE",
        }),
};
