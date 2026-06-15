import { studentJobTrayService } from "@/api/services/studentJobTray.service";

export const studentJobService = {
    getAllPendingJobs: async () => {
        const response = await studentJobTrayService.getPendingJobs();
        if (response.success) return response.data;
        return [];
    },
};