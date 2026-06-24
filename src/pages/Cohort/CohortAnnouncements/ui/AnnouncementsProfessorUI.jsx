import React, { useState } from 'react';
import { FilterBar, AnnouncementCard, EmptyState, CreateSidebar, MobileFAB } from '../components/Professorannouncementcomponents';
import { DiscussionCard, DeleteConfirmModal } from '../components/Professordiscussioncomponents';
import { LoadingState, ErrorState } from '../components/Professoratoms';
import AnnouncementFormModal from '../Modals/AnnouncementFormModal';
import { X, Pin, Lock, MessageSquare, Calendar, Trash2, Send } from 'lucide-react';
import { formatDate } from '../utils/Announcementutils';

// ── Inline Detail Modal ──────────────────────────────────────────────────────
function AnnouncementDetailModal({ announcement, onClose, currentUser, onAddReply, onDeleteReply, onUpvoteReply }) {
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!announcement) return null;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onAddReply(announcement.id, {
      content: replyText.trim(),
      author_name: currentUser.name,
      author_id: currentUser.id,
      role: currentUser.role,
    });
    setReplyText('');
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {announcement.is_pinned && <Pin size={16} className="text-blue-600 fill-current" />}
              {announcement.is_locked && <Lock size={16} className="text-gray-500" />}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{announcement.title}</h2>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> {formatDate(announcement.created_at)}
              {announcement.author_name && <span className="ml-2">· by {announcement.author_name}</span>}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>

          {/* Replies */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={16} />
              Replies ({announcement.replies?.length || announcement.replies_count || 0})
            </h3>

            {(announcement.replies || []).length === 0 && (
              <p className="text-sm text-gray-500 italic">No replies yet — be the first!</p>
            )}

            {(announcement.replies || []).map((reply) => (
              <div key={reply.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-start gap-3">
                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                  {(reply.author_name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{reply.author_name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{reply.content}</p>
                </div>
                {(currentUser.id === reply.author_id || currentUser.role === 'professor') && (
                  <button onClick={() => onDeleteReply(announcement.id, reply.id)} className="p-1 text-red-400 hover:text-red-600 flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reply input */}
        {!announcement.is_locked && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleReply()}
              placeholder="Write a reply..."
              className="flex-1 h-10 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleReply}
              disabled={submitting || !replyText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={14} /> Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main UI ──────────────────────────────────────────────────────────────────
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

  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === 'active') return !a.is_archived;
    if (filter === 'pinned') return a.is_pinned;
    if (filter === 'archived') return a.is_archived;
    return true;
  }).filter((a) => tagFilter === 'all' || a.tags?.includes(tagFilter));

  const handleToggleExpand = (id) => setExpandedDiscussion((prev) => (prev === id ? null : id));
  const handleReplyChange = (discussionId, value) => setReplyTexts((prev) => ({ ...prev, [discussionId]: value }));

  const handleAddReply = async (discussionId) => {
    const text = replyTexts[discussionId]?.trim();
    if (!text) return;
    const result = await onAddDiscussionReply(discussionId, { content: text, author_name: currentUser.name, author_id: currentUser.id, role: currentUser.role });
    if (result.success) setReplyTexts((prev) => ({ ...prev, [discussionId]: '' }));
  };

  const handleEditStart = (discussion) => { setEditingDiscussion(discussion.id); setEditDiscussionData({ title: discussion.title, content: discussion.content }); };
  const handleEditCancel = () => { setEditingDiscussion(null); setEditDiscussionData({ title: '', content: '' }); };
  const handleEditSubmit = async (discussionId, data) => {
    const result = await onEditDiscussion(discussionId, { title: data.title.trim(), content: data.content.trim() });
    if (result.success) handleEditCancel();
  };

  const handleDeleteDiscussion = (discussionId) => setDeleteConfirm({ type: 'discussion', discussionId });
  const handleDeleteAnnouncement = (announcementId) => setDeleteConfirm({ type: 'announcement', announcementId });
  const handleDeleteReply = (discussionId, replyId) => setDeleteConfirm({ type: 'reply', discussionId, replyId });

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'announcement') await onDeleteAnnouncement(deleteConfirm.announcementId);
    else if (deleteConfirm.type === 'discussion') await onDeleteDiscussion(deleteConfirm.discussionId);
    else await onDeleteDiscussionReply(deleteConfirm.discussionId, deleteConfirm.replyId);
    setDeleteConfirm(null);
  };

  const handleStartEditReply = (reply) => { setEditingReply(reply.id); setEditReplyContent(reply.content); };
  const handleCancelEditReply = () => { setEditingReply(null); setEditReplyContent(''); };
  const handleSubmitEditReply = async (discussionId, replyId, content) => {
    const result = await onEditDiscussionReply(discussionId, replyId, { content });
    if (result.success) handleCancelEditReply();
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="flex gap-4 p-3 sm:p-4 relative">
      <div className="flex-1 min-w-0 space-y-4">
        <FilterBar filter={filter} setFilter={setFilter} tagFilter={tagFilter} setTagFilter={setTagFilter} />

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

        {(Array.isArray(discussions) ? discussions : []).map((discussion) => (
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

      <CreateSidebar onCreate={() => setShowCreateModal(true)} />
      <MobileFAB onCreate={() => setShowCreateModal(true)} />

      <DeleteConfirmModal
        deleteConfirm={deleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />

      <AnnouncementFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onCreateAnnouncement}
        title="Create New Announcement"
      />

      <AnnouncementFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={(data) => onUpdateAnnouncement(editingAnnouncement?.id, data)}
        title="Edit Announcement"
        initialData={editingAnnouncement}
      />

      {/* FIX: Detail modal — was missing, selectedAnnouncement was set but never rendered */}
      {selectedAnnouncement && (
        <AnnouncementDetailModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          currentUser={currentUser}
          onAddReply={onAddReply}
          onDeleteReply={onDeleteReply}
          onUpvoteReply={onUpvoteReply}
        />
      )}
    </div>
  );
}