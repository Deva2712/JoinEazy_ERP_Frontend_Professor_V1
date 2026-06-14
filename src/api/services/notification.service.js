import { apiCall } from "../client";

// Notifications APIs
export const notificationsService = {
    // Fetches all informational updates and status changes
    getNotifications: () => apiCall("/notifications"),
    // Placeholder for marking items as read
    markAsRead: (id) => apiCall(`/notifications/${id}/read`, { method: "POST" }),
};