// AnnouncementContext.jsx
// Owns every piece of local UI state for the Announcements panel.
// Wrap <AnnouncementsProfessorUI> (or any subtree) with this provider,
// then call useAnnouncementUI() inside to read / mutate state.

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  filterAndSortAnnouncements,
  filterDiscussions,
} from '../utils/Announcementutils';

// ─── Context ────────────────────────────────────────────────────────────────

const AnnouncementUIContext = createContext(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AnnouncementUIProvider({ announcements = [], discussions = [], children }) {
  // Filter state
  const [filter, setFilter]       = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Modals
  const [deleteConfirm, setDeleteConfirm]           = useState(null);
  // deleteConfirm shape:
  //   { type: 'announcement' | 'discussion' | 'discussionReply',
  //     id, discussionId?, replyId? }

  // Inline editing – discussion
  const [expandedDiscussionId, setExpandedDiscussionId] = useState(null);
  const [replyText, setReplyText]                       = useState({});
  const [editingDiscussion, setEditingDiscussion]       = useState(null);
  const [editDiscussionData, setEditDiscussionData]     = useState({ title: '', content: '' });

  // Inline editing – discussion reply
  const [editingReply, setEditingReply]   = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  // ── Derived / memoised data ────────────────────────────────────────────────

  const sortedAnnouncements = useMemo(
    () => filterAndSortAnnouncements(announcements, filter, tagFilter),
    [announcements, filter, tagFilter],
  );

  const filteredDiscussions = useMemo(
    () => filterDiscussions(discussions, filter, tagFilter),
    [discussions, filter, tagFilter],
  );

  // ── Helpers ────────────────────────────────────────────────────────────────

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

  function toggleDiscussion(id) {
    setExpandedDiscussionId((prev) => (prev === id ? null : id));
  }

  // ── Value ─────────────────────────────────────────────────────────────────

  const value = {
    // Filter
    filter, setFilter,
    tagFilter, setTagFilter,

    // Derived lists
    sortedAnnouncements,
    filteredDiscussions,

    // Delete confirmation
    deleteConfirm, setDeleteConfirm,

    // Discussion expansion + reply input
    expandedDiscussionId,
    toggleDiscussion,
    replyText, updateReplyText, clearReplyText,

    // Inline edit – discussion
    editingDiscussion,
    editDiscussionData, setEditDiscussionData,
    startEditDiscussion, cancelEditDiscussion,

    // Inline edit – reply
    editingReply,
    editReplyContent, setEditReplyContent,
    startEditReply, cancelEditReply,
  };

  return (
    <AnnouncementUIContext.Provider value={value}>
      {children}
    </AnnouncementUIContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAnnouncementUI() {
  const ctx = useContext(AnnouncementUIContext);
  if (!ctx) throw new Error('useAnnouncementUI must be used inside <AnnouncementUIProvider>');
  return ctx;
}