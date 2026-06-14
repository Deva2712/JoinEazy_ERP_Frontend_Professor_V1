import { apiCall} from "../client";
import { FINAL_API_BASE_URL } from "../config";

// Student Profile APIs
export const studentProfileService = {
    /**
     * Single call to hydrate the entire StudentProfileUI in one round-trip.
     * Returns { studentData, portfolioData }
     */
    getProfile: () => apiCall("/student/profile"),

    /** Save core profile fields (personal, contact, family, academic, etc.) */
    updateProfile: (data) =>
        apiCall("/student/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    /** Save portfolio-related fields (entrance exams, documents, portfolio links) */
    updatePortfolio: (data) =>
        apiCall("/student/profile/portfolio", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    /** Upload a document (marksheet, certificate, etc.) */
    uploadDocument: (file, docType) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);
        return fetch(`${FINAL_API_BASE_URL}/student/profile/documents`, {
            method: "POST",
            credentials: "include",
            body: formData,
        }).then((r) => r.json());
    },
};