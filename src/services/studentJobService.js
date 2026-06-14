import { studentJobTrayAPI } from "./api";

export const studentJobService = {
    getAllPendingJobs: async () => {
        const response = await studentJobTrayAPI.getPendingJobs();
        if (response.success) return response.data;
        return [];
    },
};