import { apiCall } from "../client";


// Leave Management APIs
export const leaveService = {
    // Retrieves the user's leave balance and history
    getApplications: () => apiCall("/leaves/applications"),

    // Submits a new leave application with structured timing data
    createApplication: (data) =>
        apiCall("/leaves/apply", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Updates an existing leave application (used for resubmission or editing)
    updateApplication: (id, data) =>
        apiCall(`/leaves/update/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Updates approval status by HoD or HR
    updateApproval: (id, role, action, remark = null) =>
        apiCall(`/leaves/approve/${id}`, {
            method: "POST",
            body: JSON.stringify({ role, action, remark }),
        }),

    // Responds to an incoming substitution request
    respondToSubstitution: (id, action) =>
        apiCall(`/leaves/substitutions/${id}`, {
            method: "POST",
            body: JSON.stringify({ action }),
        }),
};
