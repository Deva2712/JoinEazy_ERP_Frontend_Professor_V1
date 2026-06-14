
// LocalStorage helpers for announcements
const ANNOUNCEMENTS_STORAGE_KEY = "funkey_announcements";

export const loadAnnouncementsFromStorage = () => {
	try {
		const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading announcements from storage:", error);
		return null;
	}
};

export const saveAnnouncementsToStorage = (announcements) => {
	try {
		localStorage.setItem(
			ANNOUNCEMENTS_STORAGE_KEY,
			JSON.stringify(announcements),
		);
	} catch (error) {
		console.error("❌ Error saving announcements to storage:", error);
	}
};

// Default announcement template for all courses
export const createDefaultAnnouncement = (cohortId, courseName = "this course") => ({
	id: Date.now() + cohortId,
	title: "Welcome to the Course!",
	content: `Welcome to ${courseName}! This is your course announcement board. Your instructor will post important updates, assignment deadlines, exam schedules, and other course-related information here. Make sure to check regularly for new announcements.`,
	tags: ["General"],
	priority: null,
	is_pinned: true,
	is_archived: false,
	is_locked: false,
	expiry_date: null,
	author_name: "Course Instructor",
	author_id: 1,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	view_count: 0,
	replies_count: 0,
	replies: [],
});


/**
 * Main accessor for announcement data.
 * Initializes storage with an empty object if no data exists.
 */
export const getAnnouncementsFromStorage = () => {
	const stored = loadAnnouncementsFromStorage();
	if (stored) return stored;

	const initial = {};
	saveAnnouncementsToStorage(initial);
	return initial;
};

/**
 * Updates storage with a new announcement object.
 */
export const updateAnnouncementsInStorage = (announcements) => {
	saveAnnouncementsToStorage(announcements);
};