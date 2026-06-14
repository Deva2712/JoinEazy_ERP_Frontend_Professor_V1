import React, { useState } from 'react';
import { FilterBar, AnnouncementCard, EmptyState, CreateSidebar, MobileFAB } from '../components/Professorannouncementcomponents';
import { DiscussionCard, DeleteConfirmModal } from '../components/Professordiscussioncomponents';
import { LoadingState, ErrorState } from '../components/Professoratoms';

export default function AnnouncementsProfessorUI({
  announcements,
  discussions,
  currentUser,
  loading,
  error,
  selectedAnnouncement,
  setSelectedAnnouncement,
  showCreateModal,
  setShowCreateModal,
  showEditModal,
  setShowEditModal,
  editingAnnouncement,
  onRefresh,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onTogglePin,
  onArchiveAnnouncement,
  onToggleLock,
  onEditClick,
  onAddReply,
  onDeleteReply,
  onUpvoteReply,
  onCreateDiscussion,
  onDeleteDiscussion,
  onEditDiscussion,
  onLikeDiscussion,
  onAddDiscussionReply,
  onDeleteDiscussionReply,
  onEditDiscussionReply,
  onLikeDiscussionReply,
}) {
  const [filter, setFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [editingDiscussion, setEditingDiscussion] = useState(null);
  const [editDiscussionData, setEditDiscussionData] = useState({ title: '', content: '' });
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Filtered announcements ──────────────────────────────────────────────

  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === 'active') return !a.is_archived;
    if (filter === 'pinned') return a.is_pinned;
    if (filter === 'archived') return a.is_archived;
    return true;
  }).filter((a) => tagFilter === 'all' || a.tags?.includes(tagFilter));

  // ── Discussion handlers ─────────────────────────────────────────────────

  const handleToggleExpand = (id) => setExpandedDiscussion((prev) => (prev === id ? null : id));

  const handleReplyChange = (discussionId, value) =>
    setReplyTexts((prev) => ({ ...prev, [discussionId]: value }));

  const handleAddReply = async (discussionId) => {
    const text = replyTexts[discussionId]?.trim();
    if (!text) return;
    const result = await onAddDiscussionReply(discussionId, {
      content: text,
      author_name: currentUser.name,
      author_id: currentUser.id,
      role: currentUser.role,
    });
    if (result.success) setReplyTexts((prev) => ({ ...prev, [discussionId]: '' }));
  };

  const handleEditStart = (discussion) => {
    setEditingDiscussion(discussion.id);
    setEditDiscussionData({ title: discussion.title, content: discussion.content });
  };

  const handleEditCancel = () => {
    setEditingDiscussion(null);
    setEditDiscussionData({ title: '', content: '' });
  };

  const handleEditSubmit = async (discussionId, data) => {
    const result = await onEditDiscussion(discussionId, { title: data.title.trim(), content: data.content.trim() });
    if (result.success) handleEditCancel();
  };

  const handleDeleteDiscussion = (discussionId) =>
    setDeleteConfirm({ type: 'discussion', discussionId });

  const handleDeleteAnnouncement = (announcementId) =>
    setDeleteConfirm({ type: 'announcement', announcementId });

  const handleDeleteReply = (discussionId, replyId) =>
    setDeleteConfirm({ type: 'reply', discussionId, replyId });

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'announcement') await onDeleteAnnouncement(deleteConfirm.announcementId);
    else if (deleteConfirm.type === 'discussion') await onDeleteDiscussion(deleteConfirm.discussionId);
    else await onDeleteDiscussionReply(deleteConfirm.discussionId, deleteConfirm.replyId);
    setDeleteConfirm(null);
  };

  const handleStartEditReply = (reply) => {
    setEditingReply(reply.id);
    setEditReplyContent(reply.content);
  };

  const handleCancelEditReply = () => {
    setEditingReply(null);
    setEditReplyContent('');
  };

  const handleSubmitEditReply = async (discussionId, replyId, content) => {
    const result = await onEditDiscussionReply(discussionId, replyId, { content });
    if (result.success) handleCancelEditReply();
  };

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="flex gap-4 p-3 sm:p-4 relative">
      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Filter bar */}
        <FilterBar filter={filter} setFilter={setFilter} tagFilter={tagFilter} setTagFilter={setTagFilter} />

        {/* Announcements */}
        {filteredAnnouncements.length === 0 ? (
          <EmptyState onCreate={() => setShowCreateModal(true)} />
        ) : (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onView={setSelectedAnnouncement}
              onEdit={onEditClick}
              onArchive={onArchiveAnnouncement}
              onDelete={handleDeleteAnnouncement}
              onToggleLock={onToggleLock}
            />
          ))
        )}

        {/* Discussions */}
        {discussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            discussion={discussion}
            currentUser={currentUser}
            isExpanded={expandedDiscussion === discussion.id}
            onToggleExpand={handleToggleExpand}
            onLike={onLikeDiscussion}
            onEdit={handleEditStart}
            onDelete={handleDeleteDiscussion}
            onSubmitEdit={handleEditSubmit}
            onCancelEdit={handleEditCancel}
            editingDiscussion={editingDiscussion}
            editDiscussionData={editDiscussionData}
            onEditDataChange={setEditDiscussionData}
            replyText={replyTexts[discussion.id] || ''}
            onReplyChange={handleReplyChange}
            onAddReply={handleAddReply}
            onDeleteReply={onDeleteDiscussionReply}
            onLikeReply={onLikeDiscussionReply}
            editingReply={editingReply}
            editReplyContent={editReplyContent}
            onEditReplyChange={setEditReplyContent}
            onStartEditReply={handleStartEditReply}
            onCancelEditReply={handleCancelEditReply}
            onSubmitEditReply={handleSubmitEditReply}
            onDeleteReplyConfirm={handleDeleteReply}
          />
        ))}
      </div>

      {/* Sidebar */}
      <CreateSidebar onCreate={() => setShowCreateModal(true)} />

      {/* Mobile FAB */}
      <MobileFAB onCreate={() => setShowCreateModal(true)} />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        deleteConfirm={deleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}