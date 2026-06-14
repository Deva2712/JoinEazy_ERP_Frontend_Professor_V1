
import { apiCall } from "../client";

// Devkit APIs (for development/testing)
export const devkitService = {
    // Get devkit data
    getDevkitData: () => apiCall("/devkit"),

    // Create test data
    createTestData: (data) =>
        apiCall("/devkit/create-test-data", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};