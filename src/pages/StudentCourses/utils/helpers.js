// src/pages/StudentCourses/utils/helpers.js

export const formatDate = (ds) =>
    new Date(ds).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export const formatDateRange = (s, e) => {
    const start = new Date(s);
    const end   = e ? new Date(e) : new Date(new Date(start).setMonth(start.getMonth() + 4));
    const o     = { month: "short", day: "numeric", year: "numeric" };
    return `${start.toLocaleDateString("en-US", o)} — ${end.toLocaleDateString("en-US", o)}`;
};