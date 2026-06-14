import { studentDiscussionsService } from '@/api/services/studentDiscussions.service';

export function useDiscussionsHandlers({ cohortId, currentUser, fetchDiscussions }) {
  const handleCreateDiscussion = async (discussionData) => {
    try {
      const res = await studentDiscussionsService.createDiscussion(cohortId, discussionData);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to create discussion' }; }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      const res = await studentDiscussionsService.deleteDiscussion(cohortId, discussionId);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to delete discussion' }; }
  };

  const handleEditDiscussion = async (discussionId, updatedData) => {
    try {
      const res = await studentDiscussionsService.editDiscussion(cohortId, discussionId, updatedData);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to edit discussion' }; }
  };

  const handleLikeDiscussion = async (discussionId) => {
    try {
      const res = await studentDiscussionsService.likeDiscussion(cohortId, discussionId, currentUser.id);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to like discussion' }; }
  };

  const handleAddDiscussionReply = async (discussionId, replyData) => {
    try {
      const res = await studentDiscussionsService.addReply(cohortId, discussionId, replyData);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to add reply' }; }
  };

  const handleDeleteDiscussionReply = async (discussionId, replyId) => {
    try {
      const res = await studentDiscussionsService.deleteReply(cohortId, discussionId, replyId);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to delete reply' }; }
  };

  const handleEditDiscussionReply = async (discussionId, replyId, updatedData) => {
    try {
      const res = await studentDiscussionsService.editReply(cohortId, discussionId, replyId, updatedData);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to edit reply' }; }
  };

  const handleLikeDiscussionReply = async (discussionId, replyId) => {
    try {
      const res = await studentDiscussionsService.likeReply(cohortId, discussionId, replyId, currentUser.id);
      if (res.success) { await fetchDiscussions(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to like reply' }; }
  };

  return {
    handleCreateDiscussion,
    handleDeleteDiscussion,
    handleEditDiscussion,
    handleLikeDiscussion,
    handleAddDiscussionReply,
    handleDeleteDiscussionReply,
    handleEditDiscussionReply,
    handleLikeDiscussionReply,
  };
}