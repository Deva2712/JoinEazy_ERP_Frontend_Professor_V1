import React, { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { getTypeColor, truncateContent, copyToClipboard } from "../utils/Boardutils";

const PostCard = ({ post, onLike, onPostClick }) => {
  const [shareClicked, setShareClicked] = useState(false);
  const [liked, setLiked] = useState(post.isLiked || false);

  const handleShare = async () => {
    try {
      await copyToClipboard();
      setShareClicked(true);
      setTimeout(() => setShareClicked(false), 2000);
    } catch (e) { console.error(e); }
  };

  const handleLike = () => {
    if (onLike(post.id)) setLiked((p) => !p);
  };

  const { displayParagraphs, needsEllipsis } = truncateContent(post.content);

  return (
    <div className="bg-white border-t border-b sm:border border-[#D3D6DA] sm:rounded-[20px] p-4 pb-0 sm:p-5 sm:pb-0 sm:px-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="flex items-start gap-3">
          <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 mt-[1px] rounded-full object-cover" />
          <div className="flex flex-col">
            <h4 className="font-medium text-[15px]" style={{ color: "black" }}>{post.author}</h4>
            <p className="text-sm text-gray-600">{post.timeText}</p>
          </div>
        </div>
        <div className="ml-auto">
          <span className="px-2 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: getTypeColor(post.type) }}>
            {post.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 mt-3.5 cursor-pointer" onClick={() => onPostClick(post.id)}>
        <h3 className="font-bold text-lg sm:text-[19px]" style={{ color: "black" }}>{post.title}</h3>
        <div className="mt-2 sm:mt-2.5 text-base leading-normal" style={{ color: "black" }}>
          {displayParagraphs.map((para, i) =>
            para.trim() ? (
              <p key={i} className="mb-2 last:mb-0 leading-normal pr-1">
                {para}{needsEllipsis && i === displayParagraphs.length - 1 ? "..." : ""}
              </p>
            ) : null
          )}
          <div className="text-base text-gray-600">See more</div>
        </div>
      </div>

      {post.cover && (
        <div className="mb-5 sm:mb-6">
          <img src={post.cover} alt="Post cover" className="w-full h-auto object-cover aspect-[21/9]" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center font-medium gap-4 py-3.5 sm:py-4 border-t border-[#D3D6DA] -mx-5 sm:-mx-6 px-5 sm:px-6">
        <button onClick={handleLike} className="flex items-center gap-1.5 text-gray-600 transition-colors">
          <Heart size={18} strokeWidth={2.2} className="mt-[1px]" fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#4B5563"} />
          <span className="text-sm">{post.likes} likes • {post.comments} comments</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 transition-colors ml-auto" style={{ color: shareClicked ? "#16a34a" : "#4B5563" }}>
          <Share2 size={17} />
          <span className="text-sm">{shareClicked ? "Copied" : "Share"}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;