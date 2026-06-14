// src/pages/CohortMembers/components/GroupModalParts.jsx
import React from "react";
import { Share2, Edit, Trash2, Plus, Search, UserPlus } from "lucide-react";
// ─── Group Info ───────────────────────────────────────────────────────────────

export const GroupInfo = ({ groupData }) => (
  <div>
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 md:mb-2.5 break-words">
      {groupData.name}
    </h3>

    <div className="mb-1.5 sm:mb-2 md:mb-2.5">
      {groupData.isProject && (
        groupData.projectChosen ? (
          <p className="text-xs sm:text-sm md:text-[15px] text-blue-600 dark:text-blue-400 font-medium break-words">
            Project: {groupData.projectName}
          </p>
        ) : (
          <p className="text-xs sm:text-sm md:text-[15px] text-gray-500 dark:text-gray-400 font-medium">
            Project is not yet decided
          </p>
        )
      )}
    </div>

    {groupData.createdAt && (
      <div className="mb-1.5 sm:mb-2 md:mb-2.5">
        <p className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-400">
          Created: {new Date(groupData.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>
    )}

    <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 break-words">
      {groupData.description}
    </p>
  </div>
);

// ─── Group Actions ────────────────────────────────────────────────────────────

export const GroupActions = ({ groupData, onShare, onEditGroup, onDeleteGroup }) => (
  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-5 mb-1">
    <button
      onClick={onShare}
      className="flex items-center gap-1 sm:gap-1.5 md:gap-2 transition-colors text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm md:text-[15px] hover:text-gray-900 dark:hover:text-white"
    >
      <Share2 size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
      <span>Share</span>
    </button>

    {groupData.isEditable && (
      <>
        <button
          onClick={onEditGroup}
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 transition-colors text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm md:text-[15px] hover:text-gray-900 dark:hover:text-white"
        >
          <Edit size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
          <span>Edit Group</span>
        </button>
        <button
          onClick={onDeleteGroup}
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 transition-colors text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm md:text-[15px] hover:text-red-700 dark:hover:text-red-300"
        >
          <Trash2 size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
          <span>Delete Group</span>
        </button>
      </>
    )}
  </div>
);

// ─── Add Member Panel ─────────────────────────────────────────────────────────

export const AddMemberPanel = ({ searchTerm, filteredAvailableMembers, onSearchChange, onAddToGroup }) => (
  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 md:space-y-4">
    <div className="relative">
      <Search size={14} className="sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search members..."
        className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>

    {filteredAvailableMembers.length > 0 ? (
      <div className="space-y-1.5 sm:space-y-2 max-h-40 overflow-y-auto">
        {filteredAvailableMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-1.5 sm:p-2 md:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
              <img src={member.avatar} alt={member.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate">{member.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.description}</p>
              </div>
            </div>
            <button
              onClick={() => onAddToGroup(member.id)}
              className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex-shrink-0"
            >
              <UserPlus size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>Add</span>
            </button>
          </div>
        ))}
      </div>
    ) : searchTerm ? (
      <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-xs sm:text-sm">No members found</p>
    ) : null}
  </div>
);

// ─── Members List ─────────────────────────────────────────────────────────────

export const MembersList = ({ members, isEditable, onAddMemberToggle, onRemoveMember }) => (
  <>
    {/* Header row */}
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white">
        {members.length} Member{members.length !== 1 ? "s" : ""}
      </h4>
      <button
        onClick={onAddMemberToggle}
        className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-[15px] text-white font-medium rounded-full transition-colors flex-shrink-0"
        style={{ backgroundColor: "rgb(30, 97, 240)", minHeight: "28px" }}
      >
        <Plus size={14} className="sm:w-4 sm:h-4" />
        <span>Add</span>
      </button>
    </div>

    {/* Member rows */}
    {members.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-xs sm:text-sm">
        No members in this group yet
      </p>
    ) : (
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        {members.map((member) => (
          <div key={member.id}>
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3.5">
              <img src={member.avatar} alt={member.name} className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm md:text-base truncate">{member.name}</h5>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{member.description}</p>
              </div>
              {/* Desktop remove */}
              {isEditable && (
                <button onClick={() => onRemoveMember(member.id)} className="hidden sm:block p-1 sm:p-1.5 md:p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400 flex-shrink-0">
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
            {/* Mobile remove */}
            {isEditable && (
              <div className="flex justify-end mt-2 ml-10 sm:hidden">
                <button onClick={() => onRemoveMember(member.id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </>
);