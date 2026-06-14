// src/pages/AssetRequest/utils/assetRequestUtils.js

/**
 * Formats a date string into "Mon DD, YYYY" format.
 * @param {string} date
 * @returns {string}
 */
export const formatDate = (date) =>
	new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

/**
 * Formats a datetime string into "HH:MM AM/PM" format.
 * @param {string} date
 * @returns {string}
 */
export const formatTime = (date) =>
	new Date(date).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

/**
 * Converts a raw integer duration (total days) into a human-readable string.
 * e.g. 400 → "1y 1m 5d"
 * @param {string|number} durationStr
 * @returns {string}
 */
export const formatReadableDuration = (durationStr) => {
	if (!durationStr) return durationStr;
	const totalDays = parseInt(durationStr) || 0;

	const y = Math.floor(totalDays / 365);
	const m = Math.floor((totalDays % 365) / 30);
	const w = Math.floor(((totalDays % 365) % 30) / 7);
	const d = Math.floor(((totalDays % 365) % 30) % 7);

	const parts = [];
	if (y > 0) parts.push(`${y}y`);
	if (m > 0) parts.push(`${m}m`);
	if (w > 0) parts.push(`${w}w`);
	if (d > 0) parts.push(`${d}d`);

	return parts.length > 0 ? parts.join(" ") : "0d";
};

/**
 * Checks whether a request has expired based on its type, date, and time fields.
 * @param {Object} req
 * @returns {boolean}
 */
export const isRequestExpired = (req) => {
	const now = new Date();

	if (req.type === "Accommodation" && req.duration) {
		const expiryDate = new Date(req.date);
		expiryDate.setDate(expiryDate.getDate() + (parseInt(req.duration) || 0));
		return expiryDate < now;
	}

	if (req.date && req.endTime) {
		return new Date(`${req.date}T${req.endTime}:00`) < now;
	}

	if (req.date) {
		return new Date(req.date) < now;
	}

	return false;
};

/**
 * Splits requests into "active" and "history" buckets, then sorts active
 * so that action-required (rejected + not archived) cards appear first.
 *
 * @param {Array} requests
 * @returns {{ active: Array, history: Array }}
 */
export const categorizeRequests = (requests) => {
	const active = [];
	const history = [];

	requests.forEach((req) => {
		const isRejected = req.status === "Rejected";
		const expired = isRequestExpired(req);

		if (
			req.status === "Closed" ||
			(isRejected && req.isArchived) ||
			(req.status === "Approved" && expired)
		) {
			history.push(req);
		} else {
			active.push(req);
		}
	});

	// Action-required cards float to the top; rest sorted newest-first
	const sortedActive = [...active].sort((a, b) => {
		const aNeedsAction = a.status === "Rejected" && !a.isArchived;
		const bNeedsAction = b.status === "Rejected" && !b.isArchived;
		if (aNeedsAction && !bNeedsAction) return -1;
		if (!aNeedsAction && bNeedsAction) return 1;
		return new Date(b.postedAt) - new Date(a.postedAt);
	});

	return { active: sortedActive, history };
};