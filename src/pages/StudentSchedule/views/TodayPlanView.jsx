import React from "react";
import {
    MapPin, GraduationCap, CalendarDays,
} from "lucide-react";

// ── Class Card ────────────────────────────────────────────────────────────────
const ClassCard = ({ cls }) => (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                    {cls.courseCode}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {cls.courseType}
                </span>
            </div>
            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                {cls.startTime} – {cls.endTime}
            </span>
        </div>

        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
            {cls.courseName}
        </h4>

        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase min-w-0">
                <GraduationCap className="size-3 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{cls.professor}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-800/50 flex-shrink-0">
                <MapPin className="size-3" />
                {cls.roomNumber}
            </div>
        </div>
    </div>
);

// ── Main View ─────────────────────────────────────────────────────────────────
const TodayPlanView = ({ todaysClasses, todayName }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Today's Classes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Classes</h3>
                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">
                            {todayName} · {todaysClasses.length} class{todaysClasses.length !== 1 ? "es" : ""} scheduled
                        </p>
                    </div>
                </div>

                {todaysClasses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <CalendarDays className="size-10 text-gray-200 dark:text-gray-700 mb-3" />
                        <p className="text-sm font-bold text-gray-400">No classes scheduled today</p>
                        <p className="text-xs text-gray-400 mt-1">Enjoy your free day!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todaysClasses.map((cls) => (
                            <ClassCard key={cls.id} cls={cls} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayPlanView;