// src/pages/StudentCourses/components/CourseModal.jsx
import React from "react";
import {
    X, Award, Building2, Hash, Info, Layers, CheckCircle,
} from "lucide-react";

export default function CourseModal({
    course, onClose, onToggle, isSelected, isDisabled, showSelect = true,
}) {
    if (!course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#13151f] rounded-t-3xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
                >
                    <X className="size-4" />
                </button>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">
                            {course.courseCode}
                        </span>
                        {course.isCompulsory && (
                            <span className="px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">
                                Compulsory
                            </span>
                        )}
                        {course.isElective && (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-bold border border-purple-200 dark:border-purple-800">
                                Elective
                            </span>
                        )}
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{course.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.instructor}</p>
                </div>

                {/* Stats row: Credits | Department | Schedule — no duplicates */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800">
                    {[
                        { label: "Credits",    value: `${course.credits} Credits`, icon: Award    },
                        { label: "Department", value: course.department || "—",    icon: Building2 },
                        { label: "Schedule",   value: course.schedule  || "—",     icon: Hash     },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex flex-col items-center py-4 gap-1 text-center px-2">
                            <Icon className="size-4 text-blue-500 dark:text-blue-400 mb-0.5" />
                            <p className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight">{value}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {course.overview && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Info className="size-3" />Course Overview
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{course.overview}</p>
                        </div>
                    )}

                    {course.prerequisites?.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Layers className="size-3" />Prerequisites
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {course.prerequisites.map((p) => (
                                    <span key={p} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {course.isCompulsory && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <CheckCircle className="size-4 text-green-600 dark:text-green-400 shrink-0" />
                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                Auto-enrolled — no action required.
                            </p>
                        </div>
                    )}

                    {showSelect && course.isElective && (
                        <button
                            onClick={() => { onToggle(course); onClose(); }}
                            disabled={isDisabled && !isSelected}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                                isSelected
                                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100"
                                    : isDisabled
                                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            }`}
                        >
                            {isSelected
                                ? <><X className="size-4" />Remove from Selection</>
                                : <><CheckCircle className="size-4" />Select This Elective</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}