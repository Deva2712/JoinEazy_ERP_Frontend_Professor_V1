import { apiCall } from "../client";

// Student Schedule APIs

export const studentScheduleService = {

    // Get the student's timetable
    getTimetable: () => apiCall("/student/timetable"),

    // Get tasks for a specific date (optional)
    getTasks: (date) =>
        apiCall(`/student/tasks${date ? `?date=${date}` : ""}`),
    
    // Create a new task
    createTask: (taskData) =>
        apiCall("/student/tasks", {
            method: "POST",
            body: JSON.stringify(taskData),
        }),

    // toggle task completion status
    toggleTask: (taskId) =>
        apiCall(`/student/tasks/${taskId}/toggle`, {
            method: "PATCH",
        }),
    // Delete a task
    deleteTask: (taskId) =>
        apiCall(`/student/tasks/${taskId}`, {
            method: "DELETE",
        }),

    // Get all sessions for the student
    getSessions: () => apiCall("/student/sessions"),
};