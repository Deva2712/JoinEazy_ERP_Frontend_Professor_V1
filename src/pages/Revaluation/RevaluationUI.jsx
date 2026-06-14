// src/pages/Revaluation/RevaluationUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, RefreshCw, AlertTriangle, RotateCcw,
    ClipboardList, Award, Plus, BookOpen, BookMarked,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import ApplyTab from "./components/ApplyTab";
import StatusTab from "./components/StatusTab";
import RevalResultsTab from "./components/RevalResultsTab";
import ApplyRevaluationModal from "./components/ApplyRevaluationModal";

const TABS = [
    { key: "apply",   label: "Apply",       icon: RotateCcw },
    { key: "status",  label: "My Requests",  icon: ClipboardList },
    { key: "results", label: "Results",      icon: Award },
];

export default function RevaluationUI({
    loading = false,
    error = null,
    onRetry = () => {},
    eligibleSubjects = [],
    requests = [],
    stats = {},
    onSubmitRequest = () => {},
    onCancelRequest = () => {},
}) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("apply");
    const [applyModal, setApplyModal] = useState(null);

    const existingRequestCodes = requests.map((r) => r.subjectCode);

    const handleApply = (subject = null) => {
        setApplyModal(subject || true);
    };

    // Stats — same pattern as SessionPlanningUI
    const statsData = [
        {
            label: "Active Courses",
            value: (eligibleSubjects.length).toString(),
            icon: BookOpen,
        },
        {
            label: "My Requests",
            value: (stats.totalRequests ?? requests.length).toString(),
            icon: BookMarked,
        },
    ];

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
                <HeaderController />
                <div className="flex justify-center py-32">
                    <RefreshCw className="size-10 animate-spin text-violet-600" />
                </div>
                <BottomNavController />
                <FooterController />
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
                <HeaderController />
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <AlertTriangle className="size-10 text-red-600 mb-4" />
                    <h2 className="text-xl font-bold dark:text-white mb-2">Failed to load</h2>
                    <button
                        onClick={onRetry}
                        className="mt-4 bg-violet-600 text-white px-8 py-3 rounded-xl font-bold"
                    >
                        Try Again
                    </button>
                </div>
                <BottomNavController />
                <FooterController />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 text-white">
                <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">

                    {/* Title row + StatSummaryCards (same as SessionPlanningUI) */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Revaluation</h1>
                                <p className="text-white/70 text-sm mt-0.5">
                                    Apply for re-checking &amp; track your requests.
                                </p>
                            </div>
                        </div>

                        {/* StatSummaryCards — same as session planning */}
                        <div className="flex items-center gap-3 pb-2 md:pb-0">
                            {statsData.map((stat, index) => (
                                <StatSummaryCard key={index} {...stat} />
                            ))}
                            {/* New Request button */}
                            <button
                                onClick={() => handleApply()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-sm font-bold transition-all"
                            >
                                <Plus className="size-4" /> New Request
                            </button>
                        </div>
                    </div>

                    {/* Tabs — exact same pattern as SessionPlanningUI */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                                        active
                                            ? "bg-gray-50 dark:bg-[#0f1117] text-violet-600 dark:text-violet-400"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
                {activeTab === "apply" && (
                    <ApplyTab
                        eligibleSubjects={eligibleSubjects}
                        requests={requests}
                        onApply={handleApply}
                    />
                )}
                {activeTab === "status" && (
                    <StatusTab
                        requests={requests}
                        onCancel={onCancelRequest}
                    />
                )}
                {activeTab === "results" && (
                    <RevalResultsTab requests={requests} />
                )}
            </main>

            {applyModal && (
                <ApplyRevaluationModal
                    subjects={eligibleSubjects}
                    existingRequestCodes={existingRequestCodes}
                    onClose={() => setApplyModal(null)}
                    onSubmit={(data) => {
                        onSubmitRequest(data);
                        setApplyModal(null);
                    }}
                />
            )}

            <BottomNavController />
            <FooterController />
        </div>
    );
}