// src/components/layout/StudentNotifications/StudentNotificationsController.jsx

import React, { useState, useEffect } from "react";
import StudentNotificationUI from "./StudentNotificationUI";
import { useStudentNotifications } from "../../../context/StudentNotificationContext";

/**
 * Controller for the student Notifications modal.
 * Uses StudentNotificationContext — completely isolated from the professor flow.
 */
const StudentNotificationsController = ({ isOpen, onClose }) => {
	const {
		notifications,
		isLoading,
		hasFetched,
		hasUnreadNotifications,
		refreshNotifications,
		markAsRead,
		markAllAsRead,
	} = useStudentNotifications();

	const [filter, setFilter] = useState("ALL");

	useEffect(() => {
		if (isOpen) refreshNotifications();
	}, [isOpen]);

	// Only show unread notifications matching the active category filter
	const displayNotifications = notifications.filter((n) => {
		const matchesCategory =
			filter === "ALL" || n.type.startsWith(filter);
		return matchesCategory && !n.isRead;
	});

	return (
		<StudentNotificationUI
			isOpen={isOpen}
			onClose={onClose}
			notifications={notifications}
			displayNotifications={displayNotifications}
			filter={filter}
			setFilter={setFilter}
			hasUnreadNotifications={hasUnreadNotifications}
			isLoading={isLoading && !hasFetched}
			onMarkAsRead={markAsRead}
			onMarkAllAsRead={markAllAsRead}
		/>
	);
};

export default StudentNotificationsController;