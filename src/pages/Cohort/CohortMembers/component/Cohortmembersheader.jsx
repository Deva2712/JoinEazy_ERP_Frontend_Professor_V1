import React from "react";
import { Plus, Download, Search } from "lucide-react";

const memberTypeOptions = ["Individual", "Groups"];

const CohortMembersHeader = ({
  memberType,
  memberTypeRef,
  user_type,
  isInGroup,
  searchTerm,
  totalGroups,
  membersInGroups,
  currentCourseMembers,
  onMemberTypeChange,
  onCreateGroup,
  onExport,
  onSearchChange,
  setShowDisabledCreatePopup,
  gradeWholeGroup,
  onGradeWholeGroupChange,
  statusFilter,
  onStatusFilterChange,
  selectedAssignment,
  assignments,
  onAssignmentChange,
}) => (
  <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">

    {/* Row 1 — Title + Legend + Grade Whole Group + Assignment+Status Dropdown */}
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">

      {/* Left: Title + badge */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
          Course Members
        </h2>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
          {memberType === "Individual"
            ? currentCourseMembers
            : `${totalGroups} groups, ${membersInGroups} members`}
        </span>
      </div>

      {/* Right: Legend + Grade Whole Group + Dropdown */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>Assignment Progress:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Submitted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Late/Overdue
          </span>
        </div>

        {/* Grade Whole Group */}
        {user_type === 1 && (
          <label className="flex items-center gap-2 cursor-pointer select-none border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5">
            <div
              onClick={() => onGradeWholeGroupChange?.(!gradeWholeGroup)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                gradeWholeGroup
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500"
              }`}
            >
              {gradeWholeGroup && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Grade Whole Group
            </span>
          </label>
        )}

        {/* Combined Assignment + Status Filter Dropdown */}
        {user_type === 1 && (
          <select
            value={selectedAssignment || statusFilter || "all"}
            onChange={(e) => {
              const val = e.target.value;
              if (["all", "submitted", "pending", "late"].includes(val)) {
                onStatusFilterChange?.(val);
                onAssignmentChange?.(null);
              } else {
                onAssignmentChange?.(val);
                onStatusFilterChange?.("all");
              }
            }}
            className="text-xs px-2 py-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignments</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="late">Late/Overdue</option>
        
          </select>
        )}
      </div>
    </div>

    {/* Row 2 — Toggle + Search + Buttons */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">

      {/* Individual/Groups Toggle */}
      <div
        className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5"
        ref={memberTypeRef}
      >
        {memberTypeOptions.map((option) => (
          <button
            key={option}
            onClick={() => onMemberTypeChange(option)}
            className={`px-3 py-1.5 text-xs rounded-md ${
              memberType === option
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${memberType.toLowerCase()}...`}
          value={searchTerm || ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        {user_type === 1 ? (
          <>
            <button
              onClick={onCreateGroup}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md flex items-center gap-1 whitespace-nowrap"
            >
              <Plus size={14} /> Create Group
            </button>
            <button
              onClick={onExport}
              className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md flex items-center gap-1 whitespace-nowrap"
            >
              <Download size={14} /> Export
            </button>
          </>
        ) : (
          <button
            onClick={() => (!isInGroup ? onCreateGroup() : setShowDisabledCreatePopup(true))}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md flex items-center gap-1 whitespace-nowrap"
          >
            <Plus size={14} /> Create Group
          </button>
        )}
      </div>
    </div>
  </div>
);

export default CohortMembersHeader;