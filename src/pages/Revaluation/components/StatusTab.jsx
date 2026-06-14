// src/pages/Revaluation/components/StatusTab.jsx

import React from "react";
import { RotateCcw, Trash2, CheckCircle2, TrendingUp } from "lucide-react";
import RevalStatusBadge from "./RevalStatusBadge";

const PriorityPill = ({ priority }) => {
    const styles = {
        High: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        Mid: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
        Low: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${styles[priority] || styles.Low}`}>
            {priority}
        </span>
    );
};

const StatusTab = ({ requests = [], onCancel }) => {
    if (requests.length === 0) {
        return (
            <div className="text-center py-20">
                <RotateCcw className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-semibold">No revaluation requests yet.</p>
                <p className="text-gray-400 text-sm mt-1">Go to the Apply tab to submit a request.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300 space-y-4">
            {requests.map((req) => (
                <div
                    key={req.id}
                    className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4"
                >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{req.subjectName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {req.subjectCode} &bull; {req.semester} &bull; {req.examType}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <PriorityPill priority={req.priority} />
                            <RevalStatusBadge status={req.status} />
                        </div>
                    </div>

                    {/* Marks Row */}
                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Original</p>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {req.originalMarks}/{req.maxMarks}
                                <span className="text-xs font-semibold text-gray-500 ml-1">({req.originalGrade})</span>
                            </p>
                        </div>
                        {req.revisedMarks !== null && (
                            <>
                                <TrendingUp className="size-5 text-green-500 flex-shrink-0" />
                                <div className="text-center">
                                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider mb-0.5">Revised</p>
                                    <p className="font-bold text-green-700 dark:text-green-400">
                                        {req.revisedMarks}/{req.maxMarks}
                                        <span className="text-xs font-semibold ml-1">({req.revisedGrade})</span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Reason */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Reason</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{req.reason}</p>
                    </div>

                    {/* Professor Remarks (if any) */}
                    {req.professorRemarks && (
                        <div className={`p-3 rounded-xl border text-sm ${
                            req.status === "Approved"
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                        }`}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1">Professor Remarks</p>
                            <p>{req.professorRemarks}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                        <p className="text-xs text-gray-400">
                            Submitted {new Date(req.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {req.status === "Pending" && (
                            <button
                                onClick={() => onCancel(req.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                            >
                                <Trash2 className="size-3" /> Cancel Request
                            </button>
                        )}
                        {req.status === "Approved" && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400">
                                <CheckCircle2 className="size-4" /> Result Updated
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatusTab;
