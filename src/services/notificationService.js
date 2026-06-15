// src/services/notificationService.js
import { notificationsService as notificationsAPI } from "@/api/services/notification.service";

export const notificationService = {
    async getAllNotifications() {
        try {
            const response = await notificationsAPI.getNotifications();
            return response.success ? response.data : [];
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    },

    async markAsRead(id) {
        try {
            await notificationsAPI.markAsRead(id);
            return true;
        } catch (error) {
            console.error("Error marking notification as read:", error);
            return false;
        }
    },
};