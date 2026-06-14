//src/api/utils/chatstorage.js

const CHAT_STORAGE_KEY = "funkey_general_chat";


// Load chat messages from localStorage
export const loadChatMessagesFromStorage = () => {
	try {
		const stored = localStorage.getItem(CHAT_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading chat messages from storage:", error);
		return null;
	}
};

// Saves the entire chat messages object (keyed by cohortId) to localStorage
export const saveChatMessagesToStorage = (messages) => {
	try {
		localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
	} catch (error) {
		console.error("❌ Error saving chat messages to storage:", error);
	}
};

// Retrieves chat messages for all cohorts, initializing storage if empty
export const getChatMessagesFromStorage = () => {
	const stored = loadChatMessagesFromStorage();
	if (stored) return stored;

	// First time - initialize with empty object
	const initial = {};
	saveChatMessagesToStorage(initial);
	return initial;
};
