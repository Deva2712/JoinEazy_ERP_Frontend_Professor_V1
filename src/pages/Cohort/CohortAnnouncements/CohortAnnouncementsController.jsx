import React, { useState, useEffect } from 'react';
import { announcementsService } from '../../../api/services/announcements.service';
import { studentDiscussionsService } from '../../../api/services/studentDiscussions.service';
import AnnouncementsProfessorUI from '../CohortAnnouncements/ui/AnnouncementsProfessorUI';
import AnnouncementsStudentUI from '../CohortAnnouncements/ui/AnnouncementsStudentUI';
import { useAnnouncementsHandlers } from './utils/Useannouncementshandlers';
import { useDiscussionsHandlers } from './utils/Usediscussionshandlers';

/** function for CohortAnnouncementscontroller */
export default function CohortAnnouncementsController({ cohortId, cohortData }) {
  const [announcements, setAnnouncements] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const isProfessor = cohortData?.user_type === 1;

  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const currentUser = {
    id: authUser.id || authUser.user_id || 1,
    name: authUser.name || authUser.display_name || authUser.email || 'Anonymous',
    role: isProfessor ? 'professor' : 'student',
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await announcementsService.getAnnouncements(cohortId);
      if (res.success) setAnnouncements(res.data || []);
      else setError(res.message || 'Failed to load announcements');
    } catch {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const res = await studentDiscussionsService.getDiscussions(cohortId, currentUser.id);
      if (res.success) setDiscussions(res.data || []);
    } catch (err) {
      console.error('Error fetching discussions:', err);
    }
  };

  useEffect(() => {
    if (cohortId) {
      fetchAnnouncements();
      fetchDiscussions();
    }
  }, [cohortId, isProfessor]);

  const announcementHandlers = useAnnouncementsHandlers({
    cohortId,
    selectedAnnouncement,
    setSelectedAnnouncement,
    setShowCreateModal,
    setShowEditModal,
    setEditingAnnouncement,
    fetchAnnouncements,
  });

  const discussionHandlers = useDiscussionsHandlers({
    cohortId,
    currentUser,
    fetchDiscussions,
  });

  const commonProps = {
    announcements,
    discussions,
    currentUser,
    loading,
    error,
    selectedAnnouncement,
    setSelectedAnnouncement,
    onRefresh: fetchAnnouncements,
    onAddReply: announcementHandlers.handleAddReply,
    onDeleteReply: announcementHandlers.handleDeleteReply,
    onUpvoteReply: announcementHandlers.handleUpvoteReply,
    onCreateDiscussion: discussionHandlers.handleCreateDiscussion,
    onDeleteDiscussion: discussionHandlers.handleDeleteDiscussion,
    onEditDiscussion: discussionHandlers.handleEditDiscussion,
    onLikeDiscussion: discussionHandlers.handleLikeDiscussion,
    onAddDiscussionReply: discussionHandlers.handleAddDiscussionReply,
    onDeleteDiscussionReply: discussionHandlers.handleDeleteDiscussionReply,
    onEditDiscussionReply: discussionHandlers.handleEditDiscussionReply,
    onLikeDiscussionReply: discussionHandlers.handleLikeDiscussionReply,
  };

  if (isProfessor) {
    return (
      <AnnouncementsProfessorUI
        {...commonProps}
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingAnnouncement={editingAnnouncement}
        onCreateAnnouncement={announcementHandlers.handleCreateAnnouncement}
        onUpdateAnnouncement={announcementHandlers.handleUpdateAnnouncement}
        onDeleteAnnouncement={announcementHandlers.handleDeleteAnnouncement}
        onTogglePin={announcementHandlers.handleTogglePin}
        onArchiveAnnouncement={announcementHandlers.handleArchiveAnnouncement}
        onToggleLock={announcementHandlers.handleToggleLock}
        onEditClick={announcementHandlers.handleEditClick}
      />
    );
  }

  return <AnnouncementsStudentUI {...commonProps} />;
}