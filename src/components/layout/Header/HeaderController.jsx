// src/components/layout/Header/HeaderController.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderUI from "./HeaderUI";
import NotificationsController from "../Notifications/NotificationsController";
import StudentNotificationsController from "../StudentNotifications/StudentNotificationsController";
import JobTrayController from "../JobTray/JobTrayController";
import StudentJobTrayController from "../StudentJobTray/StudentJobTrayController";
import { useNotifications } from "../../../context/NotificationContext";
import { useStudentNotifications } from "../../../context/StudentNotificationContext";
import { useJobs } from "../../../context/JobTrayContext";
import { useStudentJobs } from "../../../context/StudentJobTrayContext";
import { useAuth } from "../../../context/AuthContext";

const HeaderController = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const isStudent = user?.role === "student";

	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [isJobTrayOpen, setIsJobTrayOpen] = useState(false);

	// Pull the correct unread indicator based on role
	const { hasUnreadNotifications: profUnread } = useNotifications();
	const { hasUnreadNotifications: studentUnread } = useStudentNotifications();
	const hasUnreadNotifications = isStudent ? studentUnread : profUnread;

	const { hasUnreadJobs: profJobUnread } = useJobs();
	const { hasUnreadJobs: studentJobUnread } = useStudentJobs();
	const hasUnreadJobs = isStudent ? studentJobUnread : profJobUnread;

	const dashboardLink = "/dashboard";
	const guideLink = "/guide";
	const feedback_link = "https://forms.gle/9LLVds3Y3jq4gAiQ7";

	return (
		<>
			<HeaderUI
				dashboardLink={dashboardLink}
				guideLink={guideLink}
				feedback_link={feedback_link}
				hasUnreadNotifications={hasUnreadNotifications}
				hasUnreadJobs={hasUnreadJobs}
				handleNotificationClick={() => setIsNotificationsOpen(true)}
				handleJobTrayClick={() => setIsJobTrayOpen(true)}
				handleProfileClick={() => navigate("/settings")}
				profile_image={null}
			/>

			{/* Role-specific notification modal */}
			{isStudent ? (
				<StudentNotificationsController
					isOpen={isNotificationsOpen}
					onClose={() => setIsNotificationsOpen(false)}
				/>
			) : (
				<NotificationsController
					isOpen={isNotificationsOpen}
					onClose={() => setIsNotificationsOpen(false)}
				/>
			)}

			{/* Role-specific job tray modal */}
			{isStudent ? (
				<StudentJobTrayController
					isOpen={isJobTrayOpen}
					onClose={() => setIsJobTrayOpen(false)}
				/>
			) : (
				<JobTrayController
					isOpen={isJobTrayOpen}
					onClose={() => setIsJobTrayOpen(false)}
				/>
			)}
		</>
	);
};

export default HeaderController;