import { apiCall } from "../client";


// Asset Requests APIs
export const assetService = {
    // Retrieves the list of all campus assets
    getAssets: () => apiCall("/assets/list"),

    // Retrieves booking requests associated with the user
    getRequests: () => apiCall("/assets/requests"),

    // Creates a new asset booking request
    createRequest: (requestData) =>
        apiCall("/assets/requests", {
            method: "POST",
            body: JSON.stringify(requestData),
        }),

    // Updates an existing asset booking request
    updateRequest: (requestId, requestData) =>
        apiCall(`/assets/requests/${requestId}`, {
            method: "PUT",
            body: JSON.stringify(requestData),
        }),
};
