
// src/pages/ProfRevaluation/components/RevalRequestCard.jsx

import React from "react";
import {
    Clock, RefreshCw, CheckCircle2, XCircle,
    Upload, X, Eye, ChevronDown, ChevronUp, User,
} from "lucide-react";

const STATUS_STYLES = {
    Pending:     { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", icon: Clock },
    UnderReview: { bg: "bg-blue-50 dark:bg-blue-900/20",     text: "text-blue-700 dark:text-blue-400",     border: "border-blue-200 dark:border-blue-800",     icon: RefreshCw },
    Approved:    { bg: "bg-green-50 dark:bg-green-900/20",   text: "text-green-700 dark:text-green-400",   border: "border-green-200 dark:border-green-800",   icon: CheckCircle2 },
    Rejected:    { bg: "bg-red-50 dark:bg-red-900/20",       text: "text-red-700 dark:text-red-400",       border: "border-red-200 dark:border-red-800",       icon: XCircle },
};

const PRIORITY_STYLES = {
    High: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Mid:  "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Low:  "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

const RevalRequestCard = ({ request, expanded, onToggle, onAccept, onUploadResult, onReject }) => {

    const statusStyle = STATUS_STYLES[request.status] || STATUS_STYLES.Pending;
    const StatusIcon  = statusStyle.icon;
    const isActive    = request.status === "Pending" || request.status === "UnderReview";

    return (
        <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">

            {/* ── Collapsed header row (always visible) ── */}
            <div
                className="flex items-center justify-between gap-3 p-5 cursor-pointer select-none"
                onClick={() => onToggle()}
            >
                {/* Left: avatar icon + name + subject */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 shrink-0">
                        <User className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm text-gray-900 dark:text-white">
                                {request.studentName}
                            </p>
                            <span className="text-xs text-gray-400 font-mono">
                                {request.enrollmentNo}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {request.subjectName}
                            <span className="ml-1.5 font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px]">
                                {request.subjectCode}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right: status badge + chevron */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        <StatusIcon className="size-3.5" />
                        {request.status === "UnderReview" ? "Under Review" : request.status}
                    </span>
                    {expanded
                        ? <ChevronUp  className="size-4 text-gray-400" />
                        : <ChevronDown className="size-4 text-gray-400" />
                    }
                </div>
            </div>

            {/* ── Expanded detail section ── */}
            {expanded && (
                <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-4 space-y-4">

                    {/* Semester / exam type / priority */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {request.semester} &bull; {request.examType}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${PRIORITY_STYLES[request.priority] || PRIORITY_STYLES.Low}`}>
                            {request.priority} Priority
                        </span>
                    </div>

                    {/* Marks */}
                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Original</p>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {request.originalMarks ?? "—"}{request.maxMarks ? `/${request.maxMarks}` : ""}{request.originalGrade ? ` (${request.originalGrade})` : ""}
                            </p>
                        </div>
                        {request.revisedMarks !== null && (
                            <div>
                                <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mb-0.5">Revised</p>
                                <p className="font-bold text-green-700 dark:text-green-400">
                                    {request.revisedMarks ?? "—"}{request.maxMarks ? `/${request.maxMarks}` : ""}{request.revisedGrade ? ` (${request.revisedGrade})` : ""}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Student's reason */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Student's Reason
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {request.reason}
                        </p>
                    </div>

                    {/* Professor remarks (if resolved) */}
                    {request.professorRemarks && (
                        <div className={`p-3 rounded-xl border text-sm ${
                            request.status === "Approved"
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                        }`}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1">Your Remarks</p>
                            <p>{request.professorRemarks}</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    {isActive && (
                        <div className="flex gap-2 pt-1 flex-wrap">
                            {request.status === "Pending" && (
                                <button
                                    onClick={() => onAccept(request.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                                >
                                    <Eye className="size-3.5" /> Accept & Review
                                </button>
                            )}
                            {request.status === "UnderReview" && (
                                <button
                                    onClick={() => onUploadResult(request)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
                                >
                                    <Upload className="size-3.5" /> Upload Result
                                </button>
                            )}
                            <button
                                onClick={() => onReject(request)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                            >
                                <X className="size-3.5" /> Reject
                            </button>
                        </div>
                    )}

                    <p className="text-xs text-gray-400">
                        Submitted {request.submittedAt || request.createdAt
                            ? new Date(request.submittedAt || request.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RevalRequestCard;