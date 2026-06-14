import { apiCall } from "../client";

export const studentAttendanceService = {
//  get attendance records for the student
    getAttendance: () => apiCall("/student/attendance"),
    
    // Mark attendance using a QR code
     markAttendanceQR: (token) =>
        apiCall("/student/attendance/qr", {
            method: "POST",
            body: JSON.stringify({ token }),
        }),
};