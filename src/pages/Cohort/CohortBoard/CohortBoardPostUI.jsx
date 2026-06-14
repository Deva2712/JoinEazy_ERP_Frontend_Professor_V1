import React from "react";
import { X, Heart, Share2, Edit, Trash2, Tag } from "lucide-react";
import PostComments from "./components/Postcomments";

const getTypeColor = (type) => ({ announcement: "#ef4444", question: "#3b82f6", discussion: "#8b5cf6", resource: "#10b981" }[type] || "#6b7280");

const CohortBoardPostUI = ({
  isOpen, onClose, postData, loading, likeState, shareState,
  onLike, onShare, onTagToNote, isEditable = false, onEdit, onDelete,
  commentsData, onCommentLike, onCommentDelete, onCommentShare, onCommentSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white sm:rounded-2xl w-full sm:max-w-[80%] lg:max-w-[50%] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
          <h2 className="text-lg sm:text-xl font-bold text-black">
            {loading ? "Loading..." : postData?.title || "Post Details"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-gray-600">Loading post...</div>
            </div>
          ) : postData ? (
            <div>
              {postData.cover && (
                <img src={postData.cover} alt="Post cover" className="w-full h-auto object-cover aspect-[21/9]" />
              )}

              <div className="p-4 sm:p-5">
                {/* Author + Type */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <img src={postData.authorAvatar} alt={postData.author} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <h4 className="font-medium text-[15px] text-black">{postData.author}</h4>
                      <p className="text-sm text-gray-600">{postData.timeText}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-medium rounded-full text-white" style={{ backgroundColor: getTypeColor(postData.type) }}>
                    {postData.type}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-6 text-base leading-relaxed text-black">
                  {postData.content.split("\n").map((paragraph, index) =>
                    paragraph.trim() ? <p key={index} className="mb-4 last:mb-0">{paragraph.trim()}</p> : null
                  )}
                </div>

                {/* Actions */}
                <div className={`flex ${isEditable ? "flex-col sm:flex-row sm:items-center" : "items-center"} justify-between gap-y-3 py-4 border-t border-b border-[#52586633]`}>
                  <div className="flex items-center gap-4">
                    <button onClick={onLike} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart size={20} fill={likeState ? "#ef4444" : "none"} color={likeState ? "#ef4444" : "#6B7280"} />
                      <span className="text-sm font-medium">{postData.likes} likes</span>
                    </button>
                    {isEditable && (
                      <>
                        <button onClick={onEdit} className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                          <Edit size={18} /><span className="text-sm font-medium">Edit</span>
                        </button>
                        <button onClick={onDelete} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                          <Trash2 size={18} /><span className="text-sm font-medium">Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={onShare} className="flex items-center gap-2 transition-colors" style={{ color: shareState.clicked ? "#16a34a" : "#4B5563" }}>
                      <Share2 size={18} /><span className="text-sm font-medium">{shareState.text}</span>
                    </button>
                    <button onClick={onTagToNote} className="flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors">
                      <Tag size={18} /><span className="text-sm font-medium">Tag to Note</span>
                    </button>
                  </div>
                </div>

                <PostComments
                  commentsData={commentsData}
                  onCommentLike={onCommentLike}
                  onCommentDelete={onCommentDelete}
                  onCommentShare={onCommentShare}
                  onCommentSubmit={onCommentSubmit}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-gray-600">Post not found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortBoardPostUI;