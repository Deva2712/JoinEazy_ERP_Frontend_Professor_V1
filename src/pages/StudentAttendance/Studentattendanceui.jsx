// src/pages/StudentAttendance/StudentAttendanceUI.jsx
import React, { useState } from "react";
import {
    ArrowLeft, RefreshCw, BookOpen, TrendingUp, AlertCircle, QrCode, BarChart2,
} from "lucide-react";

import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import StatSummaryCard     from "../../components/common/StatSummaryCard";

import AttendanceSummary    from "./components/AttendanceSummary";
import AttendanceCourseCard from "./components/AttendanceCourseCard";
import QRScannerTab         from "./components/QRScannerTab";

const TABS = [
    { id: "overview", label: "Overview",    Icon: BarChart2 },
    { id: "scan",     label: "Scan QR",     Icon: QrCode    },
];

export default function StudentAttendanceUI({
    loading          = false,
    error            = null,
    onRetry          = () => {},
    courses          = [],
    overallStats     = null,
    onBack           = () => {},
    onAttendanceMarked = () => {},
}) {
    const [activeTab, setActiveTab] = useState("overview");

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
            <HeaderController />
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                <RefreshCw className="size-12 animate-spin mb-4 text-indigo-500" />
                <p className="font-bold text-gray-900 dark:text-white">Loading Attendance</p>
                <p className="text-sm mt-1">Please wait…</p>
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error) return (
        <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
            <HeaderController />
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-6">
                    <AlertCircle className="size-10 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Unable to Load Attendance
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">{error}</p>
                <div className="flex gap-3">
                    <button onClick={onRetry} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                        <RefreshCw className="size-4" /> Try Again
                    </button>
                    <button onClick={onBack} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-all">
                        <ArrowLeft className="size-4" /> Go Back
                    </button>
                </div>
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    // ── Main ──────────────────────────────────────────────────────────────────
    return (
        <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans transition-colors duration-300">
            <HeaderController />

            {/* Banner */}
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 dark:from-indigo-900 dark:via-indigo-950 dark:to-violet-950 text-white">
                <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
                                <p className="text-indigo-100 text-sm mt-0.5">
                                    Course-wise attendance overview.
                                </p>
                            </div>
                        </div>

                        {activeTab === "overview" && (
                            <div className="flex items-center gap-3">
                                <StatSummaryCard
                                    label="Courses"
                                    value={courses.length.toString()}
                                    icon={BookOpen}
                                />
                                {overallStats?.overallPercentage != null && (
                                    <StatSummaryCard
                                        label="Overall %"
                                        value={`${overallStats.overallPercentage}%`}
                                        icon={TrendingUp}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tab bar — flush to bottom of banner */}
                    <div className="flex gap-1 mt-5">
                        {TABS.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all duration-200 ${
                                    activeTab === id
                                        ? "bg-gray-50 dark:bg-[#0f1117] text-indigo-600 dark:text-indigo-400"
                                        : "text-indigo-200 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                <Icon className="size-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 pb-32 w-full">
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <AttendanceSummary overallStats={overallStats} />

                        {!courses.length ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                                    <BookOpen className="size-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No Courses Enrolled Yet
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                    Once you enrol in courses, your attendance will appear here.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                                    Course Breakdown
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courses.map((course) => (
                                        <AttendanceCourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "scan" && (
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white dark:bg-[#1a1d27] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                            <QRScannerTab onAttendanceMarked={onAttendanceMarked} />
                        </div>
                    </div>
                )}
            </main>

            <BottomNavController />
            <FooterController />
        </div>
    );
}
