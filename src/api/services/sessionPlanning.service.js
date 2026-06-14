import { apiCall } from "../client";

export const sessionPlanningService = {
    // Fetches all course schedules for the user
    getSchedules: () => apiCall("/sessions/schedules"),
    
    // Fetches classes scheduled specifically for the current day
    getTodaysClasses: () => apiCall("/sessions/today"),
    
    // Submits teacher reflections for a specific session
    saveReflection: (data) =>
        apiCall("/sessions/reflections", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Retrieves reflections, optionally filtered by section
    getReflections: (sectionId) =>
        apiCall(
            `/sessions/reflections${sectionId ? `?sectionId=${sectionId}` : ""}`
        ),

    // Retrieves uploaded documents (Syllabus, Lesson Plans, etc.) for a course
    getDocuments: (courseId) => apiCall(`/sessions/documents/${courseId}`),
    
    // Upload documents for a course
    uploadDocuments: (courseId, filesMap) => {
        // Extract names to pass to mock handler
        const fileNames = {};
        Object.keys(filesMap).forEach(key => {
            fileNames[key] = filesMap[key].name;
        });

        return apiCall(`/sessions/documents/${courseId}/bulk`, {
            method: "POST",
            body: JSON.stringify({ 
                courseId, 
                docs: Object.keys(filesMap),
                fileNames: fileNames // Added for mock realism
            }),
        });
    },
};