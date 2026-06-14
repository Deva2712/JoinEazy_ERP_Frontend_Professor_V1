import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import VisibilityMenu from "../components/Visibilitymenu";
import PostTypeSelector from "../components/PostTypeSelector";

const CohortBoardCreateUI = ({
  isOpen, onClose, postData, setPostData, handleSave, error,
  membersList, groupsList, memberType, user_type, handleCoverUpload, editMode = false,
}) => {
  const [coverImage, setCoverImage] = useState(null);
  const [coverError, setCoverError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!postData.postType) setPostData((prev) => ({ ...prev, postType: "Discussion" }));
  }, []);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const [success, message] = await handleCoverUpload(file);
    if (success) { setCoverImage(URL.createObjectURL(file)); setCoverError(""); }
    else setCoverError(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={handleOverlayClick}>
      <div className="bg-white rounded-none sm:rounded-2xl shadow-lg w-full sm:max-w-[35rem] h-[100vh] md:h-auto md:max-h-[80vh] mx-0 sm:mx-4 relative flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">{editMode ? "Edit Post" : "Create Post"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto">

          {/* Cover Image */}
          {!coverImage ? (
            <div>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 h-9 px-3 pr-3.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Plus size={16} />Cover image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              {coverError && <div className="text-red-500 text-xs mt-1">{coverError}</div>}
            </div>
          ) : (
            <div className="mb-4">
              <img src={coverImage} alt="Cover" className="w-24 h-16 object-cover rounded-lg border border-gray-300" />
            </div>
          )}

          {/* Title */}
          <div className="mt-4 mb-2">
            <input type="text" placeholder="Post Title" value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              className="w-full text-xl font-semibold placeholder-gray-500 focus:outline-none"
              style={{ border: "none", background: "transparent" }} />
          </div>

          {/* Content */}
          <div className="mb-4">
            <textarea placeholder="Content goes here..." value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              className="w-full min-h-[120px] text-base placeholder-gray-500 focus:outline-none resize-none"
              style={{ border: "none", background: "transparent" }} />
          </div>

          {/* Visibility */}
          <VisibilityMenu user_type={user_type} memberType={memberType} membersList={membersList} groupsList={groupsList} />

          {error && <div className="text-red-500 text-[15px] text-left mt-3">{error}</div>}
        </div>

        {/* Footer */}
        <div className="flex mt-auto items-center justify-between p-5 border-t border-gray-200">
          <PostTypeSelector
            postType={postData.postType}
            onChange={(type) => setPostData({ ...postData, postType: type })}
          />
          <button onClick={handleSave} className="h-10 px-6 text-white font-medium rounded-full transition-all duration-200"
            style={{ backgroundColor: "rgb(30, 97, 240)" }}>
            {editMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CohortBoardCreateUI;