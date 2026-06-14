// src/components/layout/BottomNav/BottomNavController.jsx

import React, { useState } from "react";
import { useNotifications } from "../../../context/NotificationContext";
import { useJobs } from "../../../context/JobTrayContext";
import { useAuth } from "../../../context/AuthContext";
import BottomNavUI from "./BottomNavUI";
import NotificationsController from "../Notifications/NotificationsController";
import JobTrayController from "../JobTray/JobTrayController";

/**
 * Controller for the mobile bottom navigation bar.
 * Manages modal states for Notifications and Job Tray and interacts with global context.
 */
const BottomNavController = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isJobTrayOpen, setIsJobTrayOpen] = useState(false);
  
  const { notifications, hasUnreadNotifications, markAsRead } = useNotifications();
  const { jobs } = useJobs();
  const { isAuthenticated, profileImage } = useAuth();
  
  const hasUnreadJobs = jobs.some((job) => !job.isRead);

  // Modal Handlers
  const handleNotificationClick = () => setIsNotificationsOpen(true);
  const handleCloseNotifications = () => setIsNotificationsOpen(false);
  
  const handleJobTrayClick = () => setIsJobTrayOpen(true);
  const handleCloseJobTray = () => setIsJobTrayOpen(false);

  return (
    <>
      <BottomNavUI
        hasUnreadNotifications={hasUnreadNotifications}
        hasUnreadJobs={hasUnreadJobs}
        handleNotificationClick={handleNotificationClick}
        handleJobTrayClick={handleJobTrayClick}
        isAuthenticated={isAuthenticated}
        profileImage={profileImage}
      />

      {/* Notifications modal overlay */}
      <NotificationsController
        isOpen={isNotificationsOpen}
        onClose={handleCloseNotifications}
        notifications={notifications}
        onNotificationRead={markAsRead}
      />

      {/* Job tray modal overlay */}
      <JobTrayController
        isOpen={isJobTrayOpen}
        onClose={handleCloseJobTray}
      />
    </>
  );
};

export default BottomNavController;