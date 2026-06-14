// src/pages/StudentAttendance/components/AttendanceCourseCard.jsx
import React from "react";
import {
    Users, BookOpen, CheckCircle2, XCircle,
    CalendarOff, Award, TrendingUp, TrendingDown, AlertTriangle,
} from "lucide-react";

const getTheme = (pct) => {
    if (pct >= 85) return {
        ring:  "text-green-500",
        bg:    "bg-green-50 dark:bg-green-500/10",
        text:  "text-green-700 dark:text-green-400",
        label: "Good Standing",
        Icon:  Award,
    };
    if (pct >= 75) return {
        ring:  "text-yellow-500",
        bg:    "bg-yellow-50 dark:bg-yellow-500/10",
        text:  "text-yellow-700 dark:text-yellow-400",
        label: "Acceptable",
        Icon:  TrendingUp,
    };
    return {
        ring:  "text-red-500",
        bg:    "bg-red-50 dark:bg-red-500/10",
        text:  "text-red-700 dark:text-red-400",
        label: "Below 75% — Risk",
        Icon:  TrendingDown,
    };
};

// Circular donut ring
const AttendanceRing = ({ percentage, ringColor }) => {
    const r      = 28;
    const circ   = 2 * Math.PI * r;
    const offset = circ - (percentage / 100) * circ;
    return (
        <svg width="72" height="72" className="-rotate-90" aria-hidden>
            <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6"
                className="text-gray-200 dark:text-white/10" stroke="currentColor" />
            <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6"
                className={ringColor} stroke="currentColor"
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        </svg>
    );
};

const StatChip = ({ icon: Icon, label, value, colorClass }) => (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${colorClass}`}>
        <Icon className="size-3.5" />
        <span>{value} {label}</span>
    </div>
);

export default function AttendanceCourseCard({ course }) {
    const { cohort_name, course_codes, professor_name, stats } = course;
    const { total, present, absent, leave, percentage } = stats;
    const theme  = getTheme(percentage);
    const isLow  = percentage < 75;

    return (
        <div className={`bg-white dark:bg-[#1a1d27] rounded-3xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
            isLow ? "border-red-200 dark:border-red-500/20" : "border-gray-100 dark:border-white/10"
        }`}>

            {/* Low attendance warning banner */}
            {isLow && (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border-b border-red-100 dark:border-red-500/20">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    Attendance below 75% — risk of being detained
                </div>
            )}

            <div className="p-5">
                {/* Top row: info + ring */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        {/* Course codes */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {(course_codes || []).map((code) => (
                                <span key={code}
                                    className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg">
                                    {code}
                                </span>
                            ))}
                        </div>
                        {/* Course name */}
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-1">
                            {cohort_name}
                        </h3>
                        {/* Professor */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Users className="size-3.5 shrink-0" />
                            {professor_name}
                        </p>
                    </div>

                    {/* Donut ring */}
                    <div className="relative shrink-0">
                        <AttendanceRing percentage={percentage} ringColor={theme.ring} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-sm font-extrabold leading-none ${theme.text}`}>
                                {percentage}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status badge */}
                <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text}`}>
                    <theme.Icon className="size-3" />
                    {theme.label}
                </div>

                {/* Stat chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <StatChip icon={BookOpen}     label="Total"   value={total}
                        colorClass="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400" />
                    <StatChip icon={CheckCircle2} label="Present" value={present}
                        colorClass="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400" />
                    <StatChip icon={XCircle}      label="Absent"  value={absent}
                        colorClass="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400" />
                    {leave > 0 && (
                        <StatChip icon={CalendarOff} label="Leave" value={leave}
                            colorClass="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" />
                    )}
                </div>
            </div>
        </div>
    );
}