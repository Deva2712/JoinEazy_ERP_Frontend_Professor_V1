// src/utils/dashboardHelpers.js

const TITLE_PREFIXES = ["Dr.", "Prof.", "Mr.", "Mrs.", "Ms."];

/**
 * "Dr. Priya Sharma" → "Dr. Priya"
 * "Rahul Verma"      → "Rahul"
 */
export function getGreetingName(fullName) {
  const parts = fullName.split(" ");
  const count = TITLE_PREFIXES.includes(parts[0]) ? 2 : 1;
  return parts.slice(0, count).join(" ");
}

/**
 * Returns academic year string like "2024 – 2025".
 * July onwards = current/next, else previous/current.
 */
export function resolveAcademicYear(academicYear) {
  if (academicYear) return academicYear;
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  return m >= 6 ? `${y} – ${y + 1}` : `${y - 1} – ${y}`;
}