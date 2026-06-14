// src/services/notificationService.js
import { notificationsAPI } from "./api.js";

export const notificationService = {
	/**
	 * Fetches all informational updates and status changes from the server
	 */
	async getAllNotifications() {
		try {
			const response = await notificationsAPI.getNotifications();
			return response.success ? response.data : [];
		} catch (error) {
			console.error("Error fetching notifications:", error);
			return [];
		}
	},

	/**
	 * Communicates with the server to mark a specific notification as read
	 */
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
