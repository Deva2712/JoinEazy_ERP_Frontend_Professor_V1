// src/services/jobService.js

import { jobTrayAPI } from "./api.js";

export const jobService = {
    async getAllPendingJobs() {
        try {
            const response = await jobTrayAPI.getPendingJobs();
            return response.success ? response.data : [];
        } catch (error) {
            console.error("Error fetching jobs from server:", error);
            return [];
        }
    },
};