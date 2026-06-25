// src/api/services/bulletin.service.js
import { apiCall } from "../client";

const buildBulletinPayload = (data) => {
  if (data.attachment instanceof File) {
    const fd = new FormData();
    const { attachment, ...rest } = data;
    Object.entries(rest).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, String(v));
    });
    fd.append("attachment", attachment); // field name matches backend multer("attachment")
    return { body: fd };
  }
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};

export const bulletinService = {
  getBulletins: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/bulletins${query ? `?${query}` : ""}`);
  },

  createBulletin: (data) =>
    apiCall("/bulletins", {
      method: "POST",
      ...buildBulletinPayload(data),
    }),

  deleteBulletin: (bulletinId) =>
    apiCall(`/bulletins/${bulletinId}`, {
      method: "DELETE",
    }),
};