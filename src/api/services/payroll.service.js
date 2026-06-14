import { apiCall } from "../client";


// Payroll APIs
export const payrollService = {
    // Retrieves payroll history and details for the user
    getHistory: () => apiCall("/payroll/history"),

    // Retrieves the breakdown of the current month's salary
    getBreakdown: () => apiCall("/payroll/breakdown"),

    // Updated to accept the full item object for PDF generation
    downloadPayslip: (item) => apiCall(`/payroll/download/${item.id}`),
};
