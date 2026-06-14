// src/pages/AttendanceManagement/utils/attendanceUtils.js

/**
 * Formats a date string into "Mon DD, YYYY" format.
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

/**
 * Returns tomorrow's date as a deadline string.
 * e.g. "May 15 at 11:59 PM"
 * @returns {string}
 */
export const getDeadlineString = () => {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	return (
		d.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
		" at 11:59 PM"
	);
};

/**
 * Returns today's date in "YYYY-MM-DD" (en-CA) format.
 * @returns {string}
 */
export const getTodayString = () => {
	return new Date().toLocaleDateString("en-CA");
};

/**
 * Encodes a string to Base64 using TextEncoder (supports Unicode).
 * Avoids using deprecated unescape/escape.
 * @param {string} str
 * @returns {string}
 */
export const encodeBase64 = (str) => {
	const bytes = new TextEncoder().encode(str);
	let binary = "";
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
};

/**
 * Saves an attendance draft to localStorage.
 * @param {string|number} courseId
 * @param {{ presentIds: string[], absentIds: string[] }} draft
 */
export const saveDraftToStorage = (courseId, draft) => {
	const expiryDate = new Date();
	expiryDate.setDate(expiryDate.getDate() + 2);
	localStorage.setItem(
		`attendance_draft_${courseId}`,
		JSON.stringify({ ...draft, expiresAt: expiryDate.toISOString() }),
	);
};

/**
 * Loads an attendance draft from localStorage.
 * @param {string|number} courseId
 * @returns {{ presentIds: string[], absentIds: string[] } | null}
 */
export const loadDraftFromStorage = (courseId) => {
	const saved = localStorage.getItem(`attendance_draft_${courseId}`);
	if (!saved) return null;
	try {
		return JSON.parse(saved);
	} catch {
		return null;
	}
};

/**
 * Removes an attendance draft from localStorage.
 * @param {string|number} courseId
 */
export const clearDraftFromStorage = (courseId) => {
	localStorage.removeItem(`attendance_draft_${courseId}`);
};