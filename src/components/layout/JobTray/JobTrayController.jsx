// src/components/layout/JobTray/JobTrayController.jsx

import React, { useState, useEffect } from "react";
import JobTrayUI from "./JobTrayUI";
import { useJobs } from "../../../context/JobTrayContext";

/**
 * Controller for the Job Tray modal.
 * Manages state for job filtering and coordinates data synchronization
 * with the JobTrayContext when the tray is opened.
 */
const JobTrayController = ({ isOpen, onClose }) => {
  const { jobs, isLoading, refreshJobs, hasFetched, hasUnreadJobs, markJobAsRead } = useJobs();
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    // Refresh job data whenever the tray is opened
    if (isOpen) {
      refreshJobs();
    }
  }, [isOpen]);

  const markAllAsRead = () => {
    jobs.forEach(job => {
      if (!job.isRead) markJobAsRead(job.id);
    });
  };

  const filteredJobs = filter === "ALL" 
  ? jobs 
  : jobs.filter(job => job.type.startsWith(filter));

  return (
    <JobTrayUI
      isOpen={isOpen}
      onClose={onClose}
      jobs={jobs}
      displayJobs={filteredJobs}
      filter={filter}
      setFilter={setFilter}
      hasUnreadJobs={hasUnreadJobs}
      isLoading={isLoading && !hasFetched}
      isRefreshing={isLoading && hasFetched}
      onRefresh={refreshJobs}
      onMarkAsRead={markJobAsRead}
      onMarkAllAsRead={markAllAsRead}
    />
  );
};

export default JobTrayController;