import { apiCall } from "../client";

// Attendance APIs
export const attendanceService = {

    // Fetches attendance logs for the professor
    getProfessorLogs: () => apiCall("/professor/logs"),

    // Fetches attendance logs for a specific cohort.
    getAttendanceLogs: (cohortId) => apiCall(`/attendance/logs/${cohortId}`),

    // Marks attendance for a specific course.
    markAttendance: (courseId, data, cohortId) =>
        apiCall(
            `/courses/${courseId}/attendance${cohortId ? `?cohortId=${cohortId}` : ""}`,
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        ),
};