// src/api/services/Lor.service.js
import { apiCall } from "../client";

export const lorService = {
  getLorRequests: () => apiCall("/lor/requests"),

  approveRequest: (requestId, remarks = "") =>
    apiCall(`/lor/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved", professorRemarks: remarks }),
    }),

  rejectRequest: (requestId, remarks) =>
    apiCall(`/lor/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected", professorRemarks: remarks }),
    }),

  // Professor uploads final LoR — multipart
  submitLor: (requestId, lorFile, remarks = "") => {
    const fd = new FormData();
    fd.append("lorFile", lorFile);               // field name matches backend
    if (remarks) fd.append("professorRemarks", remarks);
    return apiCall(`/lor/requests/${requestId}/submit`, {
      method: "POST",
      body: fd,
    });
  },

  requestMeeting: (lorRequestId, meetingData) =>
    apiCall(`/lor/requests/${lorRequestId}/meeting`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meetingData),
    }),

  acceptMeeting: (lorRequestId) =>
    apiCall(`/lor/requests/${lorRequestId}/meeting`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingStatus: "Accepted" }),
    }),

  cancelMeeting: (lorRequestId) =>
    apiCall(`/lor/requests/${lorRequestId}/meeting`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingStatus: "Cancelled" }),
    }),
};