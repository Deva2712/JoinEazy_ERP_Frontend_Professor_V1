import { apiCall } from "../client";

import { USE_MOCK_API } from "../config";
import { getDiscussionsFromStorage ,saveDiscussionsToStorage } from "../utils/discussionStorage";

// Student Discussions APIs
export const studentDiscussionsService = {
    // Get all discussions for a cohort
    getDiscussions: async (cohortId, userId) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();

                    if (!allData.hasOwnProperty(cohortId)) {
                        allData[cohortId] = [];
                        saveDiscussionsToStorage(allData);
                    }

                    const discussions = allData[cohortId] || [];
                    let needsSave = false;

                    // Auto-archive discussions older than 2 days
                    const twoDaysAgo = new Date();
                    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

                    discussions.forEach((discussion) => {
                        const createdDate = new Date(discussion.created_at);
                        if (
                            createdDate < twoDaysAgo &&
                            !discussion.is_archived
                        ) {
                            discussion.is_archived = true;
                            needsSave = true;
                        }
                    });

                    // Migrate old data and set liked_by_current_user flag for each discussion and reply based on userId
                    discussions.forEach((discussion) => {
                        // Migrate old format to new format
                        if (!discussion.liked_by_user_ids) {
                            discussion.liked_by_user_ids = [];
                            // If there was an old liked_by_current_user flag set to true, we can't know which user it was
                            // so we'll just start fresh
                            discussion.likes_count = 0;
                            needsSave = true;
                        }

                        // Ensure likes_count matches the array length
                        discussion.likes_count =
                            discussion.liked_by_user_ids.length;
                        discussion.liked_by_current_user =
                            discussion.liked_by_user_ids.includes(userId);

                        // Also migrate and set for replies
                        if (discussion.replies) {
                            discussion.replies.forEach((reply) => {
                                if (!reply.liked_by_user_ids) {
                                    reply.liked_by_user_ids = [];
                                    reply.likes_count = 0;
                                    needsSave = true;
                                }

                                // Ensure likes_count matches the array length
                                reply.likes_count =
                                    reply.liked_by_user_ids.length;
                                reply.liked_by_current_user =
                                    reply.liked_by_user_ids.includes(userId);
                            });
                        }
                    });

                    // Save if we migrated any data
                    if (needsSave) {
                        saveDiscussionsToStorage(allData);
                    }

                    resolve({
                        success: true,
                        data: discussions,
                    });
                }, 200);
            });
        }
        return apiCall(`/cohort/${cohortId}/discussions`);
    },

    // Create a new discussion
    createDiscussion: async (cohortId, discussionData) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();

                    const newDiscussion = {
                        id: Date.now(),
                        ...discussionData,
                        created_at: new Date().toISOString(),
                        likes_count: 0,
                        liked_by_user_ids: [], // Track who liked this discussion
                        liked_by_current_user: false,
                        replies: [],
                    };

                    if (!allData[cohortId]) {
                        allData[cohortId] = [];
                    }
                    allData[cohortId].unshift(newDiscussion);
                    saveDiscussionsToStorage(allData);

                    resolve({
                        success: true,
                        data: newDiscussion,
                    });
                }, 200);
            });
        }
        return apiCall(`/cohort/${cohortId}/discussions`, {
            method: "POST",
            body: JSON.stringify(discussionData),
        });
    },

    // Delete a discussion (owner only)
    deleteDiscussion: async (cohortId, discussionId) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();
                    const discussions = allData[cohortId] || [];
                    const index = discussions.findIndex(
                        (d) => d.id === discussionId,
                    );

                    if (index !== -1) {
                        discussions.splice(index, 1);
                        saveDiscussionsToStorage(allData);
                        resolve({
                            success: true,
                            message: "Discussion deleted successfully",
                        });
                    } else {
                        resolve({
                            success: false,
                            message: "Discussion not found",
                        });
                    }
                }, 200);
            });
        }
        return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
            method: "DELETE",
        });
    },

    // Edit a discussion (owner only)
    editDiscussion: async (cohortId, discussionId, updatedData) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();
                    const discussions = allData[cohortId] || [];
                    const discussion = discussions.find(
                        (d) => d.id === discussionId,
                    );

                    if (discussion) {
                        // Update the discussion fields
                        discussion.title =
                            updatedData.title || discussion.title;
                        discussion.content =
                            updatedData.content || discussion.content;
                        discussion.edited_at = new Date().toISOString();

                        saveDiscussionsToStorage(allData);
                        resolve({
                            success: true,
                            data: discussion,
                            message: "Discussion updated successfully",
                        });
                    } else {
                        resolve({
                            success: false,
                            message: "Discussion not found",
                        });
                    }
                }, 200);
            });
        }
        return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
        });
    },

    // Like a discussion
    likeDiscussion: async (cohortId, discussionId, userId) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();
                    const discussions = allData[cohortId] || [];
                    const discussion = discussions.find(
                        (d) => d.id === discussionId,
                    );

                    if (discussion) {
                        // Initialize liked_by_user_ids array if it doesn't exist
                        if (!discussion.liked_by_user_ids) {
                            discussion.liked_by_user_ids = [];
                        }

                        const userIndex =
                            discussion.liked_by_user_ids.indexOf(userId);

                        if (userIndex > -1) {
                            // User already liked it, so unlike it
                            discussion.liked_by_user_ids.splice(userIndex, 1);
                        } else {
                            // User hasn't liked it yet, so add their like
                            discussion.liked_by_user_ids.push(userId);
                        }

                        // Update the count based on unique user IDs
                        discussion.likes_count =
                            discussion.liked_by_user_ids.length;
                        discussion.liked_by_current_user =
                            discussion.liked_by_user_ids.includes(userId);

                        saveDiscussionsToStorage(allData);
                        resolve({
                            success: true,
                            data: discussion,
                        });
                    } else {
                        resolve({
                            success: false,
                            message: "Discussion not found",
                        });
                    }
                }, 200);
            });
        }
        return apiCall(`/cohort/${cohortId}/discussions/${discussionId}/like`, {
            method: "POST",
        });
    },

    // Add reply to discussion
    addReply: async (cohortId, discussionId, replyData) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();
                    const discussions = allData[cohortId] || [];
                    const discussion = discussions.find(
                        (d) => d.id === discussionId,
                    );

                    if (discussion) {
                        const newReply = {
                            id: Date.now(),
                            ...replyData,
                            created_at: new Date().toISOString(),
                            likes_count: 0,
                            liked_by_user_ids: [], // Track who liked this reply
                            liked_by_current_user: false,
                        };

                        if (!discussion.replies) {
                            discussion.replies = [];
                        }
                        discussion.replies.push(newReply);
                        saveDiscussionsToStorage(allData);

                        resolve({
                            success: true,
                            data: newReply,
                        });
                    } else {
                        resolve({
                            success: false,
                            message: "Discussion not found",
                        });
                    }
                }, 200);
            });
        }
        return apiCall(
            `/cohort/${cohortId}/discussions/${discussionId}/replies`,
            {
                method: "POST",
                body: JSON.stringify(replyData),
            },
        );
    },

    // Delete reply (owner only)
    deleteReply: async (cohortId, discussionId, replyId) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();
                    const discussions = allData[cohortId] || [];
                    const discussion = discussions.find(
                        (d) => d.id === discussionId,
                    );

                    if (discussion && discussion.replies) {
                        const index = discussion.replies.findIndex(
                            (r) => r.id === replyId,
                        );
                        if (index !== -1) {
                            discussion.replies.splice(index, 1);
                            saveDiscussionsToStorage(allData);
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
                }, 200);
            });
        }
        return apiCall(
            `/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}`,
            {
                method: "DELETE",
            },
        );
    },

    // Edit reply (owner only)
    editReply: async (cohortId, discussionId, replyId, updatedData) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();
                    const discussions = allData[cohortId] || [];
                    const discussion = discussions.find(
                        (d) => d.id === discussionId,
                    );

                    if (discussion && discussion.replies) {
                        const reply = discussion.replies.find(
                            (r) => r.id === replyId,
                        );
                        if (reply) {
                            // Update the reply content
                            reply.content =
                                updatedData.content || reply.content;
                            reply.edited_at = new Date().toISOString();

                            saveDiscussionsToStorage(allData);
                            resolve({
                                success: true,
                                data: reply,
                                message: "Reply updated successfully",
                            });
                            return;
                        }
                    }
                    resolve({
                        success: false,
                        message: "Reply not found",
                    });
                }, 200);
            });
        }
        return apiCall(
            `/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}`,
            {
                method: "PUT",
                body: JSON.stringify(updatedData),
            },
        );
    },

    // Like a reply
    likeReply: async (cohortId, discussionId, replyId, userId) => {
        if (USE_MOCK_API) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const allData = getDiscussionsFromStorage();
                    const discussions = allData[cohortId] || [];
                    const discussion = discussions.find(
                        (d) => d.id === discussionId,
                    );

                    if (discussion && discussion.replies) {
                        const reply = discussion.replies.find(
                            (r) => r.id === replyId,
                        );
                        if (reply) {
                            // Initialize liked_by_user_ids array if it doesn't exist
                            if (!reply.liked_by_user_ids) {
                                reply.liked_by_user_ids = [];
                            }

                            const userIndex =
                                reply.liked_by_user_ids.indexOf(userId);

                            if (userIndex > -1) {
                                // User already liked it, so unlike it
                                reply.liked_by_user_ids.splice(userIndex, 1);
                            } else {
                                // User hasn't liked it yet, so add their like
                                reply.liked_by_user_ids.push(userId);
                            }

                            // Update the count based on unique user IDs
                            reply.likes_count = reply.liked_by_user_ids.length;
                            reply.liked_by_current_user =
                                reply.liked_by_user_ids.includes(userId);

                            saveDiscussionsToStorage(allData);
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
                }, 200);
            });
        }
        return apiCall(
            `/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}/like`,
            {
                method: "POST",
            },
        );
    },
};
