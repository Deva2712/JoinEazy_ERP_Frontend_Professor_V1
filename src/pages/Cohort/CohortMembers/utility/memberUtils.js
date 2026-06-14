export const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";
  const emailPrefix = email.split("@")[0];
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)) return emailPrefix.toUpperCase();
  if (emailPrefix.toLowerCase().includes("new") || emailPrefix.toLowerCase().includes("user"))
    return emailPrefix.toUpperCase();
  return emailPrefix.toUpperCase();
};

export const getMemberDisplayName = (member) => {
  const displayName = (
    member?.display_name || member?.username || member?.name || member?.email || ""
  ).toString();
  const email = member?.email || "";
  if (
    displayName.toLowerCase().includes("new user") ||
    displayName.toLowerCase().includes("newuser")
  )
    return getRollNumberFromEmail(email);
  if (displayName && displayName.trim() !== "") return displayName;
  return getRollNumberFromEmail(email);
};

export const getBorderColor = (assignment, grade) => {
  const hasScore = grade && grade.score !== null && grade.score !== undefined;
  if (hasScore) return grade.wasLate ? "red" : "green";
  if (assignment.deadline && new Date() > new Date(assignment.deadline)) return "red";
  return grade?.isSubmitted ? "green" : "yellow";
};

export const getScoreColorClasses = (borderColor) => {
  const colors = {
    green: "border-green-500 dark:border-green-500 bg-green-50 dark:bg-gray-700 text-green-700 dark:text-gray-300",
    yellow: "border-yellow-500 dark:border-yellow-500 bg-yellow-50 dark:bg-gray-700 text-yellow-700 dark:text-gray-400",
    red: "border-red-500 dark:border-red-500 bg-red-50 dark:bg-gray-700 text-red-700 dark:text-gray-300",
    gray: "border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400",
  };
  return colors[borderColor] || colors.gray;
};

export const getAssignmentHoverMessage = (assignment, grade, isGroupAssignment = false, membersGradedIndividually = false) => {
  const assignmentName = assignment.title || assignment.name;
  const assignmentType = isGroupAssignment ? " (Group Assignment)" : " (Individual Assignment)";
  const maxMarks = assignment.marks;

  const deadlineText = assignment.deadline
    ? (() => {
        const d = new Date(assignment.deadline);
        const isOverdue = new Date() > d;
        return `\nDeadline: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${isOverdue ? " (Overdue)" : ""}`;
      })()
    : "";

  if (membersGradedIndividually)
    return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}\nMembers graded individually\nClick "See More" to view individual grades`;

  const hasScore = grade && grade.score !== null && grade.score !== undefined;
  const isSubmitted = grade?.isSubmitted || false;
  const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);

  const submittedDate = grade?.submittedAt
    ? `\nSubmitted: ${new Date(grade.submittedAt).toLocaleDateString()} ${new Date(grade.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "";

  if (!hasScore) {
    if (isLate) {
      return isSubmitted
        ? `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}${submittedDate}\nStatus: Submitted (Late)\nClick to grade`
        : `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}\nStatus: Not Submitted (Overdue)\nClick to grade`;
    }
    if (!isSubmitted)
      return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}\nStatus: Not Submitted\n⚠️ Grading disabled until submission is done`;
    return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}${submittedDate}\nStatus: Submitted\nClick to grade`;
  }

  const lateStatus = grade.wasLate ? " (Graded after deadline)" : " (Graded on time)";
  return `${assignmentName}${assignmentType}\nScore: ${grade.score}/${maxMarks}${lateStatus}${submittedDate}\nClick to edit grade`;
};