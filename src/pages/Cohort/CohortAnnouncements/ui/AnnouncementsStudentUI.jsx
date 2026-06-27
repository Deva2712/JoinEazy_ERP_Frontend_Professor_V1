
import React, { useState } from 'react';
import { StudentFilterBar, StudentAnnouncementCard, StudentEmptyState, LoadingState, ErrorState } from '../components/Studentannouncementcomponents';
import { StudentDiscussionCard, StudentDeleteModal, CreateDiscussionSidebar, StudentMobileFAB } from '../components/Studentdiscussioncomponents';
import { filterDiscussionsStudent } from '../utils/Announcementutils';

export default function AnnouncementsStudentUI({
  announcements,
  discussions,
  currentUser,
  loading,
  error,
  selectedAnnouncement,
  setSelectedAnnouncement,
  onRefresh,
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
  const [filter, setFilter] = useState('active');
  const [tagFilter, setTagFilter] = useState('all');
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [editingDiscussion, setEditingDiscussion] = useState(null);
  const [editDiscussionData, setEditDiscussionData] = useState({ title: '', content: '' });
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);

  // ── Filtered announcements ──────────────────────────────────────────────

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesFilter = filter === 'archived' ? a.is_archived : !a.is_archived;
    const matchesTag = tagFilter === 'all' || a.tags?.includes(tagFilter);
    return matchesFilter && matchesTag;
  });

  // FIX: discussions were rendering unconditionally, ignoring both filters.
  const filteredDiscussions = filterDiscussionsStudent(discussions, filter, tagFilter);

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

  const handleDeleteReply = (discussionId, replyId) =>
    setDeleteConfirm({ type: 'reply', discussionId, replyId });

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'discussion') await onDeleteDiscussion(deleteConfirm.discussionId);
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
        <StudentFilterBar filter={filter} setFilter={setFilter} tagFilter={tagFilter} setTagFilter={setTagFilter} />

        {/* Announcements */}
        {filteredAnnouncements.length === 0 ? (
          <StudentEmptyState filter={filter} />
        ) : (
          filteredAnnouncements.map((announcement) => (
            <StudentAnnouncementCard key={announcement.id} announcement={announcement} onView={setSelectedAnnouncement} />
          ))
        )}

        {/* Discussions */}
        {filteredDiscussions.map((discussion) => (
          <StudentDiscussionCard
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
      <CreateDiscussionSidebar onCreate={() => setShowCreateDiscussion(true)} />

      {/* Mobile FAB */}
      <StudentMobileFAB onCreate={() => setShowCreateDiscussion(true)} />

      {/* Delete confirmation modal */}
      <StudentDeleteModal
        deleteConfirm={deleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}