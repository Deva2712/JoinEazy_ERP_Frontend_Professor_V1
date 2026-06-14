// src/pages/Revaluation/components/RevalResultsTab.jsx

import React from "react";
import { TrendingUp, TrendingDown, Minus, Award } from "lucide-react";

const RevalResultsTab = ({ requests = [] }) => {
    const resolved = requests.filter(
        (r) => r.status === "Approved" || r.status === "Rejected"
    );

    if (resolved.length === 0) {
        return (
            <div className="text-center py-20">
                <Award className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-semibold">No revaluation results yet.</p>
                <p className="text-gray-400 text-sm mt-1">Results will appear here once evaluated by your professor.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300 space-y-4">
            {resolved.map((req) => {
                const marksChange = req.revisedMarks !== null ? req.revisedMarks - req.originalMarks : null;
                const improved = marksChange !== null && marksChange > 0;
                const unchanged = marksChange === 0;

                return (
                    <div
                        key={req.id}
                        className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        {/* Coloured top strip */}
                        <div className={`h-1 ${req.status === "Approved" ? "bg-green-500" : "bg-red-500"}`} />

                        <div className="p-5 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{req.subjectName}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {req.subjectCode} &bull; {req.semester} &bull; {req.examType}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                    req.status === "Approved"
                                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                }`}>
                                    {req.status}
                                </span>
                            </div>

                            {/* Marks comparison */}
                            {req.status === "Approved" && (
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Original</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">{req.originalMarks}</p>
                                        <p className="text-xs text-gray-400">Grade: {req.originalGrade}</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        {improved ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <TrendingUp className="size-6 text-green-500" />
                                                <span className="text-xs font-bold text-green-500">+{marksChange}</span>
                                            </div>
                                        ) : unchanged ? (
                                            <Minus className="size-6 text-gray-400" />
                                        ) : (
                                            <TrendingDown className="size-6 text-red-500" />
                                        )}
                                    </div>
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center border border-green-200 dark:border-green-800">
                                        <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mb-1">Revised</p>
                                        <p className="font-bold text-green-700 dark:text-green-400 text-lg">{req.revisedMarks}</p>
                                        <p className="text-xs text-green-600 dark:text-green-400">Grade: {req.revisedGrade}</p>
                                    </div>
                                </div>
                            )}

                            {/* Professor Remarks */}
                            {req.professorRemarks && (
                                <div className={`p-3 rounded-xl border text-sm ${
                                    req.status === "Approved"
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                                }`}>
                                    <p className="text-xs font-bold uppercase tracking-wider mb-1">Professor Remarks</p>
                                    <p className="leading-relaxed">{req.professorRemarks}</p>
                                </div>
                            )}

                            <p className="text-xs text-gray-400">
                                Evaluated on{" "}
                                {new Date(req.updatedAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RevalResultsTab;
