import { apiCall } from "../client";
import {
    getAnnouncementsFromStorage,
    saveAnnouncementsToStorage,
    createDefaultAnnouncement,
} from "../utils/announcementStorage";

import { USE_MOCK_API } from "../config";
// Service functions for managing announcements and threads


export const announcementsService = {
	// Get all announcements for a cohort
	getAnnouncements: async (cohortId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;

					const allData = getAnnouncementsFromStorage();

					// Only add default announcement if cohort doesn't exist in storage yet (first time)
					// Don't overwrite if it's just an empty array (user might have deleted all)
					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [
							createDefaultAnnouncement(cohortId),
						];
						saveAnnouncementsToStorage(allData);
					}

					// Auto-archive announcements older than 2 days on each fetch
					const announcements = allData[cohortId] || [];
					const now = new Date();
					const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
					let hasChanges = false;

					announcements.forEach((announcement) => {
						const createdDate = new Date(announcement.created_at);
						if (
							createdDate < twoDaysAgo &&
							!announcement.is_archived
						) {
							announcement.is_archived = true;
							announcement.is_pinned = false; // Unpin archived announcements
							hasChanges = true;
						}

						// Set upvoted_by_current_user flag for each reply
						if (announcement.replies) {
							announcement.replies.forEach((reply) => {
								if (!reply.upvoted_by_user_ids) {
									reply.upvoted_by_user_ids = [];
								}
								reply.upvoted_by_current_user =
									reply.upvoted_by_user_ids.includes(userId);
								reply.upvotes =
									reply.upvoted_by_user_ids.length;
							});
						}
					});

					// Save if any announcements were archived
					if (hasChanges) {
						saveAnnouncementsToStorage(allData);
					}

					resolve({
						success: true,
						data: allData[cohortId] || [],
					});
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements?archived=true`); // fetch all, frontend filters by is_archived
	},

	// Create new announcement (Professor only)
	createAnnouncement: async (cohortId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}

					const now = new Date();
					const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);

					// Auto-archive announcements older than 2 days and unpin them
					allData[cohortId].forEach((announcement) => {
						const createdDate = new Date(announcement.created_at);
						if (
							createdDate < twoDaysAgo &&
							!announcement.is_archived
						) {
							announcement.is_archived = true;
							announcement.is_pinned = false; // Unpin archived announcements
						}
					});

					// Create new announcement - always pinned by default
					const newAnnouncement = {
						id: Date.now(),
						...announcementData,
						author_name: "Prof. Jane Smith",
						author_id: 1,
						created_at: now.toISOString(),
						updated_at: now.toISOString(),
						is_pinned: true, // All new announcements are pinned
						is_archived: false,
						expiry_date: null,
						view_count: 0,
						replies_count: 0,
						replies: [],
					};

					// Add new announcement to the beginning of the array
					allData[cohortId] = [newAnnouncement, ...allData[cohortId]];
					saveAnnouncementsToStorage(allData);

					resolve({
						success: true,
						data: newAnnouncement,
					});
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements`, {
			method: "POST",
			body: JSON.stringify(announcementData),
		});
	},

	// Update announcement (Professor only)
	updateAnnouncement: async (cohortId, announcementId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);
					if (index !== -1) {
						announcements[index] = {
							...announcements[index],
							...announcementData,
							updated_at: new Date().toISOString(),
						};
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcements[index],
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "PUT",
			body: JSON.stringify(announcementData),
		});
	},

	// Delete announcement (Professor only)
	deleteAnnouncement: async (cohortId, announcementId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);
					if (index !== -1) {
						announcements.splice(index, 1);
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							message: "Announcement deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "DELETE",
		});
	},

	// Pin/Unpin announcement (Professor only)
	togglePinAnnouncement: async (cohortId, announcementId, isPinned) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						// If pinning this announcement, unpin all others
						if (isPinned) {
							announcements.forEach((a) => {
								if (a.id !== announcementId) {
									a.is_pinned = false;
								}
							});
						}
						announcement.is_pinned = isPinned;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/pin`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_pinned: isPinned }),
			},
		);
	},

	// Archive announcement (Professor only)
	archiveAnnouncement: async (cohortId, announcementId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						announcement.is_archived = true;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/archive`,
			{
				method: "PATCH",
			},
		);
	},

	// Add reply to announcement thread
	addReply: async (cohortId, announcementId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						const newReply = {
							id: Date.now(),
							...replyData,
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
							upvotes: 0,
							upvoted_by_user_ids: [], // Track who upvoted this reply
							upvoted_by_current_user: false,
							is_official: replyData.is_official || false,
						};
						if (!announcement.replies) {
							announcement.replies = [];
						}
						announcement.replies.push(newReply);
						announcement.replies_count =
							announcement.replies.length;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: newReply,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies`,
			{
				method: "POST",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Update reply
	updateReply: async (cohortId, announcementId, replyId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const reply = announcement.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							Object.assign(reply, replyData, {
								updated_at: new Date().toISOString(),
							});
							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}`,
			{
				method: "PUT",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Delete reply
	deleteReply: async (cohortId, announcementId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const index = announcement.replies.findIndex(
							(r) => r.id === replyId,
						);
						if (index !== -1) {
							announcement.replies.splice(index, 1);
							announcement.replies_count =
								announcement.replies.length;
							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								message: "Reply deleted successfully",
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}`,
			{
				method: "DELETE",
			},
		);
	},

	// Upvote a reply/question
	upvoteReply: async (cohortId, announcementId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;

					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const reply = announcement.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							// Initialize upvoted_by_user_ids array if it doesn't exist
							if (!reply.upvoted_by_user_ids) {
								reply.upvoted_by_user_ids = [];
							}

							const userIndex =
								reply.upvoted_by_user_ids.indexOf(userId);

							// Toggle upvote
							if (userIndex > -1) {
								// User already upvoted, remove upvote
								reply.upvoted_by_user_ids.splice(userIndex, 1);
							} else {
								// User hasn't upvoted, add upvote
								reply.upvoted_by_user_ids.push(userId);
							}

							// Update upvote count and current user status
							reply.upvotes = reply.upvoted_by_user_ids.length;
							reply.upvoted_by_current_user =
								reply.upvoted_by_user_ids.includes(userId);

							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}/upvote`,
			{
				method: "POST",
			},
		);
	},

	// Lock/Unlock thread (Professor only)
	toggleLockThread: async (cohortId, announcementId, isLocked) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						announcement.is_locked = isLocked;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/lock`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_locked: isLocked }),
			},
		);
	},
};