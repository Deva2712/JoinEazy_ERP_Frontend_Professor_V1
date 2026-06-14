import React from "react";
import { Users } from "lucide-react";
import { Input } from "../../../../components/ui/input";

const inputStyle = { borderColor: "#BABFC5", borderWidth: "1px" };
const inputCls = "w-16 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

const GroupSettings = ({
  minGroupMembers,
  onMinGroupMembersChange,
  maxGroupMembers,
  onMaxGroupMembersChange,
  maxCourseMembers,
  onMaxCourseMembersChange,
}) => {
  return (
    <>
      {/* Group Settings */}
      <div className="space-y-2">
        <div>
          <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-0.5">Group Settings</h3>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">
            Configure group formation and member limits
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-gray-600 dark:text-gray-400" />
            <label className="text-xs font-medium text-gray-900 dark:text-gray-100">Members per Group</label>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700 dark:text-gray-300">Minimum</span>
              <Input
                type="number" min="1" max="20"
                value={minGroupMembers}
                onChange={(e) => onMinGroupMembersChange(parseInt(e.target.value) || 1)}
                className={inputCls} style={inputStyle}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700 dark:text-gray-300">Maximum</span>
              <Input
                type="number" min="1" max="20"
                value={maxGroupMembers}
                onChange={(e) => onMaxGroupMembersChange(parseInt(e.target.value) || 4)}
                className={inputCls} style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Member Limit */}
      <div className="space-y-2">
        <div>
          <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-0.5">Course Member Limit</h3>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">
            Set the maximum number of students that can join this course
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-gray-600 dark:text-gray-400" />
          <label className="text-xs font-medium text-gray-900 dark:text-gray-100">Maximum Course Members</label>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number" min="1" max="10000"
            value={maxCourseMembers}
            onChange={(e) => onMaxCourseMembersChange(parseInt(e.target.value) || 1400)}
            className="w-24 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={inputStyle}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">students</span>
        </div>
      </div>
    </>
  );
};

export default GroupSettings;