// src/pages/StudentAttendance/components/AttendanceSummary.jsx
import React from "react";
import { BookOpen, CheckCircle2, XCircle, CalendarOff } from "lucide-react";

const SUMMARY_ITEMS = [
    { key: "totalClasses",  label: "Total Classes", Icon: BookOpen,
      color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
    { key: "totalPresent",  label: "Present",       Icon: CheckCircle2,
      color: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" },
    { key: "totalAbsent",   label: "Absent",        Icon: XCircle,
      color: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
    { key: "totalLeave",    label: "On Leave",      Icon: CalendarOff,
      color: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
];

export default function AttendanceSummary({ overallStats }) {
    if (!overallStats) return null;

    return (
        <div className="bg-white dark:bg-[#1a1d27] rounded-3xl border border-gray-100 dark:border-white/10 p-5 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Overall Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SUMMARY_ITEMS.map(({ key, label, Icon, color }) => (
                    <div key={key} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                        <div className={`p-2 rounded-xl mb-2 ${color}`}>
                            <Icon className="size-5" />
                        </div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            {overallStats[key]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}