import { apiCall } from "../client";
import { getChatMessagesFromStorage, saveChatMessagesToStorage } from "../utils/chatstorage";
import { USE_MOCK_API } from "../config";

// General Chat APIs
export const generalChatService = {
    // Get all chat messages for a cohort
    getMessages: async (cohortId) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getChatMessagesFromStorage();

                    // Initialize with empty array if first time
                    if (!allData.hasOwnProperty(cohortId)) {
                        allData[cohortId] = [];
                        saveChatMessagesToStorage(allData);
                    }

                    resolve({
                        success: true,
                        data: allData[cohortId] || [],
                    });
                }, 200);
            });
        }
        return apiCall(`/cohort/${cohortId}/chat`);
    },

    // Send a chat message
    sendMessage: async (cohortId, messageData) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getChatMessagesFromStorage();

                    const newMessage = {
                        id: Date.now(),
                        ...messageData,
                        created_at: new Date().toISOString(),
                    };

                    if (!allData[cohortId]) {
                        allData[cohortId] = [];
                    }
                    allData[cohortId].push(newMessage);
                    saveChatMessagesToStorage(allData);

                    resolve({
                        success: true,
                        data: newMessage,
                    });
                }, 200);
            });
        }
        return apiCall(`/cohort/${cohortId}/chat`, {
            method: "POST",
            body: JSON.stringify(messageData),
        });
    },

    // Delete a chat message (optional - for professors/message owners)
    deleteMessage: async (cohortId, messageId) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getChatMessagesFromStorage();
                    const messages = allData[cohortId] || [];
                    const index = messages.findIndex((m) => m.id === messageId);

                    if (index !== -1) {
                        messages.splice(index, 1);
                        saveChatMessagesToStorage(allData);
                        resolve({
                            success: true,
                            message: "Message deleted successfully",
                        });
                    } else {
                        resolve({
                            success: false,
                            message: "Message not found",
                        });
                    }
                }, 200);
            });
        }
        
        return apiCall(`/cohort/${cohortId}/chat/${messageId}`, {
            method: "DELETE",
        });
    },
};
