import { apiCall } from "../client";

export const studentNotificationsService = {
    // Get all notifications for the student
    getNotifications: () => apiCall("/student/notifications"),
    // Mark a specific notification as read
    markAsRead: (id) => apiCall(`/student/notifications/${id}/read`,
         { method: "POST" }),
};