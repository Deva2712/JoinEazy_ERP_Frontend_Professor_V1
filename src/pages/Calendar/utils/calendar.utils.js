/**
 * Build the calendar grid for a given cursor month.
 * Returns an array of Date | null — nulls are leading empty cells.
 */
export const buildCalendarGrid = (cursor) => {
    const year        = cursor.getFullYear();
    const month       = cursor.getMonth();
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
};

/**
 * Returns the next-month cursor from a given cursor.
 */
export const getNextMonthCursor = (cursor) =>
    new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);

/**
 * Returns the previous-month cursor from a given cursor.
 */
export const getPrevMonthCursor = (cursor) =>
    new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);

/**
 * Format a Date to a YYYY-MM-DD string (used as event date key).
 */
export const toDateKey = (date) =>
    date instanceof Date ? date.toISOString().split("T")[0] : "";

/**
 * Check if two dates fall on the same calendar day.
 */
export const isSameDay = (a, b) =>
    a instanceof Date && b instanceof Date && a.toDateString() === b.toDateString();

/**
 * Filter events to only those on or after a reference date, sorted ascending.
 */
export const getUpcomingEvents = (events, referenceDate, limit = 6) =>
    events
        .filter((e) => new Date(e.date) >= referenceDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, limit);

/**
 * Generate an ICS file string from an array of events.
 */
export const generateICSContent = (events) => {
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Joineazy//Calendar//EN",
        ...events.map((ev) =>
            [
                "BEGIN:VEVENT",
                `UID:${ev.id}@joineazy`,
                `SUMMARY:${ev.title}`,
                `DTSTART;VALUE=DATE:${ev.date.replace(/-/g, "")}`,
                `DESCRIPTION:${ev.notes || ""}`,
                "END:VEVENT",
            ].join("\n")
        ),
        "END:VCALENDAR",
    ];
    return lines.join("\n");
};

/**
 * Trigger a browser download of a generated ICS file.
 */
export const downloadICSFile = (events, filename = "joineazy-calendar.ics") => {
    const content = generateICSContent(events);
    const blob    = new Blob([content], { type: "text/calendar" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href        = url;
    a.download    = filename;
    a.click();
    URL.revokeObjectURL(url);
};