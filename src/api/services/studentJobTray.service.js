import { apiCall } from "../client";

// Student Job Tray API
export const studentJobTrayService = {
    // Get pending jobs for the student
    getPendingJobs: () => apiCall("/student/job-tray"),
};