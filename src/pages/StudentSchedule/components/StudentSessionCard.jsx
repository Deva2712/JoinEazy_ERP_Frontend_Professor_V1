import React, { useState } from "react";
import { GraduationCap, MapPin, BookOpen, Award } from "lucide-react";

const DAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = {
    Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed",
    Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

const getSmartDefaultDay = (uniqueDays) => {
    const todayIndex = new Date().getDay();
    for (let offset = 1; offset <= 7; offset++) {
        const nextDayName = DAY_ORDER[(todayIndex + offset) % 7];
        if (uniqueDays.includes(nextDayName)) return nextDayName;
    }
    return uniqueDays[0];
};

const getCourseTypeColor = (courseType) => {
    switch (courseType) {
        case "Lab":     return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800";
        case "Theory":  return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800";
        default:        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600";
    }
};

const StudentSessionCard = ({ session, isArchived = false }) => {
    const slots      = session.schedule || [];
    const uniqueDays = [...new Set(slots.map((s) => s.day))].sort(
        (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
    );

    const [activeDay, setActiveDay] = useState(() => getSmartDefaultDay(uniqueDays));
    const daySlots = slots.filter((s) => s.day === activeDay);

    return (
        <div
            className={`group bg-white dark:bg-gray-800/50 p-6 rounded-2xl border flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 ring-1 ring-transparent hover:ring-indigo-500/10 ${
                isArchived
                    ? "grayscale-[100%] hover:grayscale-0"
                    : "border-gray-200/60 dark:border-gray-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30"
            }`}
        >
            <div className="flex flex-col gap-5 h-full">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                            {session.courseCode}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider border ${getCourseTypeColor(daySlots[0]?.courseType ?? "")}`}>
                            {daySlots[0]?.courseType ?? session.status}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">
                        {session.courseName}
                    </h3>

                    {/* Professor + Credits row */}
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold min-w-0">
                            <GraduationCap className="size-3.5 flex-shrink-0 text-indigo-400" />
                            <span className="truncate">{session.professor}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                            <Award className="size-3.5" />
                            {session.credits} cr
                        </div>
                    </div>
                </div>

                {/* Day selector */}
                <div className="flex flex-wrap gap-2">
                    {uniqueDays.map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all border ${
                                activeDay === day
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            {DAY_SHORT[day]}
                        </button>
                    ))}
                </div>

                {/* Slots for the selected day */}
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[200px] pr-1">
                    {daySlots.map((slot, index) => (
                        <div
                            key={index}
                            className="bg-gray-50/50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {slot.startTime} – {slot.endTime}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-800/50">
                                    <MapPin className="size-3" />
                                    {slot.roomNumber}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-1.5 uppercase tracking-wide">
                                {slot.buildingName}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Date range footer */}
                {session.startDate && session.endDate && (
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                            <BookOpen className="size-3" />
                            <span>
                                {new Date(session.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                {" – "}
                                {new Date(session.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentSessionCard;