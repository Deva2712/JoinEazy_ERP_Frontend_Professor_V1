// src/pages/StudentCourses/views/registration/ConfirmationStep.jsx
import React from "react";
import { ArrowLeft, Send, GraduationCap } from "lucide-react";

export default function ConfirmationStep({ selectedCourses, userProfile, registrationConfig, onConfirm, onBack }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="size-4" />
                </button>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Registration</h2>
            </div>

            {/* Student info */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-5">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-3">Registering As</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Name",         value: userProfile.fullName   },
                        { label: "Roll Number",  value: userProfile.rollNumber },
                        { label: "Email",        value: userProfile.email      },
                        { label: "For Semester", value: `${registrationConfig.targetSemester} · ${registrationConfig.targetAcademicYear}` },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{value || "—"}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected courses */}
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Selected Courses ({selectedCourses.length})
                </p>
                <div className="space-y-3">
                    {/* Selected elective courses — sorted by priority */}
                    {selectedCourses.map((course) => (
                        <div key={course.id} className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                            <div className="flex items-start gap-3">
                                {course.priority != null && (
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center">
                                        {course.priority}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{course.title}</h3>
                                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-100 dark:border-blue-800">
                                            {course.courseCode}
                                        </span>
                                        {course.priority != null && (
                                            <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                                                {['1st','2nd','3rd','4th','5th'][course.priority - 1]} Priority
                                            </span>
                                        )}
                                        {course.isCompulsory && <span className="px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold border border-green-200 dark:border-green-800">Compulsory</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{course.instructor} · {course.credits} Credits</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total credits */}
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Credits</p>
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedCourses.reduce((sum, c) => sum + c.credits, 0)}
                </p>
            </div>

            <div className="flex gap-3">
                <button onClick={onBack} className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold rounded-xl transition-colors text-sm">
                    Go Back & Edit
                </button>
                <button onClick={onConfirm} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm">
                    <Send className="size-4" />Confirm & Submit
                </button>
            </div>
        </div>
    );
}