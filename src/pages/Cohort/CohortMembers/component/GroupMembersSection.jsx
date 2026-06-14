// components/GroupMembersSection.jsx

import React from "react";
import {
  Users,
  Crown,
  UserX,
  Check,
  X,
} from "lucide-react";

// ================= Helpers =================

const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";

  const emailPrefix = email.split("@")[0];

  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)) {
    return emailPrefix.toUpperCase();
  }

  if (
    emailPrefix.toLowerCase().includes("new") ||
    emailPrefix.toLowerCase().includes("user")
  ) {
    return emailPrefix.toUpperCase();
  }

  return emailPrefix.toUpperCase();
};

const getMemberDisplayName = (member) => {
  const displayName = (
    member?.display_name ||
    member?.username ||
    member?.email ||
    ""
  ).toString();

  const email = member?.email || "";

  if (
    displayName.toLowerCase().includes("new user") ||
    displayName.toLowerCase().includes("newuser")
  ) {
    return getRollNumberFromEmail(email);
  }

  if (displayName && displayName.trim() !== "") {
    return displayName;
  }

  return getRollNumberFromEmail(email);
};

const getMemberInitial = (member) => {
  return getMemberDisplayName(member).charAt(0).toUpperCase();
};

const getBorderColor = (assignment, grade) => {
  const hasScore =
    grade && grade.score !== null && grade.score !== undefined;

  if (hasScore) {
    if (grade.wasLate) return "red";
    return "green";
  }

  const isLate =
    assignment.deadline &&
    new Date() > new Date(assignment.deadline);

  if (isLate) return "red";

  const isSubmitted = grade?.isSubmitted || false;

  if (isSubmitted) return "green";

  return "yellow";
};

const getScoreColorClasses = (borderColor, userType) => {
  if (userType === 1) {
    const colors = {
      green:
        "border-2 border-green-500 dark:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
      yellow:
        "border-2 border-yellow-500 dark:border-yellow-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
      red:
        "border-2 border-red-500 dark:border-red-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
      gray:
        "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    };

    return colors[borderColor] || colors.gray;
  }

  const colors = {
    green: "bg-[#03ac13] border-[#03ac13] text-white border-0",
    yellow: "bg-[#FFB100] border-[#FFB100] text-white border-0",
    red: "bg-red-800 border-red-800 text-white border-0",
    gray:
      "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-0",
  };

  return colors[borderColor] || colors.gray;
};

const getIconForStatus = (borderColor, hasGrade) => {
  if (hasGrade) return null;

  if (borderColor === "green") {
    return <Check size={18} className="text-white" strokeWidth={3} />;
  }

  if (borderColor === "red") {
    return <X size={18} className="text-white" strokeWidth={3} />;
  }

  if (borderColor === "yellow") {
    return <span className="text-white font-bold text-xl">−</span>;
  }

  return null;
};

// ================= Component =================

const GroupMembersSection = ({
  groupData,
  assignments = [],
  grades = {},
  userType,
  editingGrade,
  gradeFormData,
  setGradeFormData,
  handleGradeClick,
  handleGradeSubmitInline,
  handleGradeCancel,
  handleRemoveMember,
  getAssignmentHoverMessage,
}) => {
  const groupAssignments = assignments
    .filter((a) => a.type === "group")
    .sort(
      (a, b) =>
        new Date(a.created_at || a.createdAt || 0) -
        new Date(b.created_at || b.createdAt || 0)
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />

          <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            Group Members
          </h4>

          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
            {groupData?.members?.length || 0}
          </span>
        </div>
      </div>

      {/* Members */}
      <div className="p-3 sm:p-4">
        {groupData?.members?.length > 0 ? (
          <div className="space-y-2">
            {groupData.members.map((member, index) => (
              <div
                key={member.user?.user_id || index}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3">
                  {/* Left Side */}
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {getMemberInitial(member.user)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {getMemberDisplayName(member.user)}
                        </h5>

                        {member.is_admin && (
                          <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                            <Crown className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">
                              Leader
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {member.user?.email}
                      </p>

                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Joined{" "}
                        {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Assignments */}
                  {groupAssignments.length > 0 && (
                    <div className="flex items-center gap-2 ml-9 sm:ml-4">
                      {groupAssignments.map((assignment) => {
                        const gradeKey = `${member.user?.user_id}_${assignment.id}`;

                        const grade = grades[gradeKey];

                        const score = grade?.score;

                        const borderColor = getBorderColor(
                          assignment,
                          grade
                        );

                        const hasGrade =
                          score !== null && score !== undefined;

                        const isEditing =
                          editingGrade?.userId ===
                            member.user?.user_id &&
                          editingGrade?.assignmentId ===
                            assignment.id;

                        const isDisabled =
                          borderColor === "yellow";

                        const canGrade =
                          userType === 1 && !isDisabled;

                        if (isEditing) {
                          return (
                            <input
                              key={assignment.id}
                              type="number"
                              value={gradeFormData.score}
                              onChange={(e) =>
                                setGradeFormData({
                                  ...gradeFormData,
                                  score: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleGradeSubmitInline(
                                    member,
                                    assignment,
                                    e
                                  );
                                } else if (
                                  e.key === "Escape"
                                ) {
                                  handleGradeCancel();
                                }
                              }}
                              onBlur={() =>
                                handleGradeSubmitInline(
                                  member,
                                  assignment
                                )
                              }
                              placeholder="0"
                              className={`flex-shrink-0 w-10 h-10 rounded-lg text-center font-semibold text-sm ${getScoreColorClasses(
                                borderColor,
                                userType
                              )} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                              min="0"
                              max={assignment.marks}
                              autoFocus
                            />
                          );
                        }

                        return (
                          <div
                            key={assignment.id}
                            onClick={() =>
                              canGrade &&
                              handleGradeClick(
                                member,
                                assignment,
                                grade
                              )
                            }
                            title={getAssignmentHoverMessage(
                              assignment,
                              grade
                            )}
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${getScoreColorClasses(
                              borderColor,
                              userType
                            )} ${
                              canGrade
                                ? "cursor-pointer hover:scale-105 transition-transform"
                                : "cursor-not-allowed"
                            }`}
                          >
                            {hasGrade
                              ? score
                              : userType === 1
                              ? "-"
                              : getIconForStatus(
                                  borderColor,
                                  hasGrade
                                )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Remove Button */}
                  {userType === 1 && (
                    <button
                      onClick={() =>
                        handleRemoveMember(
                          member.user?.user_id
                        )
                      }
                      className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors flex-shrink-0"
                      title="Remove Member"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />

            <h5 className="text-base font-medium text-gray-900 dark:text-white mb-1">
              No Members Yet
            </h5>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start by adding members to your group
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMembersSection;