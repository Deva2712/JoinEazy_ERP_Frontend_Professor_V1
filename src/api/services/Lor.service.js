// src/api/services/Lor.service.js
import { apiCall } from "../client";
import { USE_MOCK_API, FINAL_API_BASE_URL } from "../config";

export const lorService = {
    // Fetch all LoR requests assigned to the logged-in professor
    getLorRequests: () => apiCall("/lor/requests"),

    // Approve a request (optionally with remarks)
    approveRequest: (requestId, remarks = "") =>
        apiCall(`/lor/requests/${requestId}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "Approved", professorRemarks: remarks }),
        }),

    // Reject a request with a reason + optional supporting doc filename
    rejectRequest: (requestId, remarks, rejectionDocFileName = null) =>
        apiCall(`/lor/requests/${requestId}`, {
            method: "PATCH",
            body: JSON.stringify({
                status: "Rejected",
                professorRemarks: remarks,
                ...(rejectionDocFileName && { rejectionDocFileName }),
            }),
        }),

    // Upload the final LoR document and mark as Submitted (routes to registrar)
    submitLor: (requestId, lorFile, remarks = "") => {
        if (USE_MOCK_API) {
            return apiCall(`/lor/requests/${requestId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    status: "Submitted",
                    lorFileUrl: lorFile.name,
                    professorRemarks: remarks,
                }),
            });
        }
        const formData = new FormData();
        formData.append("lorFile", lorFile);
        formData.append("status", "Submitted");
        if (remarks) formData.append("professorRemarks", remarks);
        return fetch(`${FINAL_API_BASE_URL}/lor/requests/${requestId}`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        }).then((r) => r.json());
    },

    // ── Meeting methods (either side can initiate) ──────────────────────────

    // Request a meeting on a LOR request
    requestMeeting: (lorRequestId, meetingData) =>
        apiCall(`/lor/requests/${lorRequestId}/meeting`, {
            method: "POST",
            body: JSON.stringify(meetingData),
        }),

    // Accept a pending meeting
    acceptMeeting: (lorRequestId) =>
        apiCall(`/lor/requests/${lorRequestId}/meeting`, {
            method: "PATCH",
            body: JSON.stringify({ meetingStatus: "Accepted" }),
        }),

    // Cancel / decline a meeting
    cancelMeeting: (lorRequestId) =>
        apiCall(`/lor/requests/${lorRequestId}/meeting`, {
            method: "PATCH",
            body: JSON.stringify({ meetingStatus: "Cancelled" }),
        }),
};