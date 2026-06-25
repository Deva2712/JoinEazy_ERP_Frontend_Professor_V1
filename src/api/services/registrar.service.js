// src/api/services/registrar.service.js
import { apiCall } from "../client";

export const registrarService = {
  getOverview: () => apiCall("/registrar/overview"),

  getRequests: () => apiCall("/registrar/requests"),

  // data — form fields, file — File object (optional, for LoR supporting doc)
  createRequest: (data, file = null) => {
    if (file instanceof File) {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, String(v));
      });
      fd.append("file", file);
      return apiCall("/registrar/requests", { method: "POST", body: fd });
    }
    return apiCall("/registrar/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  getRequestById: (requestId) => apiCall(`/registrar/requests/${requestId}`),

  updateRequest: (requestId, updates) =>
    apiCall(`/registrar/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }),

  cancelRequest: (requestId) =>
    apiCall(`/registrar/requests/${requestId}`, { method: "DELETE" }),
};