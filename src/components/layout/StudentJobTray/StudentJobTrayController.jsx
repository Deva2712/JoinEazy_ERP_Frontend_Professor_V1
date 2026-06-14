// src/components/layout/StudentJobTray/StudentJobTrayController.jsx

import React, { useState, useEffect } from "react";
import StudentJobTrayUI from "./StudentJobTrayUI";
import { useStudentJobs } from "../../../context/StudentJobTrayContext";

/**
 * Controller for the Student Job Tray modal.
 * Mirrors JobTrayController exactly — only the context hook differs.
 */
const StudentJobTrayController = ({ isOpen, onClose }) => {
    const { jobs, isLoading, refreshJobs, hasFetched, hasUnreadJobs, markJobAsRead } =
        useStudentJobs();
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        if (isOpen) refreshJobs();
    }, [isOpen]);

    const markAllAsRead = () => {
        jobs.forEach((job) => {
            if (!job.isRead) markJobAsRead(job.id);
        });
    };

    const filteredJobs =
        filter === "ALL"
            ? jobs
            : jobs.filter((job) => job.type.startsWith(filter));

    return (
        <StudentJobTrayUI
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

export default StudentJobTrayController;