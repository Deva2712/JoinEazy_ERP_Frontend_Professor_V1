// src/pages/Registrar/RegistrarUI.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText, ArrowLeft, RefreshCw, AlertTriangle,
    CheckCircle, ClipboardList, FileSignature,
} from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import DocChecklistTab  from "./components/DocChecklistTab";
import DocRequestTab    from "./components/DocRequestTab";
import RequestStatusTab from "./components/RequestStatusTab";
import LorTab           from "./components/LorTab";

/* ─── Tabs ────────────────────────────────────────────────────────────── */
const STUDENT_TABS = [
    { key: "checklist",      label: "Document Checklist", icon: CheckCircle   },
    { key: "doc-request",    label: "Request a Document", icon: FileText      },
    { key: "request-status", label: "Request Status",     icon: ClipboardList },
    { key: "lor",            label: "My LoR Requests",    icon: FileSignature },
];

const PROFESSOR_TABS = [
    { key: "lor",            label: "LoR Requests",       icon: FileSignature },
];

/* ─── RegistrarUI ─────────────────────────────────────────────────────── */
const RegistrarUI = ({
    loading = false, error = null, onRetry = () => {},
    activeTabOverride,
    documentRequests = [], adminSubmittedDocs = [],
    onRequestDocument = () => {}, onCancelRequest = () => {},
    lorRequests = [], userRole = "student",
    onLorApprove, onLorReject, onLorSubmit, onScheduleMeeting,
}) => {
    const navigate = useNavigate();
    const isProfessor = userRole === "professor" || userRole === "hod";

    const TABS = isProfessor ? PROFESSOR_TABS : STUDENT_TABS;
    const defaultTab = TABS[0].key;

    const [activeTab, setActiveTab] = useState(activeTabOverride || defaultTab);

    // pending badge for professor LoR tab
    const lorPendingCount = lorRequests.filter(r => r.status === "Pending").length;

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex justify-center py-32"><RefreshCw className="size-10 animate-spin text-purple-600" /></div>
            <BottomNavController /><FooterController />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <AlertTriangle className="size-10 text-red-600 mb-4" />
                <h2 className="text-xl font-bold dark:text-white mb-2">Failed to load</h2>
                <button onClick={onRetry} className="mt-4 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold">Try Again</button>
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* Page header + tab bar */}
            <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 dark:from-purple-900 dark:via-violet-900 dark:to-indigo-900 text-white">
                <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => navigate("/dashboard")}
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                            <ArrowLeft className="size-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Registrar Office</h1>
                            <p className="text-white/70 text-sm mt-0.5">
                                {isProfessor
                                    ? "Manage LoR requests from your students."
                                    : "Documents, certificates & admission checklist."}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            const badge = tab.key === "lor" && isProfessor ? lorPendingCount
                                : tab.key === "request-status" && !isProfessor ? documentRequests.length
                                : 0;
                            return (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                                        isActive
                                            ? "bg-gray-50 dark:bg-[#0f1117] text-purple-600 dark:text-purple-400"
                                            : "text-white/70 hover:bg-white/10"
                                    }`}
                                >
                                    <Icon className="size-4" />
                                    {tab.label}
                                    {badge > 0 && (
                                        <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isActive ? "bg-purple-600 text-white" : "bg-white/20"}`}>
                                            {badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab content */}
            <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
                <div className="animate-in fade-in duration-300">
                    {/* Student tabs */}
                    {!isProfessor && activeTab === "checklist" && (
                        <DocChecklistTab adminSubmittedDocs={adminSubmittedDocs} />
                    )}
                    {!isProfessor && activeTab === "doc-request" && (
                        <DocRequestTab onRequestDocument={onRequestDocument} />
                    )}
                    {!isProfessor && activeTab === "request-status" && (
                        <RequestStatusTab documentRequests={documentRequests} />
                    )}

                    {/* LoR tab — shared component, role-aware */}
                    {activeTab === "lor" && (
                        <LorTab
                            userRole={userRole}
                            lorRequests={lorRequests}
                            onApprove={onLorApprove}
                            onReject={onLorReject}
                            onSubmitLor={onLorSubmit}
                            onScheduleMeeting={onScheduleMeeting}
                        />
                    )}
                </div>
            </main>

            <BottomNavController />
            <FooterController />
        </div>
    );
};

export default RegistrarUI;