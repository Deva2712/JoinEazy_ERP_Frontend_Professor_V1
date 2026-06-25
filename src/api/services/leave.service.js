// src/api/services/leave.service.js
import { apiCall } from "../client";

const buildLeavePayload = (data) => {
  if (data.supporting_doc_file instanceof File) {
    const fd = new FormData();
    const { supporting_doc_file, supporting_doc_link, timings, ...rest } = data;
    Object.entries(rest).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v);
    });
    if (timings?.startTime) fd.append("timings[startTime]", timings.startTime);
    if (timings?.endTime)   fd.append("timings[endTime]",   timings.endTime);
    if (supporting_doc_link) fd.append("supporting_doc_link", supporting_doc_link);
    fd.append("supporting_doc", supporting_doc_file);
    return { body: fd }; // Content-Type auto set hoga multipart/form-data
  }
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};

export const leaveService = {
  getApplications: () => apiCall("/leaves/applications"),

  createApplication: (data) =>
    apiCall("/leaves/apply", {
      method: "POST",
      ...buildLeavePayload(data),
    }),

  updateApplication: (id, data) =>
    apiCall(`/leaves/update/${id}`, {
      method: "POST",
      ...buildLeavePayload(data),
    }),

  updateApproval: (id, role, action, remark = null) =>
    apiCall(`/leaves/approve/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, action, remark }),
    }),

  respondToSubstitution: (id, action) =>
    apiCall(`/leaves/substitutions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }),
};