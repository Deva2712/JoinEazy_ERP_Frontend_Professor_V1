import { apiCall } from "../client";


// Expenses APIs
export const expensesService = {
    // Retrieves the list of all expenses
    getExpenses: () => apiCall("/expenses/list"),

    // Submits a new expense report
    createExpense: (expenseData) =>
        apiCall("/expenses/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData),
        }),

    // Updates an existing expense record.
    updateExpense: (expenseId, expenseData) =>
        apiCall(`/expenses/${expenseId}/update`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData),
        }),

    // Deletes a specific expense record
    deleteExpense: (expenseId) =>
        apiCall(`/expenses/${expenseId}`, {
            method: "DELETE",
        }),
};