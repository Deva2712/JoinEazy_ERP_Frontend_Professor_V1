import React, { useState } from "react";
import { Archive, ArrowLeft } from "lucide-react";
import StudentSessionCard from "../components/StudentSessionCard";

const DAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isActive = (session) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (session.startDate && session.endDate) {
        return (
            today >= new Date(session.startDate) &&
            today <= new Date(session.endDate)
        );
    }
    return session.status === "Ongoing";
};

const getDaysUntilNextSession = (schedule) => {
    if (!schedule || schedule.length === 0) return 999;
    const todayIndex = new Date().getDay();
    const uniqueDayIndices = [...new Set(schedule.map((s) => DAY_ORDER.indexOf(s.day)))];
    let minDiff = 8;
    uniqueDayIndices.forEach((dayIndex) => {
        let diff = dayIndex - todayIndex;
        if (diff <= 0) diff += 7;
        if (diff < minDiff) minDiff = diff;
    });
    return minDiff;
};

const StudentSessionsView = ({ sessions = [] }) => {
    const [viewMode, setViewMode] = useState("active");

    const activeSessions   = sessions.filter((s) => isActive(s));
    const archivedSessions = sessions.filter((s) => !isActive(s));
    const isArchivedMode   = viewMode === "archived";

    const displaySessions = (isArchivedMode ? archivedSessions : activeSessions).sort(
        (a, b) => getDaysUntilNextSession(a.schedule) - getDaysUntilNextSession(b.schedule)
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {isArchivedMode && (
                        <button
                            onClick={() => setViewMode("active")}
                            className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                    )}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {isArchivedMode ? "Completed Courses" : "Active Courses"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {displaySessions.length} {isArchivedMode ? "completed" : "ongoing"} · sorted by next class
                        </p>
                    </div>
                </div>

                {!isArchivedMode && archivedSessions.length > 0 && (
                    <button
                        onClick={() => setViewMode("archived")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        <Archive className="size-4" />
                        Completed Courses
                    </button>
                )}
            </div>

            {displaySessions.length === 0 ? (
                <div className="bg-white dark:bg-gray-800/40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
                    <p className="text-gray-500 font-medium">
                        {isArchivedMode ? "No completed courses yet." : "No active courses scheduled."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displaySessions.map((session) => (
                        <StudentSessionCard
                            key={session.id}
                            session={session}
                            isArchived={isArchivedMode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentSessionsView;