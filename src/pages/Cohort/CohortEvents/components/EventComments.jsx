import React from "react";
import { Share2, Trash2 } from "lucide-react";

export const EventComments = ({ commentsData, onAddComment, onCommentDelete }) => {
  const [newComment, setNewComment] = React.useState("");

  return (
    <div className="p-5 pt-5">
      <h3 className="text-[17px] font-semibold text-black mb-3.5">
        {commentsData?.length || 0} Comments
      </h3>

      <div className="mb-6 p-4 bg-[#f2f2f2] border border-[#52586633] rounded-[10px]">
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..." rows={3}
          className="w-full min-h-[60px] text-sm bg-transparent border-none focus:outline-none resize-none placeholder-gray-500" />
        <div className="flex justify-end mt-3">
          <button onClick={() => { onAddComment(newComment); setNewComment(""); }}
            disabled={!newComment.trim()}
            className="px-4 py-2 text-white text-sm font-medium rounded-lg bg-[#1E61F0] disabled:opacity-50">Submit</button>
        </div>
      </div>

      <div className="space-y-5">
        {commentsData?.map((comment) => (
          <div key={comment.id}>
            <div className="flex items-center gap-3">
              <img src={comment.authorAvatar} alt={comment.authorName} className="w-10 h-10 rounded-full flex-shrink-0" />
              <div>
                <h4 className="font-medium text-black text-[15px]">{comment.authorName}</h4>
                <p className="text-sm text-gray-600">{comment.description}</p>
              </div>
            </div>
            <p className="text-base text-black my-2.5 ml-[52px]">{comment.content}</p>
            <div className="flex items-center gap-4 ml-[52px]">
              <button className="flex items-center gap-1.5 text-sm text-gray-600"><Share2 size={15} /> Share</button>
              {comment.isEditable && (
                <button onClick={() => onCommentDelete(comment.id)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500"><Trash2 size={15} /> Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};