// src/utils/groupUtils.js

// ── Name helpers ──────────────────────────────────────────────────

export const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";
  const prefix = email.split("@")[0];
  return prefix.toUpperCase();
};

export const getMemberDisplayName = (member) => {
  const displayName = (member?.display_name || member?.username || member?.email || "").toString();
  const email = member?.email || "";

  if (
    !displayName.trim() ||
    displayName.toLowerCase().includes("new user") ||
    displayName.toLowerCase().includes("newuser")
  ) {
    return getRollNumberFromEmail(email);
  }

  return displayName;
};

export const getMemberInitial = (member) =>
  getMemberDisplayName(member).charAt(0).toUpperCase();

// ── Status helpers ────────────────────────────────────────────────

const isDeadlinePassed = (assignment) =>
  assignment.deadline && new Date() > new Date(assignment.deadline);

const hasScore = (grade) =>
  grade && grade.score !== null && grade.score !== undefined;

// FIX: check isSubmitted BEFORE isLate so late+submitted → green, not red
export const getBorderColor = (assignment, grade) => {
  if (hasScore(grade)) return grade.wasLate ? "red" : "green";

  const isSubmitted = grade?.isSubmitted || false;
  if (isSubmitted) return isDeadlinePassed(assignment) ? "red" : "green";

  if (isDeadlinePassed(assignment)) return "red";

  return "yellow";
};

// ── Style helpers ─────────────────────────────────────────────────

export const getScoreColorClasses = (borderColor, userType) => {
  const professorColors = {
    green:  "border-2 border-green-500 dark:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
    yellow: "border-2 border-yellow-500 dark:border-yellow-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
    red:    "border-2 border-red-500 dark:border-red-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
    gray:   "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  };

  const studentColors = {
    green:  "bg-[#03ac13] border-[#03ac13] text-white border-0",
    yellow: "bg-[#FFB100] border-[#FFB100] text-white border-0",
    red:    "bg-red-800 border-red-800 text-white border-0",
    gray:   "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-0",
  };

  const map = userType === 1 ? professorColors : studentColors;
  return map[borderColor] || map.gray;
};

// FIX: return icon name string instead of JSX — render in component
// Use: if (icon === "check") → <Check />, if (icon === "x") → <X />, etc.
export const getIconForStatus = (borderColor, hasGrade) => {
  if (hasGrade) return null;
  if (borderColor === "green")  return "check";
  if (borderColor === "red")    return "x";
  if (borderColor === "yellow") return "minus";
  return null;
};

// ── Tooltip helpers ───────────────────────────────────────────────

const fmtDate = (date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

const getDeadlineText = (assignment) => {
  if (!assignment.deadline) return "";
  const deadline = new Date(assignment.deadline);
  const overdue = new Date() > deadline ? " (Overdue)" : "";
  return `\nDeadline: ${fmtDate(deadline)}${overdue}`;
};

const getSubmittedAtText = (grade) => {
  if (!grade?.submittedAt) return "";
  return `\nSubmitted: ${fmtDate(new Date(grade.submittedAt))}`;
};

export const getAssignmentHoverMessage = (assignment, grade) => {
  const name     = assignment.title || assignment.name;
  const maxMarks = assignment.marks;
  const deadline = getDeadlineText(assignment);
  const graded   = hasScore(grade);
  const late     = isDeadlinePassed(assignment);
  const submitted = grade?.isSubmitted || false;

  // Graded
  if (graded) {
    const lateStatus  = grade.wasLate ? " (Graded after deadline)" : " (Graded on time)";
    const feedbackText = grade.feedback ? `\nFeedback: ${grade.feedback}` : "";
    return `${name}${deadline}\nScore: ${grade.score}/${maxMarks}${lateStatus}${feedbackText}\nClick to edit grade`;
  }

  // Not graded — late
  if (late) {
    const status = submitted ? "Late Submission - Ready to grade" : "Deadline Passed - Ready to grade";
    return `${name}${deadline}${getSubmittedAtText(grade)}\nStatus: ${status}\nClick to grade`;
  }

  // Not graded — not submitted
  if (!submitted) {
    return `${name}${deadline}\nStatus: Not Submitted\n⚠️ Grading disabled until submission`;
  }

  // Not graded — submitted on time
  const submittedText = grade?.submittedAt
    ? `Submitted on ${fmtDate(new Date(grade.submittedAt))}`
    : "Submitted on time";
  return `${name}${deadline}\nStatus: ${submittedText}\nClick to grade`;
};

export const getStudentTooltip = (assignment, grade) => {
  const name = assignment.title || assignment.name;
  if (grade?.isSubmitted)          return `${name} - Submitted`;
  if (isDeadlinePassed(assignment)) return `${name} - Overdue`;
  return `${name} - Pending`;
};