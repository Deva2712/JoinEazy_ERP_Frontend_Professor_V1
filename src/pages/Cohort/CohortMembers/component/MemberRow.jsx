import React from "react";
import { Users, Check, X } from "lucide-react";
import {
  getMemberDisplayName,
  getBorderColor,
  getScoreColorClasses,
  getAssignmentHoverMessage,
} from "../utility/memberUtils";

const ScoreBox = ({
  assignment,
  grade,
  isClickable,
  isEditing,
  editValue,
  onEditChange,
  onEditKeyDown,
  onEditBlur,
  onClick,
  onLongPress,
  user_type,
  hasGrade,
  score,
  borderColor,
}) => {
  const longPressHandlers = (callback) => ({
    onTouchStart: (e) => { e.currentTarget.longPressTimer = setTimeout(callback, 500); },
    onTouchEnd: (e) => { clearTimeout(e.currentTarget.longPressTimer); },
    onTouchMove: (e) => { clearTimeout(e.currentTarget.longPressTimer); },
  });

  if (isEditing) {
    return (
      <input
        key={assignment.id}
        type="number"
        value={editValue}
        onChange={onEditChange}
        onKeyDown={onEditKeyDown}
        onBlur={onEditBlur}
        placeholder="0"
        min="0"
        max={assignment.marks}
        autoFocus
        className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg text-center font-semibold text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${getScoreColorClasses(borderColor)} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
      />
    );
  }

  if (user_type !== 1) {
    const isSubmitted = grade?.isSubmitted || false;
    const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
    const boxColor = isSubmitted
      ? "bg-[#03ac13] border-[#03ac13]"
      : isLate
      ? "bg-red-800 border-red-800"
      : "bg-[#FFB100] border-[#FFB100]";
    const icon = isSubmitted
      ? <Check size={16} className="text-white" strokeWidth={3} />
      : isLate
      ? <X size={16} className="text-white" strokeWidth={3} />
      : <span className="text-white font-bold text-base">-</span>;

    return (
      <div
        key={assignment.id}
        className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 flex items-center justify-center ${boxColor}`}
        {...longPressHandlers(onLongPress)}
        title={getAssignmentHoverMessage(assignment, grade)}
      >
        {hasGrade ? <span className="text-gray-900 dark:text-gray-100">{score}</span> : icon}
      </div>
    );
  }

  const sharedClass = `flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg flex items-center justify-center font-bold text-sm ${getScoreColorClasses(borderColor)}`;

  return isClickable ? (
    <button
      key={assignment.id}
      onClick={onClick}
      {...longPressHandlers(onLongPress)}
      style={{ touchAction: "manipulation" }}
      className={`${sharedClass} transition-all hover:scale-105`}
      title={getAssignmentHoverMessage(assignment, grade)}
    >
      {hasGrade ? score : "-"}
    </button>
  ) : (
    <div
      key={assignment.id}
      className={`${sharedClass} cursor-not-allowed opacity-75`}
      title={getAssignmentHoverMessage(assignment, grade)}
    >
      -
    </div>
  );
};

const MemberRow = ({
  member,
  user_type,
  currentUserId,
  memberType,
  assignments,
  grades,
  editingIndividualGrade,
  individualGradeValue,
  setIndividualGradeValue,
  setEditingIndividualGrade,
  editingGroupGrade,
  groupGradeValue,
  setGroupGradeValue,
  setEditingGroupGrade,
  bulkGradeGroups,
  selectedAssignmentId,
  onGradeSubmit,
  onMemberDetails,
  onGroupNameClick,
  onRemove,
  setAssignmentInfoData,
  setShowAssignmentInfoModal,
}) => {
  const isCurrentUser = member.type === "individual" && member.realUserId === currentUserId;
  const isCurrentUserGroup = member.type === "group" && member.isCurrentUserGroup;
  const shouldHighlight = isCurrentUser || isCurrentUserGroup;

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (!a.created_at) return 1;
    if (!b.created_at) return -1;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  const renderIndividualScores = () => {
    if (assignments.length === 0)
      return <div className="text-xs text-gray-500 dark:text-gray-400 italic">No assignments yet</div>;

    return sortedAssignments.map((assignment) => {
      const gradeKey = `${member.realUserId}_${assignment.id}`;
      const grade = grades[gradeKey];
      const score = grade?.score;
      const borderColor = getBorderColor(assignment, grade);
      const isGroupAssignment = assignment.type === "group";
      const hasGrade = score !== null && score !== undefined;
      const isSubmitted = grade?.isSubmitted || false;
      const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
      const isClickable = (!isGroupAssignment && (isSubmitted || isLate || hasGrade)) || (isGroupAssignment && hasGrade);
      const isEditing =
        editingIndividualGrade?.userId === member.realUserId &&
        editingIndividualGrade?.assignmentId === assignment.id;

      return (
        <ScoreBox
          key={assignment.id}
          assignment={assignment}
          grade={grade}
          isClickable={isClickable}
          isEditing={isEditing}
          editValue={individualGradeValue}
          borderColor={borderColor}
          hasGrade={hasGrade}
          score={score}
          user_type={user_type}
          onEditChange={(e) => setIndividualGradeValue(e.target.value)}
          onEditKeyDown={async (e) => {
            if (e.key === "Enter") {
              if (!individualGradeValue) { setEditingIndividualGrade(null); setIndividualGradeValue(""); return; }
              const s = parseInt(individualGradeValue);
              if (isNaN(s) || s < 0 || s > parseInt(assignment.marks)) { alert(`Score must be between 0 and ${assignment.marks}`); return; }
              await onGradeSubmit(member, assignment, s, "", isGroupAssignment && member.isInGroup);
              setEditingIndividualGrade(null); setIndividualGradeValue("");
            } else if (e.key === "Escape") { setEditingIndividualGrade(null); setIndividualGradeValue(""); }
          }}
          onEditBlur={async () => {
            if (!individualGradeValue) { setEditingIndividualGrade(null); setIndividualGradeValue(""); return; }
            const s = parseInt(individualGradeValue);
            if (isNaN(s) || s < 0 || s > parseInt(assignment.marks)) { setEditingIndividualGrade(null); setIndividualGradeValue(""); return; }
            await onGradeSubmit(member, assignment, s, "", isGroupAssignment && member.isInGroup);
            setEditingIndividualGrade(null); setIndividualGradeValue("");
          }}
          onClick={() => {
            setEditingIndividualGrade({ userId: member.realUserId, assignmentId: assignment.id });
            setIndividualGradeValue(hasGrade ? score.toString() : "");
          }}
          onLongPress={() => {
            setAssignmentInfoData({ assignment, grade, isGroupAssignment, membersGradedIndividually: false });
            setShowAssignmentInfoModal(true);
          }}
        />
      );
    });
  };

  const renderGroupScores = () => {
    const filteredAssignments = sortedAssignments.filter(
      (a) => a.type === "group" && (selectedAssignmentId === "all" || a.id === selectedAssignmentId)
    );

    return filteredAssignments.map((assignment) => {
      const isGroupAssignment = assignment.type === "group";
      let displayScore = null;
      let hasGrades = false;

      if (member.groupMembers?.length > 0) {
        const memberScores = member.groupMembers
          .map((gm) => grades[`${gm.user_id}_${assignment.id}`]?.score)
          .filter((s) => s !== null && s !== undefined);
        if (memberScores.length > 0) {
          hasGrades = true;
          const allSame = memberScores.every((s) => s === memberScores[0]);
          displayScore =
            allSame && memberScores.length === member.groupMembers.length
              ? memberScores[0]
              : Math.round(memberScores.reduce((a, b) => a + b, 0) / memberScores.length);
        }
      }

      const firstMemberGrade = member.groupMembers?.[0]
        ? grades[`${member.groupMembers[0].user_id}_${assignment.id}`]
        : null;
      const borderColor = getBorderColor(assignment, firstMemberGrade);
      const isSubmitted = firstMemberGrade?.isSubmitted || false;
      const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
      const isClickable = isGroupAssignment && (hasGrades || isSubmitted || isLate) && bulkGradeGroups;
      const isEditing =
        editingGroupGrade?.groupId === member.id && editingGroupGrade?.assignmentId === assignment.id;
      const membersGradedIndividually =
        isGroupAssignment &&
        member.groupMembers?.length > 0 &&
        !hasGrades &&
        member.groupMembers.some((gm) => {
          const g = grades[`${gm.user_id}_${assignment.id}`];
          return g?.score !== null && g?.score !== undefined;
        });

      const getRepMember = () =>
        member.groupMembers?.[0]
          ? { id: member.groupMembers[0].user_id, display_name: member.groupName, email: member.groupMembers[0].email, groupId: member.id, groupMembers: member.groupMembers }
          : null;

      return (
        <ScoreBox
          key={assignment.id}
          assignment={assignment}
          grade={firstMemberGrade}
          isClickable={isClickable}
          isEditing={isEditing}
          editValue={groupGradeValue}
          borderColor={borderColor}
          hasGrade={hasGrades}
          score={displayScore}
          user_type={user_type}
          onEditChange={(e) => setGroupGradeValue(e.target.value)}
          onEditKeyDown={async (e) => {
            if (e.key === "Enter") {
              if (!groupGradeValue) { setEditingGroupGrade(null); setGroupGradeValue(""); return; }
              const s = parseInt(groupGradeValue);
              if (isNaN(s) || s < 0 || s > parseInt(assignment.marks)) { alert(`Score must be between 0 and ${assignment.marks}`); return; }
              const rep = getRepMember();
              if (rep) await onGradeSubmit(rep, assignment, s, "", bulkGradeGroups);
              setEditingGroupGrade(null); setGroupGradeValue("");
            } else if (e.key === "Escape") { setEditingGroupGrade(null); setGroupGradeValue(""); }
          }}
          onEditBlur={async () => {
            if (!groupGradeValue) { setEditingGroupGrade(null); setGroupGradeValue(""); return; }
            const s = parseInt(groupGradeValue);
            if (isNaN(s) || s < 0 || s > parseInt(assignment.marks)) { setEditingGroupGrade(null); setGroupGradeValue(""); return; }
            const rep = getRepMember();
            if (rep) await onGradeSubmit(rep, assignment, s, "", bulkGradeGroups);
            setEditingGroupGrade(null); setGroupGradeValue("");
          }}
          onClick={() => {
            setEditingGroupGrade({ groupId: member.id, assignmentId: assignment.id });
            setGroupGradeValue(hasGrades ? displayScore.toString() : "");
          }}
          onLongPress={() => {
            setAssignmentInfoData({ assignment, grade: firstMemberGrade, isGroupAssignment: true, membersGradedIndividually });
            setShowAssignmentInfoModal(true);
          }}
        />
      );
    });
  };

  const showIndividualScores =
    (user_type === 1 && member.type === "individual") ||
    (user_type !== 1 && member.type === "individual" && member.realUserId === currentUserId);

  const showGroupScores =
    (user_type === 1 && memberType === "Groups" && member.type === "group") ||
    (user_type !== 1 && memberType === "Groups" && member.type === "group" && member.groupMembers?.some((gm) => gm.user_id === currentUserId));

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3 transition-all border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
        shouldHighlight
          ? "bg-blue-50 dark:bg-blue-900/10 border-l-2 border-l-blue-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      {/* Name + Info */}
      <div className="flex items-start justify-between gap-3 w-full sm:w-auto sm:min-w-[200px] sm:items-center">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {memberType === "Groups" && (
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Users size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          )}
          <div className="flex-grow min-w-0">
            <h4 className={`font-medium text-sm line-clamp-1 ${shouldHighlight ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"}`}>
              {getMemberDisplayName(member)}
              {user_type !== 1 && isCurrentUser && (
                <span className="ml-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">You</span>
              )}
              {user_type !== 1 && isCurrentUserGroup && (
                <span className="ml-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">Your Group</span>
              )}
              {user_type === 1 && member.type === "individual" && member.isInGroup && member.groupName && (
                <span
                  className="ml-2 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  onClick={(e) => { e.stopPropagation(); onGroupNameClick?.(member.groupId); }}
                >
                  {member.groupName}
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {member.type === "individual"
                ? member.email || "No email"
                : `${member.memberCount || 0}/${member.maxMembers || 4} members`}
            </p>
          </div>
        </div>

        {/* Mobile See More button */}
        {memberType === "Groups" && member.type === "group" && (
          <button
            onClick={(e) => { e.stopPropagation(); onMemberDetails(member.id); }}
            className="sm:hidden px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all whitespace-nowrap flex-shrink-0"
          >
            See More
          </button>
        )}
      </div>

      {/* Score Boxes */}
      {showIndividualScores && (
        <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap flex-1 justify-start sm:justify-center w-full sm:w-auto overflow-x-auto pb-1">
          {renderIndividualScores()}
        </div>
      )}

      {memberType === "Groups" && <div className="flex-1" />}

      {showGroupScores && assignments.length > 0 && (
        <div className="flex gap-2 flex-wrap sm:flex-nowrap flex-1 justify-start w-full sm:w-auto overflow-x-auto pb-1">
          {renderGroupScores()}
        </div>
      )}

      {/* Desktop See More + count */}
      {memberType === "Groups" && member.type === "group" && (
        <div className="hidden sm:flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-auto">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {member.memberCount || 0}/{member.maxMembers || 4}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onMemberDetails(member.id); }}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all hover:shadow-md whitespace-nowrap"
          >
            See More
          </button>
        </div>
      )}

      {/* Total score + Remove */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
        {user_type === 1 && member.type === "individual" && assignments.length > 0 && (() => {
          let totalScore = 0;
          let totalMaxScore = 0;
          let gradedCount = 0;
          assignments.forEach((a) => {
            totalMaxScore += parseInt(a.marks) || 0;
            const g = grades[`${member.realUserId}_${a.id}`];
            if (g?.score !== null && g?.score !== undefined) { totalScore += parseInt(g.score) || 0; gradedCount++; }
          });
          return (
            <div
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg border-2 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 min-w-[70px] sm:min-w-[100px] text-center"
              title={`Total earned: ${totalScore} out of ${totalMaxScore} (${gradedCount}/${assignments.length} graded)`}
            >
              Total: {totalScore}
            </div>
          );
        })()}

        {user_type === 1 && member.type === "individual" && (
          <button
            onClick={() => onRemove?.(member.realUserId)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all hover:shadow-md whitespace-nowrap"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberRow;