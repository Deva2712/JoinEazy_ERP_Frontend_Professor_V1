// AnnouncementStudentContext.jsx
// Owns every piece of local UI state for the Student Announcements panel.
// Wrap <AnnouncementsStudentUI> with this provider,
// then call useAnnouncementStudentUI() inside to read / mutate state.

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  filterAndSortAnnouncementsStudent,
  filterDiscussionsStudent,
} from '../utils/Announcementutils';

const AnnouncementStudentUIContext = createContext(null);

export function AnnouncementStudentUIProvider({ announcements = [], discussions = [], children }) {
  // Filter state — students only have 'active' / 'archived'
  const [filter, setFilter]       = useState('active');
  const [tagFilter, setTagFilter] = useState('all');

  // Discussion creation modal
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);

  // Delete confirmation — { type: 'discussion' | 'reply', discussionId, replyId? }
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Discussion expansion + reply input
  const [expandedDiscussionId, setExpandedDiscussionId] = useState(null);
  const [replyText, setReplyText]                       = useState({});

  // Inline edit – discussion
  const [editingDiscussion, setEditingDiscussion]   = useState(null);
  const [editDiscussionData, setEditDiscussionData] = useState({ title: '', content: '' });

  // Inline edit – reply
  const [editingReply, setEditingReply]         = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  // ── Derived lists ────────────────────────────────────────────────────────

  const sortedAnnouncements = useMemo(
    () => filterAndSortAnnouncementsStudent(announcements, filter, tagFilter),
    [announcements, filter, tagFilter],
  );

  const filteredDiscussions = useMemo(
    () => filterDiscussionsStudent(discussions, filter, tagFilter),
    [discussions, filter, tagFilter],
  );

  // ── Helpers ──────────────────────────────────────────────────────────────

  function toggleDiscussion(id) {
    setExpandedDiscussionId((prev) => (prev === id ? null : id));
  }
  function updateReplyText(discussionId, value) {
    setReplyText((prev) => ({ ...prev, [discussionId]: value }));
  }
  function clearReplyText(discussionId) {
    setReplyText((prev) => ({ ...prev, [discussionId]: '' }));
  }
  function startEditDiscussion(discussion) {
    setEditingDiscussion(discussion.id);
    setEditDiscussionData({ title: discussion.title, content: discussion.content });
  }
  function cancelEditDiscussion() {
    setEditingDiscussion(null);
    setEditDiscussionData({ title: '', content: '' });
  }
  function startEditReply(reply) {
    setEditingReply(reply.id);
    setEditReplyContent(reply.content);
  }
  function cancelEditReply() {
    setEditingReply(null);
    setEditReplyContent('');
  }

  const value = {
    filter, setFilter,
    tagFilter, setTagFilter,
    sortedAnnouncements,
    filteredDiscussions,
    showDiscussionModal, setShowDiscussionModal,
    deleteConfirm, setDeleteConfirm,
    expandedDiscussionId, toggleDiscussion,
    replyText, updateReplyText, clearReplyText,
    editingDiscussion,
    editDiscussionData, setEditDiscussionData,
    startEditDiscussion, cancelEditDiscussion,
    editingReply,
    editReplyContent, setEditReplyContent,
    startEditReply, cancelEditReply,
  };

  return (
    <AnnouncementStudentUIContext.Provider value={value}>
      {children}
    </AnnouncementStudentUIContext.Provider>
  );
}

export function useAnnouncementStudentUI() {
  const ctx = useContext(AnnouncementStudentUIContext);
  if (!ctx) throw new Error('useAnnouncementStudentUI must be used inside <AnnouncementStudentUIProvider>');
  return ctx;
}