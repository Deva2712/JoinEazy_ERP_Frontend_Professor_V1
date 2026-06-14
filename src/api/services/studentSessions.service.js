import { apiCall } from "../client";


// Service for student session-related API calls
export const studentSessionsService = {
    getSessions: () => apiCall("/student/sessions"),
};