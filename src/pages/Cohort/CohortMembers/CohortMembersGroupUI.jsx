// src/pages/CohortMembers/CohortMembersGroupUI.jsx

import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { GroupInfo, GroupActions, AddMemberPanel, MembersList } from "./component/GroupModalPartss";

const CohortMembersGroupUI = ({
  isOpen, onClose, groupData, members,
  showAddMember, searchTerm, filteredAvailableMembers,
  loading, error,
  onShare, onEditGroup, onDeleteGroup,
  onAddMemberToggle, onSearchChange, onAddToGroup, onRemoveMember,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={handleOverlayClick}>
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[35rem] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Group Details</h2>
          <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={18} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 md:space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Loading group details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <p className="text-red-600 dark:text-red-400 mb-4 text-xs sm:text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm">
                  Try Again
                </button>
              </div>
            </div>
          ) : groupData ? (
            <>
              <GroupInfo groupData={groupData} />
              <GroupActions groupData={groupData} onShare={onShare} onEditGroup={onEditGroup} onDeleteGroup={onDeleteGroup} />
              <div className="border-t border-gray-200 dark:border-gray-700" />
              <MembersList members={members} isEditable={groupData.isEditable} onAddMemberToggle={onAddMemberToggle} onRemoveMember={onRemoveMember} />
              {showAddMember && (
                <AddMemberPanel searchTerm={searchTerm} filteredAvailableMembers={filteredAvailableMembers} onSearchChange={onSearchChange} onAddToGroup={onAddToGroup} />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">No group data available</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CohortMembersGroupUI;