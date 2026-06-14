import React, { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import CreateDiscussionForm from './components/Creatediscussionform';
import DiscussionCard from './components/Discussioncard';

export default function StudentDiscussionsPanel({
  discussions,
  onCreateDiscussion,
  onDeleteDiscussion,
  onEditDiscussion,
  onAddReply,
  onDeleteReply,
  onEditReply,
  onLikeDiscussion,
  onLikeReply,
  currentUser,
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;
    setCreating(true);
    const result = await onCreateDiscussion({
      title: newDiscussion.title.trim(),
      content: newDiscussion.content.trim(),
      author_name: currentUser.name,
      author_id: currentUser.id,
      role: currentUser.role,
    });
    if (result.success) {
      setNewDiscussion({ title: '', content: '' });
      setShowCreateForm(false);
    }
    setCreating(false);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewDiscussion({ title: '', content: '' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discussions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ask questions and help each other</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <CreateDiscussionForm
          newDiscussion={newDiscussion}
          setNewDiscussion={setNewDiscussion}
          creating={creating}
          onSubmit={handleCreate}
          onCancel={handleCancelCreate}
        />
      )}

      {/* Discussions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {discussions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-2" size={40} />
              <p className="text-sm">No discussions yet</p>
              <p className="text-xs mt-1">Be the first to ask a question!</p>
            </div>
          </div>
        ) : (
          discussions.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              currentUser={currentUser}
              onDelete={onDeleteDiscussion}
              onEdit={onEditDiscussion}
              onLike={onLikeDiscussion}
              onAddReply={onAddReply}
              onDeleteReply={onDeleteReply}
              onEditReply={onEditReply}
              onLikeReply={onLikeReply}
            />
          ))
        )}
      </div>
    </div>
  );
}