// src/pages/StudentCourses/components/ElectiveCourseCard.jsx
import React from "react";
import { CheckCircle } from "lucide-react";

const PRIORITY_LABELS = ["1st", "2nd", "3rd", "4th", "5th"];

export default function ElectiveCourseCard({ course, priority, isDisabled, onToggle, onClick }) {
    const isSelected = priority != null;

    return (
        <div
            className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border-2 flex flex-col transition-all ${
                isSelected
                    ? "border-blue-500 dark:border-blue-400 shadow-sm shadow-blue-100 dark:shadow-blue-900/20"
                    : isDisabled
                        ? "border-gray-200 dark:border-gray-800 opacity-60"
                        : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
            }`}
        >
            {/* Clickable body → opens modal */}
            <div className="p-4 flex-1 cursor-pointer" onClick={() => onClick(course)}>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-100 dark:border-blue-800">
                        {course.courseCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                        {course.credits} Credits
                    </span>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{course.instructor}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{course.overview}</p>
            </div>

            {/* Priority toggle footer */}
            <div className="px-4 pb-4">
                <button
                    onClick={(e) => { e.stopPropagation(); if (!isDisabled || isSelected) onToggle(course); }}
                    disabled={isDisabled && !isSelected}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                            ? "bg-blue-600 text-white"
                            : isDisabled
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
                    }`}
                >
                    {isSelected ? (
                        <>
                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[9px] font-extrabold">
                                {priority}
                            </span>
                            Priority {PRIORITY_LABELS[priority - 1]} · Remove
                        </>
                    ) : isDisabled ? (
                        "Max selections reached"
                    ) : (
                        "+ Select"
                    )}
                </button>
            </div>
        </div>
    );
}