// src/pages/StudentCourses/StudentCoursesUI.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookMarked, ClipboardList, Star, ArrowLeft,
    RefreshCw, AlertTriangle, CheckCircle, Lock,
} from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import StatSummaryCard     from "../../components/common/StatSummaryCard";

import MyCoursesView    from "./views/MyCoursesView";
import RegistrationView from "./views/RegistrationView";
import FeedbackView     from "./views/FeedbackView";

const TABS = [
    { key: "my-courses",   label: "My Courses",   Icon: BookMarked    },
    { key: "registration", label: "Registration", Icon: ClipboardList },
    { key: "feedback",     label: "Feedback",     Icon: Star          },
];

export default function StudentCoursesUI({
    loading = false,
    error   = null,
    onRetry = () => {},
    userProfile        = {},
    activeCohorts      = [],
    archivedCohorts    = [],
    registrationConfig = { isOpen: false, nextWindowDate: null },
    registrationCourses  = [],
    myRegistrations      = [],
    onSubmitRegistration = () => {},
    onCancelRegistration = () => {},
    onSwapElective       = () => {},
    onSubmitFeedback     = () => {},
}) {
    const navigate   = useNavigate();
    const [activeTab, setActiveTab] = useState("my-courses");

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex justify-center py-32">
                <RefreshCw className="size-10 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <AlertTriangle className="size-10 text-red-600 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load</h2>
                <button onClick={onRetry} className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
                    Try Again
                </button>
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* ── Banner ── */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
                <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
                                    {/* Registration pill — now beside the title */}
                                    <button
                                        onClick={() => setActiveTab("registration")}
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                            registrationConfig.isOpen
                                                ? "bg-green-500/20 border border-green-400/30 text-green-200 hover:bg-green-500/30"
                                                : "bg-white/10 border border-white/10 text-white/50 hover:bg-white/15"
                                        }`}
                                    >
                                        {registrationConfig.isOpen
                                            ? <CheckCircle className="size-3" />
                                            : <Lock className="size-3" />}
                                        Registration {registrationConfig.isOpen ? "Open" : "Closed"}
                                    </button>
                                </div>
                                <p className="text-white/70 text-sm mt-0.5">Manage your courses, registration, and feedback.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pb-2 md:pb-0">
                            <StatSummaryCard
                                label="Active Courses"
                                value={activeCohorts.length.toString()}
                                icon={BookMarked}
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {TABS.map(({ key, label, Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                                    activeTab === key
                                        ? "bg-gray-50 dark:bg-[#0f1117] text-blue-700 dark:text-blue-400"
                                        : "text-white/70 hover:bg-white/10"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {key === "registration" && (
                                    <span className={`size-2 rounded-full ${registrationConfig.isOpen ? "bg-green-400" : "bg-gray-400"}`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
                {activeTab === "my-courses" && (
                    <MyCoursesView
                        activeCohorts={activeCohorts}
                        archivedCohorts={archivedCohorts}
                    />
                )}
                {activeTab === "registration" && (
                    <RegistrationView
                        userProfile={userProfile}
                        registrationConfig={registrationConfig}
                        registrationCourses={registrationCourses}
                        myRegistrations={myRegistrations}
                        onSubmitRegistration={onSubmitRegistration}
                        onCancelRegistration={onCancelRegistration}
                        onSwapElective={onSwapElective}
                    />
                )}
                {activeTab === "feedback" && (
                    <FeedbackView
                        activeCohorts={activeCohorts}
                        onSubmitFeedback={onSubmitFeedback}
                    />
                )}
            </main>

            <BottomNavController />
            <FooterController />
        </div>
    );
}