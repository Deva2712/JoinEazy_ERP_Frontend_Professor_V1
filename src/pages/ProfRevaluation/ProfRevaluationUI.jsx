 // src/pages/ProfRevaluation/ProfRevaluationUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, RefreshCw, AlertTriangle, RotateCcw,
    ClipboardCheck, CheckCircle2, XCircle, Search,
} from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import RevalRequestCard    from "./components/RevalRequestCard";
import UploadResultModal   from "./components/UploadResultModal";
import RejectModal         from "./components/RejectModal";
import StatSummaryCard     from "../../components/common/StatSummaryCard";

/* ─── Tabs ────────────────────────────────────────────────────────────── */
const TABS = [
    { key: "pending",  label: "In Review", icon: RotateCcw    },
    { key: "resolved", label: "History",             icon: CheckCircle2 },
];

const STATUS_FILTERS = ["All", "Pending", "UnderReview", "Approved", "Rejected"];

/* ─── ProfRevaluationUI ───────────────────────────────────────────────── */
export default function ProfRevaluationUI({
    loading           = false,
    error             = null,
    onRetry           = () => {},
    pendingRequests   = [],
    resolvedRequests  = [],
    stats             = {},
    myCourses         = [],
    onAccept          = () => {},
    onUploadResult    = () => {},
    onReject          = () => {},
}) {
    const navigate = useNavigate();
    const [activeTab,     setActiveTab]     = useState("pending");
    const [search,        setSearch]        = useState("");
    const [filterStatus,  setFilterStatus]  = useState("All");
    const [filterSubject, setFilterSubject] = useState("All");
    const [uploadModal,   setUploadModal]   = useState(null);
    const [rejectModal,   setRejectModal]   = useState(null);
    const [expandedId,    setExpandedId]    = useState(null);

    /* ── Loading ── */
    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex justify-center py-32">
                <RefreshCw className="size-10 animate-spin text-emerald-600" />
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    /* ── Error ── */
    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <AlertTriangle className="size-10 text-red-600 mb-4" />
                <h2 className="text-xl font-bold dark:text-white mb-2">Failed to load</h2>
                <button onClick={onRetry} className="mt-4 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">
                    Try Again
                </button>
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    /* ── Derived data ── */
    const subjectOptions = ["All", ...myCourses.map((c) => c.code)];
    const baseList = activeTab === "pending" ? pendingRequests : resolvedRequests;

    const displayList = baseList.filter((r) => {
        const matchStatus  = filterStatus  === "All" || r.status === filterStatus;
        const matchSubject = filterSubject === "All" || r.subjectCode === filterSubject;
        const q = search.toLowerCase();
        const matchSearch  = !q || r.studentName?.toLowerCase().includes(q) || r.enrollmentNo?.toLowerCase().includes(q) || r.subjectName?.toLowerCase().includes(q);
        return matchStatus && matchSubject && matchSearch;
    });

    const pendingBadge = pendingRequests.length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* ── Hero banner ── */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 text-white">
                <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">

                    {/* Title row */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Revaluation Requests</h1>
                                <p className="text-white/70 text-sm mt-0.5">
                                    Review and respond to student revaluation applications.
                                </p>
                            </div>
                        </div>

                        {/* Total count — StatSummaryCard like FinanceHero */}
                        <div className="hidden sm:flex items-center gap-3">
                            <StatSummaryCard
                                label="Total Requests"
                                value={String(stats.total ?? (pendingRequests.length + resolvedRequests.length))}
                                icon={ClipboardCheck}
                            />
                        </div>
                    </div>

                    {/* Tab bar */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => {
                            const Icon     = tab.icon;
                            const isActive = activeTab === tab.key;
                            const badge    = tab.key === "pending" ? pendingBadge : 0;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => { setActiveTab(tab.key); setExpandedId(null); setFilterStatus("All"); }}
                                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                                        isActive
                                            ? "bg-gray-50 dark:bg-[#0f1117] text-emerald-600 dark:text-emerald-400"
                                            : "text-white/70 hover:bg-white/10"
                                    }`}
                                >
                                    <Icon className="size-4" />
                                    {tab.label}
                                    {badge > 0 && (
                                        <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                                            isActive ? "bg-emerald-600 text-white" : "bg-white/20"
                                        }`}>
                                            {badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Main content ── */}
            <main className="max-w-7xl mx-auto px-4 py-6 w-full pb-24 md:pb-12">
                <div className="animate-in fade-in duration-300">

                    {/* Search + filters — LorTab style */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">

                        {/* Search box */}
                        <div className="relative flex-1">
                            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by student name, enrollment no, subject…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                            />
                        </div>

                        {/* Status filter pill group */}
                        <div className="flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl gap-0.5 overflow-x-auto no-scrollbar shrink-0">
                            {STATUS_FILTERS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                                        filterStatus === s
                                            ? "bg-emerald-600 text-white shadow"
                                            : "text-gray-500 hover:text-emerald-600 dark:text-gray-400"
                                    }`}
                                >
                                    {s === "UnderReview" ? "In Review" : s}
                                </button>
                            ))}
                        </div>

                        {/* Subject filter pill group (only if multiple subjects) */}
                        {subjectOptions.length > 1 && (
                            <div className="flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl gap-0.5 overflow-x-auto no-scrollbar shrink-0">
                                {subjectOptions.map((code) => (
                                    <button
                                        key={code}
                                        onClick={() => setFilterSubject(code)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                                            filterSubject === code
                                                ? "bg-emerald-600 text-white shadow"
                                                : "text-gray-500 hover:text-emerald-600 dark:text-gray-400"
                                        }`}
                                    >
                                        {code === "All" ? "All Subjects" : code}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cards */}
                    {displayList.length === 0 ? (
                        <div className="text-center py-20">
                            <ClipboardCheck className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 font-semibold">
                                {activeTab === "pending" ? "No pending requests." : "No resolved requests yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {displayList.map((req) => (
                                <RevalRequestCard
                                    key={req.id}
                                    request={req}
                                    expanded={expandedId === req.id}
                                    onToggle={() => setExpandedId(expandedId === req.id ? null : req.id)}
                                    onAccept={onAccept}
                                    onUploadResult={(r) => setUploadModal(r)}
                                    onReject={(r) => setRejectModal(r)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {uploadModal && (
                <UploadResultModal
                    request={uploadModal}
                    onClose={() => setUploadModal(null)}
                    onSubmit={(id, data) => { onUploadResult(id, data); setUploadModal(null); }}
                />
            )}

            {rejectModal && (
                <RejectModal
                    request={rejectModal}
                    onClose={() => setRejectModal(null)}
                    onSubmit={(id, reason) => { onReject(id, reason); setRejectModal(null); }}
                />
            )}

            <BottomNavController />
            <FooterController />
        </div>
    );
}