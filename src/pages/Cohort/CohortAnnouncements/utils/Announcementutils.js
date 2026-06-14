// announcementUtils.js
// Pure helper functions — no React, no state, no side effects.

/**
 * Returns a Tailwind class string for a given announcement tag.
 */
export function getTagColor(tag) {
  const colors = {
    Exam: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Assignment: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Urgent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    General: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    Important: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  };
  return colors[tag] ?? colors.General;
}

/**
 * Returns badge config (className + label) for a priority level, or null if none.
 */
export function getPriorityConfig(priority) {
  if (!priority) return null;
  const colors = {
    Critical: 'bg-red-500 text-white',
    Important: 'bg-orange-500 text-white',
  };
  return colors[priority] ? { className: colors[priority], label: priority } : null;
}

/**
 * Formats a date string into a short human-readable label.
 * e.g. "May 14, 2026"
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date into a short month+day label (no year).
 * e.g. "May 14"
 */
export function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns true if an expiry date is in the future.
 */
export function isExpiryUpcoming(expiryDate) {
  return expiryDate && new Date(expiryDate) > new Date();
}

/**
 * Returns filtered + sorted announcements given the full list and current filter state.
 *
 * @param {Array}  announcements
 * @param {'all'|'active'|'pinned'|'archived'} filter
 * @param {string} tagFilter  - 'all' or a specific tag name
 */
export function filterAndSortAnnouncements(announcements, filter, tagFilter) {
  const filtered = announcements.filter((a) => {
    if (filter === 'all' && a.is_archived) return false;
    if (filter === 'active' && (a.is_archived || a.is_pinned)) return false;
    if (filter === 'pinned' && (!a.is_pinned || a.is_archived)) return false;
    if (filter === 'archived' && !a.is_archived) return false;
    if (tagFilter !== 'all' && !a.tags?.includes(tagFilter)) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

/**
 * Returns filtered discussions given the full list and current filter state.
 *
 * @param {Array}  discussions
 * @param {'all'|'active'|'pinned'|'archived'} filter
 * @param {string} tagFilter
 */
export function filterDiscussions(discussions, filter, tagFilter) {
  if (!discussions) return [];
  if (tagFilter !== 'all' && tagFilter !== 'Discussion') return [];

  return discussions.filter((d) => {
    if (filter === 'pinned') return false; // discussions can't be pinned
    if (filter === 'archived') return d.is_archived;
    return !d.is_archived; // 'all' and 'active' both hide archived
  });
}

/**
 * Pluralises "reply" / "replies" based on count.
 */
export function replyLabel(count) {
  return `${count ?? 0} ${(count ?? 0) <= 1 ? 'reply' : 'replies'}`;
}

/**
 * Returns filtered + sorted announcements for the STUDENT view.
 * Students only have 'active' and 'archived' filters (no 'pinned' sub-filter).
 *
 * @param {Array}  announcements
 * @param {'active'|'archived'} filter
 * @param {string} tagFilter
 */
export function filterAndSortAnnouncementsStudent(announcements, filter, tagFilter) {
  const filtered = announcements.filter((a) => {
    if (filter === 'active' && a.is_archived) return false;
    if (filter === 'archived' && !a.is_archived) return false;
    if (tagFilter !== 'all' && !a.tags?.includes(tagFilter)) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

/**
 * Returns filtered discussions for the STUDENT view.
 * Same shape as professor version but uses 'active'/'archived' only.
 *
 * @param {Array}  discussions
 * @param {'active'|'archived'} filter
 * @param {string} tagFilter
 */
export function filterDiscussionsStudent(discussions, filter, tagFilter) {
  if (!discussions) return [];
  if (tagFilter !== 'all' && tagFilter !== 'Discussion') return [];

  return discussions.filter((d) => {
    if (filter === 'archived') return d.is_archived;
    return !d.is_archived; // 'active'
  });
}

/**
 * Returns a Tailwind badge class string for a user role.
 * Used by student UI where professor / student role labels appear.
 */
export function getRoleBadgeClass(role) {
  const map = {
    professor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    student:   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };
  return map[role] ?? null;
}

/**
 * Human-readable label for a role.
 */
export function getRoleLabel(role) {
  const map = { professor: 'Professor', student: 'Student' };
  return map[role] ?? null;
}