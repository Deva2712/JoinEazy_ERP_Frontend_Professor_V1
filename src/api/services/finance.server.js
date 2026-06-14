import { apiCall } from "../client";

export const financeService = {
    /**
     * Single call that hydrates the entire FinanceUI in one round-trip.
     * Returns { fees, paymentHistory, receipts, dueReminders }.
     */
    getOverview: () => apiCall("/finance/overview"),
 
    /** Returns the list of all fee heads with their due/paid breakdown. */
    getFees: () => apiCall("/finance/fees"),
 
    /** Returns the full payment transaction history. */
    getHistory: () => apiCall("/finance/history"),
 
    /** Returns all issued receipts. */
    getReceipts: () => apiCall("/finance/receipts"),
 
    /** Returns currently active due reminders. */
    getDueReminders: () => apiCall("/finance/due-reminders"),
 
    /**
     * Student initiates a fee payment.
     * @param {{ feeId: string, mode: string, amount: number, details: object }} payload
     */
    pay: (payload) =>
        apiCall("/finance/pay", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
 
    /**
     * Returns a signed download URL for a receipt PDF.
     * @param {string} receiptId
     */
    downloadReceipt: (receiptId) =>
        apiCall(`/finance/receipts/${receiptId}/download`),
};