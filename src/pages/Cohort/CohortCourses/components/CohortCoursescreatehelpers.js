// ─── Helpers & Constants for CohortCoursesCreateUI ───────────────────────────

/**
 * Converts a byte count into a human-readable string (e.g. "1.23 MB").
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Default / initial shape of submissionData.
 * Use this when you call useState() in the parent.
 */
export const DEFAULT_SUBMISSION_DATA = {
  title: "",
  description: "",
  submissionType: "Individual", // "Individual" | "Group"
  deadline: "",
  attachments: [],
  isGraded: false,
  maxMarks: "",
  weightage: "",
};

/**
 * Accepted file types shown in the upload hint.
 */
export const ACCEPTED_FILE_HINT = "PDF, DOC, DOCX, Images up to 10MB";