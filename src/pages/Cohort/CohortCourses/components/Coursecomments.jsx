import React, { useState } from "react";
import { Share2, X } from "lucide-react";

const CourseComments = ({ initialComments = [], cohortData }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const handleComment = () => {
    if (comment.trim()) {
      const userData = cohortData?.userData || {};
      setComments([
        {
          id: Date.now(),
          authorName: userData.username || "You",
          authorAvatar: userData.profile_image || "",
          description: userData.description || "Current User",
          content: comment,
          isEditable: true,
        },
        ...comments,
      ]);
      setComment("");
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter((c) => c.id !== commentId));
  };

  return (
    <div>
      <h3 className="text-[17px] sm:text-lg font-semibold text-black mb-3.5">
        {comments.length} Comments
      </h3>

      {/* Input */}
      <div className="mb-6 p-4 bg-[#f2f2f2] border border-[#52586633] rounded-[10px] sm:rounded-xl">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full min-h-[60px] text-sm bg-transparent border-none focus:outline-none resize-none placeholder-gray-500"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleComment}
            disabled={!comment.trim()}
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "rgb(30, 97, 240)" }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-5">
        {comments.map((c) => (
          <div key={c.id} className="bg-white">
            <div className="flex items-center gap-3">
              <img src={c.authorAvatar} alt={c.authorName} className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-black text-[15px]">{c.authorName}</h4>
                <p className="text-sm text-gray-600">{c.description}</p>
              </div>
            </div>
            <p className="text-base text-black my-2.5 ml-[52px]">{c.content}</p>
            <div className="flex items-center gap-4 ml-[52px]">
              <button onClick={() => console.log("Share comment:", c.id)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 size={15} /> Share
              </button>
              {c.isEditable && (
                <button onClick={() => handleCommentDelete(c.id)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors">
                  <X size={15} /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseComments;