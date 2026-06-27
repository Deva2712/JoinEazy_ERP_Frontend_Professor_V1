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
    
    // Upload documents for a course — actual file content bhejte hain (FormData),
    // sirf naam nahi (pehle yahi galti thi: file kabhi backend tak pahunchti nahi thi)
    uploadDocuments: (courseId, filesMap) => {
        const fd = new FormData();
        Object.entries(filesMap).forEach(([docType, file]) => {
            fd.append("docTypes", docType);     // multiple docTypes[] entries
            fd.append(docType, file);           // field name = docType key, multer.fields() se match hoga
        });

        return apiCall(`/sessions/documents/${courseId}/bulk`, {
            method: "POST",
            body: fd,
        });
    },
};