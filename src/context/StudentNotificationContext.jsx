// src/context/StudentNotificationContext.jsx

import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { studentNotificationsAPI } from "../services/api";

const StudentNotificationContext = createContext(null);

export const StudentNotificationProvider = ({ children }) => {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);

	const refreshNotifications = useCallback(async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const result = await studentNotificationsAPI.getNotifications();
			if (result.success) setNotifications(result.data);
			setHasFetched(true);
		} catch (err) {
			console.error("StudentNotificationContext - fetch error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	const markAsRead = useCallback((id) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
		);
		// Optionally persist: await markStudentNotificationRead(id);
	}, []);

	const markAllAsRead = useCallback(() => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
		// Optionally persist: await markAllStudentNotificationsRead();
	}, []);

	const hasUnreadNotifications = notifications.some((n) => !n.isRead);

	return (
		<StudentNotificationContext.Provider
			value={{
				notifications,
				isLoading,
				hasFetched,
				hasUnreadNotifications,
				refreshNotifications,
				markAsRead,
				markAllAsRead,
			}}
		>
			{children}
		</StudentNotificationContext.Provider>
	);
};

export const useStudentNotifications = () => {
	const ctx = useContext(StudentNotificationContext);
	if (!ctx)
		throw new Error(
			"useStudentNotifications must be used within a StudentNotificationProvider",
		);
	return ctx;
};