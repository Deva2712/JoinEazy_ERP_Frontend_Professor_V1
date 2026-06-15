import { studentJobTrayService as jobTrayService } from "@/api/services/studentJobTray.service";
export const jobService = {
    async getAllPendingJobs() {
        try {
            const response = await jobTrayService.getPendingJobs();
            return response.success ? response.data : [];
        } catch (error) {
            console.error("Error fetching jobs:", error);
            return [];
        }
    },
};