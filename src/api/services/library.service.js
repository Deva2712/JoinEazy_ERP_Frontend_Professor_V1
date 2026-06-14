import { apiCall } from "../client";



// Library APIs
export const libraryService = {
    // Retrieves library dashboard data
    getLibraryDashboard: () => apiCall("/library/dashboard"),

    // Requests a book from the library
    requestBook: (bookId, durationDays) =>
        apiCall("/library/request", {
            method: "POST",
            body: JSON.stringify({ bookId, durationDays }),
        }),

    // Cancels an existing request
    cancelRequest: (requestId) =>
        apiCall(`/library/requests/${requestId}`, { method: "DELETE" }),

    // Initiates a return process for a borrowed book
    returnBook: (bookId) =>
        apiCall("/library/return", {
            method: "POST",
            body: JSON.stringify({ bookId }),
        }),

    // Extends the due date of a borrowed book
    requestExtension: (bookId, additionalDays) =>
        apiCall("/library/extend", {
            method: "POST",
            body: JSON.stringify({ bookId, additionalDays }),
        }),

    // Add to your existing libraryAPI object
    approveExtension: (requestId, bookId, additionalDays) =>
        apiCall("/library/approve-extension", {
            method: "POST",
            body: JSON.stringify({ requestId, bookId, additionalDays }),
        }),
};
