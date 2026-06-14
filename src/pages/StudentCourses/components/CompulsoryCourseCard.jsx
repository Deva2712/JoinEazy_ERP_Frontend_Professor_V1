// src/pages/StudentCourses/components/CompulsoryCourseCard.jsx
import React from "react";
import { CheckCircle, Info } from "lucide-react";

export default function CompulsoryCourseCard({ course, onClick }) {
    return (
        <div
            onClick={() => onClick(course)}
            className="group bg-white dark:bg-[#1a1d26] rounded-2xl border-2 border-green-200 dark:border-green-800 p-4 flex flex-col gap-3 cursor-pointer hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all"
        >
            {/* Top row: code (left) + auto-enrolled tick (right) */}
            <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-100 dark:border-blue-800">
                    {course.courseCode}
                </span>
                <div className="size-5 rounded-md bg-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle className="size-3 text-white" />
                </div>
            </div>

            {/* Title + instructor */}
            <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{course.instructor}</p>
            </div>

            {/* Footer: status label (left) + full credits label (right) */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-green-600 dark:text-green-400">Auto-enrolled</span>
                <span className="px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold border border-green-200 dark:border-green-800">
                    {course.credits} Credits
                </span>
            </div>

            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <Info className="size-3" />Click for details
            </p>
        </div>
    );
}