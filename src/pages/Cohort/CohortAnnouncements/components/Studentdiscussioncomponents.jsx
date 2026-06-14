import React from 'react';
import { MessageSquare, AlertCircle, Calendar, Plus, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { formatDate, formatShortDate, replyLabel } from '../utils/Announcementutils';
import { RoleBadge } from './SharedAtoms';

// ── Reply item ────────────────────────────────────────────────────────────

function StudentReplyItem({ reply, discussion, currentUser, editingReply, editReplyContent, onEditReplyChange, onStartEdit, onCancelEdit, onSubmitEdit, onDelete, onLike }) {
  const isEditingThis = editingReply === reply.id;
  const isOwn = Number(currentUser?.id) === Number(reply.author_id);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
      {isEditingThis ? (
        <div className="space-y-2">
          <textarea value={editReplyContent} onChange={(e) => onEditReplyChange(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
          <div className="flex gap-2">
            <button onClick={onCancelEdit} className="flex-1 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            <button onClick={() => onSubmitEdit(discussion.id, reply.id, editReplyContent.trim())} disabled={!editReplyContent.trim()} className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white text-sm">{reply.author_name}</span>
              <RoleBadge role={reply.role} isCurrentUser={Number(reply.author_id) === Number(currentUser?.id)} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatShortDate(reply.created_at)}</span>
              {reply.edited_at && <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>}
            </div>
            {isOwn && (
              <div className="flex gap-1">
                <button onClick={() => onStartEdit(reply)} className="text-blue-600 hover:text-blue-700 dark:text-blue-400"><Edit2 size={12} /></button>
                <button onClick={() => onDelete(discussion.id, reply.id)} className="text-red-600 hover:text-red-700 dark:text-red-400"><Trash2 size={12} /></button>
              </div>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mb-2">{reply.content}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><ThumbsUp size={12} />{reply.likes_count || 0}</span>
            <button onClick={() => onLike(discussion.id, reply.id)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${reply.liked_by_current_user ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <ThumbsUp size={12} className={reply.liked_by_current_user ? 'fill-current' : ''} /><span>Like</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Discussion card ───────────────────────────────────────────────────────

export function StudentDiscussionCard({
  discussion, currentUser, isExpanded,
  onToggleExpand, onLike,
  onEdit, onDelete,
  onSubmitEdit, onCancelEdit,
  editingDiscussion, editDiscussionData, onEditDataChange,
  replyText, onReplyChange, onAddReply, onLikeReply,
  editingReply, editReplyContent, onEditReplyChange,
  onStartEditReply, onCancelEditReply, onSubmitEditReply,
  onDeleteReplyConfirm,
}) {
  const isEditingThis = editingDiscussion === discussion.id;
  const isAuthor = Number(currentUser?.id) === Number(discussion.author_id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-700 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{discussion.title}</h3>
              <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Discussion</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>{discussion.author_name}</span>
              <RoleBadge role={discussion.role} isCurrentUser={Number(discussion.author_id) === Number(currentUser?.id)} />
            </div>
          </div>
          {isAuthor && (
            <div className="flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); onEdit(discussion); }} className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit"><Edit2 size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(discussion.id); }} className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete"><Trash2 size={14} /></button>
            </div>
          )}
        </div>

        {isEditingThis ? (
          <div className="mb-1.5 space-y-2">
            <input type="text" value={editDiscussionData.title} onChange={(e) => onEditDataChange({ ...editDiscussionData, title: e.target.value })} placeholder="Discussion title..." className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <textarea value={editDiscussionData.content} onChange={(e) => onEditDataChange({ ...editDiscussionData, content: e.target.value })} rows={3} placeholder="Discussion content..." className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
            <div className="flex gap-2">
              <button onClick={onCancelEdit} className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
              <button onClick={() => onSubmitEdit(discussion.id, editDiscussionData)} disabled={!editDiscussionData.title.trim() || !editDiscussionData.content.trim()} className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-1.5 whitespace-pre-wrap">{discussion.content}</p>
            {discussion.edited_at && <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">(edited)</p>}
          </>
        )}

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(discussion.created_at)}</span>
            <span className="flex items-center gap-1"><ThumbsUp size={12} />{discussion.likes_count || 0}</span>
            <span className="flex items-center gap-1"><MessageSquare size={12} />{replyLabel(discussion.replies?.length)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onLike(discussion.id); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${discussion.liked_by_current_user ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <ThumbsUp size={16} className={discussion.liked_by_current_user ? 'fill-current' : ''} /><span>Like</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleExpand(discussion.id); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MessageSquare size={16} /><span>Reply</span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {discussion.replies?.length > 0 && (
              <div className="space-y-3 mb-4">
                {discussion.replies.map((reply) => (
                  <StudentReplyItem key={reply.id} reply={reply} discussion={discussion} currentUser={currentUser} editingReply={editingReply} editReplyContent={editReplyContent} onEditReplyChange={onEditReplyChange} onStartEdit={onStartEditReply} onCancelEdit={onCancelEditReply} onSubmitEdit={onSubmitEditReply} onDelete={onDeleteReplyConfirm} onLike={onLikeReply} />
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <textarea value={replyText || ''} onChange={(e) => onReplyChange(discussion.id, e.target.value)} placeholder="Write your reply..." rows={2} className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (replyText?.trim()) onAddReply(discussion.id); } }} />
              <button onClick={() => onAddReply(discussion.id)} disabled={!replyText?.trim()} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">Reply</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────

export function StudentDeleteModal({ deleteConfirm, onConfirm, onCancel }) {
  if (!deleteConfirm) return null;
  const isDiscussion = deleteConfirm.type === 'discussion';
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{isDiscussion ? 'Delete Discussion' : 'Delete Reply'}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete this {isDiscussion ? 'discussion' : 'reply'}?</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Create Discussion sidebar + FAB ───────────────────────────────────────

export function CreateDiscussionSidebar({ onCreate }) {
  return (
    <div className="hidden lg:flex flex-col gap-3 w-full lg:w-[280px] xl:w-[300px] flex-shrink-0">
      <div className="lg:sticky lg:top-4 self-start">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-white" />
              <h4 className="text-sm font-semibold text-white">Create New Discussion</h4>
            </div>
            <p className="text-xs text-green-100 leading-snug">Have a question? Start a discussion with your peers</p>
            <button onClick={onCreate} className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all shadow-sm hover:shadow-md border border-transparent dark:border-gray-700">
              <Plus size={16} className="text-green-600 dark:text-green-400" />New Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudentMobileFAB({ onCreate }) {
  return (
    <button onClick={onCreate} className="lg:hidden fixed bottom-20 right-6 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 px-4 py-3 z-40 active:scale-95" title="Start Discussion">
      <Plus size={20} />
      <span className="text-sm font-semibold whitespace-nowrap">Start Discussion</span>
    </button>
  );
}