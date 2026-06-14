// src/pages/StudentCourses/views/registration/RegistrationLocked.jsx
import React from "react";
import { Lock, Calendar, Clock, X, ClipboardList } from "lucide-react";
import { formatDate } from "../../utils/helpers";
import StatusBadge from "../../components/StatusBadge";

export default function RegistrationLocked({ nextWindowDate, windowEnd, myRegistrations, onCancelRegistration }) {
    const isPastDue = windowEnd ? new Date() > new Date(windowEnd) : false;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Locked card */}
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-10 flex flex-col items-center text-center gap-5">
                <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-full">
                    <Lock className="size-10 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Registration is Currently Closed</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                        Course registration opens near the end of each semester. Check back closer to the date below.
                    </p>
                </div>
                {nextWindowDate && (
                    <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                        <Calendar className="size-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                            Next window opens <span className="text-blue-600 dark:text-blue-400">{formatDate(nextWindowDate)}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Past registrations */}
            {myRegistrations.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ClipboardList className="size-4 text-blue-600" />My Registrations
                        </h2>
                        {!isPastDue && windowEnd ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                                <Clock className="size-3.5" />Editable until {formatDate(windowEnd)}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                                <Lock className="size-3.5" />Registration locked
                            </span>
                        )}
                    </div>
                    <div className="space-y-3">
                        {myRegistrations.map((reg) => (
                            <div key={reg.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{reg.title}</h3>
                                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">{reg.courseCode}</span>
                                        {reg.isElective && <span className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-100 dark:border-purple-800">Elective</span>}
                                        <StatusBadge status={reg.status} />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reg.instructor} · {reg.credits} Credits</p>
                                    {reg.adminRemarks && <p className="text-xs text-gray-400 mt-1 italic">"{reg.adminRemarks}"</p>}
                                </div>
                                {reg.status === "Pending" && !isPastDue && (
                                    <button onClick={() => onCancelRegistration(reg.id)} className="flex items-center gap-1.5 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold rounded-xl transition-colors shrink-0">
                                        <X className="size-3.5" />Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}