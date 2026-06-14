import { announcementsService } from '@/api/services/announcements.service';

export function useAnnouncementsHandlers({
  cohortId,
  selectedAnnouncement,
  setSelectedAnnouncement,
  setShowCreateModal,
  setShowEditModal,
  setEditingAnnouncement,
  fetchAnnouncements,
}) {
  const refreshSelectedAnnouncement = async (announcementId) => {
    if (selectedAnnouncement?.id !== announcementId) return;
    setTimeout(async () => {
      const res = await announcementsService.getAnnouncements(cohortId);
      if (res.success) {
        const updated = res.data.find((a) => a.id === announcementId);
        if (updated) setSelectedAnnouncement(updated);
      }
    }, 100);
  };

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      const res = await announcementsService.createAnnouncement(cohortId, announcementData);
      if (res.success) { await fetchAnnouncements(); setShowCreateModal(false); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to create announcement' }; }
  };

  const handleUpdateAnnouncement = async (announcementId, announcementData) => {
    try {
      const res = await announcementsService.updateAnnouncement(cohortId, announcementId, announcementData);
      if (res.success) {
        await fetchAnnouncements();
        setShowEditModal(false);
        setEditingAnnouncement(null);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to update announcement' }; }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      const res = await announcementsService.deleteAnnouncement(cohortId, announcementId);
      if (res.success) {
        await fetchAnnouncements();
        if (selectedAnnouncement?.id === announcementId) setSelectedAnnouncement(null);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to delete announcement' }; }
  };

  const handleTogglePin = async (announcementId, isPinned) => {
    try {
      const res = await announcementsService.togglePinAnnouncement(cohortId, announcementId, isPinned);
      if (res.success) { await fetchAnnouncements(); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to toggle pin' }; }
  };

  const handleArchiveAnnouncement = async (announcementId) => {
    try {
      const res = await announcementsService.archiveAnnouncement(cohortId, announcementId);
      if (res.success) {
        await fetchAnnouncements();
        if (selectedAnnouncement?.id === announcementId) setSelectedAnnouncement(null);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to archive announcement' }; }
  };

  const handleAddReply = async (announcementId, replyData) => {
    try {
      const res = await announcementsService.addReply(cohortId, announcementId, replyData);
      if (res.success) { await fetchAnnouncements(); await refreshSelectedAnnouncement(announcementId); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to add reply' }; }
  };

  const handleDeleteReply = async (announcementId, replyId) => {
    try {
      const res = await announcementsService.deleteReply(cohortId, announcementId, replyId);
      if (res.success) { await fetchAnnouncements(); await refreshSelectedAnnouncement(announcementId); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to delete reply' }; }
  };

  const handleUpvoteReply = async (announcementId, replyId) => {
    try {
      const res = await announcementsService.upvoteReply(cohortId, announcementId, replyId);
      if (res.success) { await fetchAnnouncements(); await refreshSelectedAnnouncement(announcementId); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to upvote reply' }; }
  };

  const handleToggleLock = async (announcementId, isLocked) => {
    try {
      const res = await announcementsService.toggleLockThread(cohortId, announcementId, isLocked);
      if (res.success) { await fetchAnnouncements(); await refreshSelectedAnnouncement(announcementId); return { success: true }; }
      return { success: false, message: res.message };
    } catch { return { success: false, message: 'Failed to toggle lock' }; }
  };

  const handleEditClick = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowEditModal(true);
  };

  return {
    handleCreateAnnouncement,
    handleUpdateAnnouncement,
    handleDeleteAnnouncement,
    handleTogglePin,
    handleArchiveAnnouncement,
    handleAddReply,
    handleDeleteReply,
    handleUpvoteReply,
    handleToggleLock,
    handleEditClick,
  };
}