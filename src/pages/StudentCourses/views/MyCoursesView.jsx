// src/pages/StudentCourses/views/MyCoursesView.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookMarked, Archive, Calendar, Clock, FileText,
    Users, ChevronRight, Info, X,
} from "lucide-react";
import { formatDateRange } from "../utils/helpers";

// ── My Courses Detail Modal ───────────────────────────────────────────────────

function CohortModal({ cohort, onClose }) {
    const navigate = useNavigate();
    if (!cohort) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#13151f] rounded-t-3xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10">
                    <X className="size-4" />
                </button>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {cohort.courseCodes?.map((code) => (
                            <span key={code} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">{code}</span>
                        ))}
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{cohort.title}</h2>
                    {cohort.instructor && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cohort.instructor}</p>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800">
                    {[
                        { label: "Due This Week",     value: cohort.dueThisWeek,      color: "text-rose-600 dark:text-rose-400"  },
                        { label: "Pending",           value: cohort.totalDue,          color: "text-blue-600 dark:text-blue-400"  },
                        { label: "Upcoming Meetings", value: cohort.upcomingMeetings,  color: "text-green-600 dark:text-green-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="flex flex-col items-center py-5 gap-1">
                            <p className={`text-2xl font-extrabold ${color}`}>{value ?? 0}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {cohort.startDate && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {formatDateRange(cohort.startDate, cohort.endDate)}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => { navigate(`/c/${cohort.id}/assignments`); onClose(); }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold rounded-xl transition-all"
                        >
                            <FileText className="size-3.5" />Assignments
                        </button>
                        <button
                            onClick={() => { navigate(`/c/${cohort.id}/details`); onClose(); }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                        >
                            View Course <ChevronRight className="size-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function MyCoursesView({ activeCohorts, archivedCohorts }) {
    const navigate = useNavigate();
    const [subTab,       setSubTab]       = useState("active");
    const [modalCohort,  setModalCohort]  = useState(null);

    const displayCohorts = subTab === "active" ? activeCohorts : archivedCohorts;

    return (
        <>
            {modalCohort && (
                <CohortModal cohort={modalCohort} onClose={() => setModalCohort(null)} />
            )}

            {/* Sub-tab toggle */}
            <div className="flex items-center gap-2 mb-6">
                {[
                    { key: "active",   label: "Current",  Icon: BookMarked },
                    { key: "archived", label: "Archived", Icon: Archive    },
                ].map(({ key, label, Icon }) => (
                    <button
                        key={key}
                        onClick={() => setSubTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            subTab === key
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white dark:bg-[#1a1d26] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }`}
                    >
                        <Icon className="size-4" />{label}
                    </button>
                ))}
            </div>

            {displayCohorts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {displayCohorts.map((cohort) => (
                        <div
                            key={cohort.id}
                            onClick={() => setModalCohort(cohort)}
                            className={`group bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full hover:border-blue-500/30 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 transition-all duration-300 ring-1 ring-transparent hover:ring-blue-500/10 cursor-pointer ${subTab === "archived" ? "grayscale hover:grayscale-0" : ""}`}
                        >
                            {/* Title + date + code */}
                            <div className="flex flex-col gap-2 mb-5">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                                    {cohort.title}
                                </h3>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        <Calendar className="size-3.5 mr-1.5" />
                                        {cohort.startDate
                                            ? formatDateRange(cohort.startDate, cohort.endDate)
                                            : formatDateRange(cohort.createdAt, null)}
                                    </div>
                                    {cohort.courseCodes?.length > 0 && (
                                        <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800 shrink-0">
                                            {cohort.courseCodes[0]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats grid */}
                            <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-4 grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 mb-5">
                                <div className="flex flex-col items-start justify-center pr-4">
                                    <span className="font-extrabold text-2xl text-rose-600 dark:text-rose-400">{cohort.dueThisWeek}</span>
                                    <div className="flex items-center text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-600 dark:text-gray-300">
                                        <Clock className="size-3 mr-1.5" />Due This Week
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-center pl-4">
                                    <span className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">{cohort.totalDue}</span>
                                    <div className="flex items-center text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-600 dark:text-gray-300">
                                        <FileText className="size-3 mr-1.5" />Pending
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming meetings pill */}
                            {cohort.upcomingMeetings > 0 && (
                                <div
                                    onClick={(e) => { e.stopPropagation(); navigate(`/c/${cohort.id}/my-meetings`); }}
                                    className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors"
                                >
                                    <Calendar className="size-3.5" />
                                    {cohort.upcomingMeetings} upcoming meeting{cohort.upcomingMeetings > 1 ? "s" : ""}
                                </div>
                            )}

                            <p className="text-[10px] text-gray-400 mt-auto flex items-center gap-1">
                                <Info className="size-3" />Click to see details & actions
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Users className="size-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {subTab === "archived" ? "No past courses" : "No active courses"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {subTab === "archived" ? "Completed courses will appear here." : "Your enrolled courses will appear here."}
                    </p>
                </div>
            )}
        </>
    );
}