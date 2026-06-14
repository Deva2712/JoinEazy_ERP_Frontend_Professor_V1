import { apiCall } from "../client";

import { USE_MOCK_API, FINAL_API_BASE_URL } from "../config";
// --- REGISTRAR ---
export const registrarService = {
    getOverview: () => apiCall("/registrar/overview"),

    getRequests: () => apiCall("/registrar/requests"),

    createRequest: (data, file = null) => {
        if (USE_MOCK_API) {
            return apiCall("/registrar/requests", {
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    ...(file && { supportingDocFileName: file.name }),
                }),
            });
        }

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            Object.entries(data).forEach(([k, v]) => formData.append(k, v));
            return fetch(`${FINAL_API_BASE_URL}/registrar/requests`, {
                method: "POST",
                credentials: "include",
                body: formData,
            }).then((r) => r.json());
        }

        return apiCall("/registrar/requests", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getRequestById: (requestId) =>
        apiCall(`/registrar/requests/${requestId}`),

    updateRequest: (requestId, updates) =>
        apiCall(`/registrar/requests/${requestId}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        }),

    cancelRequest: (requestId) =>
        apiCall(`/registrar/requests/${requestId}`, {
            method: "DELETE",
        }),
};