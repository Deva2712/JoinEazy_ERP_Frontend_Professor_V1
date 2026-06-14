import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Trash2, Send, Edit2 } from 'lucide-react';

function RoleBadge({ role, isSelf }) {
  if (isSelf) return <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px] font-medium">You</span>;
  if (role === 'professor') return <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium">Professor</span>;
  if (role === 'student') return <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px] font-medium">Student</span>;
  return null;
}

function formatTime(timestamp) {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DiscussionCard({ discussion, currentUser, onDelete, onEdit, onLike, onAddReply, onDeleteReply, onEditReply, onLikeReply }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editingDiscussion, setEditingDiscussion] = useState(false);
  const [editData, setEditData] = useState({ title: discussion.title, content: discussion.content });
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const isOwner = Number(discussion.author_id) === Number(currentUser.id);

  const handleSaveEdit = async () => {
    if (!editData.title.trim() || !editData.content.trim()) return;
    const result = await onEdit(discussion.id, { title: editData.title.trim(), content: editData.content.trim() });
    if (result.success) setEditingDiscussion(false);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    const result = await onAddReply(discussion.id, { content: replyText.trim(), author_name: currentUser.name, author_id: currentUser.id, role: currentUser.role });
    if (result.success) setReplyText('');
  };

  const handleSaveReply = async (replyId) => {
    if (!editReplyContent.trim()) return;
    const result = await onEditReply(discussion.id, replyId, { content: editReplyContent.trim() });
    if (result.success) { setEditingReplyId(null); setEditReplyContent(''); }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3">
        {editingDiscussion ? (
          <div className="space-y-2">
            <input type="text" value={editData.title} onChange={(e) => setEditData(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <textarea value={editData.content} onChange={(e) => setEditData(p => ({ ...p, content: e.target.value }))} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setEditingDiscussion(false)} className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} disabled={!editData.title.trim() || !editData.content.trim()} className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 flex-1">
                {discussion.title}
                {discussion.edited_at && <span className="ml-2 text-xs text-gray-400 font-normal">(edited)</span>}
              </h4>
              {isOwner && (
                <div className="flex gap-1">
                  <button onClick={() => { setEditData({ title: discussion.title, content: discussion.content }); setEditingDiscussion(true); }} className="p-1 rounded text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Edit2 size={13} /></button>
                  <button onClick={() => onDelete(discussion.id)} className="p-1 rounded text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={13} /></button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
              <span className={discussion.role === 'professor' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>{discussion.author_name}</span>
              <RoleBadge role={discussion.role} isSelf={Number(discussion.author_id) === Number(currentUser.id)} />
              <span>•</span>
              <span>{formatTime(discussion.created_at)}</span>
            </div>
            <p className={`text-sm text-gray-700 dark:text-gray-300 mt-0.5 ${!isExpanded && 'line-clamp-2'}`}>{discussion.content}</p>
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><ThumbsUp size={11} />{discussion.likes || 0}</span>
                <span className="flex items-center gap-1"><MessageSquare size={11} />{discussion.replies?.length || 0}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onLike(discussion.id)} className={`flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-medium transition-colors ${discussion.liked_by_current_user ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <ThumbsUp size={13} className={discussion.liked_by_current_user ? 'fill-current' : ''} /><span>Like</span>
                </button>
                <button onClick={() => setIsExpanded(p => !p)} className="flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MessageSquare size={13} /><span>Reply</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {discussion.replies?.length > 0 && (
            <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
              {discussion.replies.map((reply) => {
                const isReplyOwner = Number(reply.author_id) === Number(currentUser.id);
                const isEditingThis = editingReplyId === reply.id;
                return (
                  <div key={reply.id} className="flex gap-2 text-sm">
                    {isEditingThis ? (
                      <div className="flex-1 space-y-2">
                        <textarea value={editReplyContent} onChange={(e) => setEditReplyContent(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingReplyId(null); setEditReplyContent(''); }} className="flex-1 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                          <button onClick={() => handleSaveReply(reply.id)} disabled={!editReplyContent.trim()} className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${reply.role === 'professor' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>{reply.author_name}</span>
                            <RoleBadge role={reply.role} isSelf={Number(reply.author_id) === Number(currentUser.id)} />
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatTime(reply.created_at)}</span>
                            {reply.edited_at && <span className="text-[10px] text-gray-400 dark:text-gray-500">(edited)</span>}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                          <button onClick={() => onLikeReply(discussion.id, reply.id)} className={`flex items-center gap-1 mt-1 text-xs transition-colors ${reply.liked_by_current_user ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                            <ThumbsUp size={12} className={reply.liked_by_current_user ? 'fill-current' : ''} /><span>{reply.likes || 0}</span>
                          </button>
                        </div>
                        {isReplyOwner && (
                          <div className="flex flex-col gap-1">
                            <button onClick={() => { setEditingReplyId(reply.id); setEditReplyContent(reply.content); }} className="p-1 rounded text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><Edit2 size={12} /></button>
                            <button onClick={() => onDeleteReply(discussion.id, reply.id)} className="p-1 rounded text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={12} /></button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button onClick={handleSendReply} disabled={!replyText.trim()} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}