import React, { useState } from "react";
import { Plus } from "lucide-react";
import { getIconComponent, copyToClipboard } from "../utils/Boardutils";

const BoardSidebar = ({ boardData, onCreatePost }) => {
  const [shareClicked, setShareClicked] = useState(false);

  const handleShare = async () => {
    try {
      await copyToClipboard();
      setShareClicked(true);
      setTimeout(() => setShareClicked(false), 2000);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full sm:max-w-[320px]" style={{ flexShrink: 0, position: "sticky", top: "20px" }}>
      {/* Quick Details */}
      <div className="bg-white sm:rounded-[20px] px-5 pt-4 pb-[22px] sm:p-[22px] sm:pt-[20px] sm:pb-[24px] w-full"
        style={{ border: "1px solid #D3D6DA", height: "fit-content" }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: "black" }}>Board Stats</h3>
        <div className="space-y-2">
          {boardData?.quickDetails?.map((detail) => {
            const IconComponent = getIconComponent(detail.icon);
            if (detail.isShareable) return (
              <button key={detail.id} onClick={handleShare} className="flex items-center gap-2.5 w-full text-left rounded-lg transition-colors">
                <IconComponent size={16} style={{ color: shareClicked ? "#16a34a" : "#474747", flexShrink: 0 }} />
                <span className="text-[15px] mt-[1px]" style={{ color: shareClicked ? "#16a34a" : "#474747" }}>
                  {shareClicked ? "Copied to Clipboard" : detail.text}
                </span>
              </button>
            );
            return (
              <div key={detail.id} className="flex items-center gap-2.5">
                <IconComponent size={16} style={{ color: "rgb(55, 65, 81)", flexShrink: 0 }} />
                <span className="text-[15px] mt-[1px]" style={{ color: "rgb(55, 65, 81)" }}>{detail.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Post Button (desktop only) */}
      <div className="bg-white rounded-2xl p-[22px] hidden mdg:block"
        style={{ border: "1px solid #D3D6DA", borderRadius: "20px", height: "fit-content" }}>
        <button onClick={onCreatePost}
          className="flex items-center justify-center gap-2 text-white font-medium transition-colors duration-200 w-full"
          style={{ height: "44px", borderRadius: "10px", backgroundColor: "rgb(30, 97, 240)", fontSize: "14px" }}>
          <Plus size={16} />
          Create New Post
        </button>
      </div>
    </div>
  );
};

export default BoardSidebar;