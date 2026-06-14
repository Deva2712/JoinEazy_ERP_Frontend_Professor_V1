import { apiCall } from "../client";

// Maintenance Requests APIs
export const maintenanceService = {
    // Retrieves all maintenance requests
    getMyRequests: () => apiCall("/maintenance/my-requests", { method: "GET" }),

    // Submits a new maintenance request
    createRequest: (requestData) =>
        apiCall("/maintenance/requests", {
            method: "POST",
            body: JSON.stringify(requestData),
        }),

    // Updates the status of an existing maintenance request
    updateStatus: (requestId, statusData) =>
        apiCall(`/maintenance/requests/${requestId}/status`, {
            method: "PATCH",
            body: JSON.stringify(statusData),
        }),
};