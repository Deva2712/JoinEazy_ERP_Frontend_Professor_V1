// ─── Helpers & Transformers for DetailsController ────────────────────────────

/**
 * Parses a raw date string/value and returns a formatted "M/D/YYYY" string.
 * Returns "Unknown" if the value is missing or invalid.
 * @param {string|number|undefined} raw
 * @returns {string}
 */
export const formatCreatedDate = (raw) => {
  if (!raw) return "Unknown";
  try {
    const date = new Date(raw);
    if (isNaN(date)) return "Unknown";
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

/**
 * Builds the quickDetails array from raw API data.
 * Optionally appends a "Share this Page" entry for professors.
 * @param {object} data        - Raw API response data
 * @param {boolean} isProfessor
 * @returns {Array}
 */
export const buildQuickDetails = (data, isProfessor) => {
  const createdRaw =
    data.created_at || data.createdAt || data.created_on || data.createdDate;

  const memberCount = Number(
    data.member_count ?? data.memberCount ?? data.participant_count ?? 0
  );

  const organizationName =
    data.organization_name || data.organizationName || "Mahindra University";

  const details = [
    { id: 1, icon: "Calendar",  text: `Created: ${formatCreatedDate(createdRaw)}` },
    { id: 2, icon: "Building2", text: `Organization: ${organizationName}` },
    { id: 3, icon: "Users",     text: `Total Members: ${memberCount}` },
    { id: 4, icon: "Badge",     text: `Status: ${data.visibility || data.status || "Active"}` },
  ];

  if (isProfessor) {
    details.push({ id: 7, icon: "Share2", text: "Share this Page", isShareable: true });
  }

  return details;
};

/**
 * Transforms raw API data into the shape expected by DetailsUI.
 * @param {object} data        - Raw API response data
 * @param {boolean} isProfessor
 * @returns {{ containers: Array, quickDetails: Array }}
 */
export const transformDetailsData = (data, isProfessor) => {
  const savedSections = Array.isArray(data.detail_sections) ? data.detail_sections : [];

  const containers = savedSections.map((section) => ({
    id: section.id,
    title: section.title,
    content: section.subsec_description || "",
  }));

  return {
    containers,
    quickDetails: buildQuickDetails(data, isProfessor),
  };
};

/**
 * Fallback detailsData used when the API call fails.
 */
export const FALLBACK_DETAILS_DATA = {
  containers: [],
  quickDetails: [
    { id: 1, icon: "Calendar", text: "Created 21st June 2025" },
    { id: 2, icon: "Clock",    text: "Last updated 2 days ago" },
  ],
};

/**
 * IDs that are treated as "default / unsaved" cards.
 * These should be created via POST instead of PUT.
 */
export const DEFAULT_CARD_IDS = [1, 2, 3];