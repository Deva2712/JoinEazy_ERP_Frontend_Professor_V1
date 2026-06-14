import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { POST_TYPE_COLORS } from "../utils/Boardutils";

const POST_TYPE_OPTIONS = ["Announcement", "Discussion", "Question", "Resource"];

const PostTypeSelector = ({ postType, onChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const currentType = postType || "Discussion";

  const handleSelect = (type) => { onChange(type); setShowMenu(false); };

  return (
    <div className="relative">
      {/* Active Tag Button */}
      <button onClick={() => setShowMenu(!showMenu)}
        className="px-3 py-1.5 text-sm rounded-full border-transparent text-white flex items-center gap-1.5 transition-all duration-200"
        style={{ backgroundColor: POST_TYPE_COLORS[currentType.toLowerCase()] }}>
        {currentType}
        <ChevronDown size={14} className={`transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {showMenu && (
        <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[280px] overflow-hidden"
          style={{ bottom: "auto", top: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" }}
          onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Choose Post Type</h3>
            <p className="text-xs text-gray-600">Select the type of content you're sharing</p>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2.5">
              {POST_TYPE_OPTIONS.map((type) => (
                <button key={type} onClick={() => handleSelect(type)}
                  className="px-3 py-1.5 text-sm rounded-full border-transparent text-white transition-all duration-200 hover:opacity-80"
                  style={{ backgroundColor: POST_TYPE_COLORS[type.toLowerCase()] }}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTypeSelector;