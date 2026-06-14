import React, { useState } from "react";
import { Heart, Trash2, Share2 } from "lucide-react";

const PostComments = ({ commentsData, onCommentLike, onCommentDelete, onCommentShare, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="mt-5 sm:mt-6 mb-2">
      <h3 className="text-[17px] sm:text-lg font-semibold text-black mb-3.5">
        {commentsData?.length || 0} Comments
      </h3>

      {/* Add Comment Input */}
      <div className="mb-6 p-4 bg-[#f2f2f2] border border-[#52586633] rounded-[10px] sm:rounded-xl">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full min-h-[60px] text-sm bg-transparent border-none focus:outline-none resize-none placeholder-gray-500"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={() => { onCommentSubmit(newComment); setNewComment(""); }}
            disabled={!newComment.trim()}
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "rgb(30, 97, 240)" }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Comments List */}
      {commentsData && commentsData.length > 0 ? (
        <div className="space-y-6">
          {commentsData.map((comment) => (
            <div key={comment.id} id={`comment-${comment.id}`}>
              <div className="flex items-center gap-4">
                <img src={comment.authorAvatar} alt={comment.authorName} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex flex-col">
                  <h4 className="font-medium text-[15px] text-black">{comment.authorName}</h4>
                  <p className="text-sm text-gray-500">{comment.description}</p>
                </div>
              </div>
              <div className="my-2.5 sm:ml-14">
                <p className="text-[15px] sm:text-base text-black leading-normal">{comment.content}</p>
              </div>
              <div className="flex items-center justify-between mt-[1px] sm:ml-14">
                <div className="flex items-center gap-3">
                  <button onClick={() => onCommentLike(comment.id)} className="flex items-center gap-1.5 text-gray-600 transition-colors">
                    <Heart size={17} fill={comment.isLiked ? "#ef4444" : "none"} color={comment.isLiked ? "#ef4444" : "#6B7280"} />
                    <span className="text-sm">{comment.likes} likes</span>
                  </button>
                  {comment.isEditable && (
                    <button onClick={() => onCommentDelete(comment.id)} className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 size={17} className="mb-[1px]" />
                      <span className="text-sm">Delete</span>
                    </button>
                  )}
                </div>
                <button onClick={() => onCommentShare(comment.id)} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors">
                  <Share2 size={17} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      )}
    </div>
  );
};

export default PostComments;