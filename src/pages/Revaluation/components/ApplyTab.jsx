// src/pages/Revaluation/components/ApplyTab.jsx

import React from "react";
import { Plus, RotateCcw, CheckCircle2 } from "lucide-react";
import RevalStatusBadge from "./RevalStatusBadge";

const ApplyTab = ({ eligibleSubjects = [], requests = [], onApply }) => {
    const getExistingRequest = (code) =>
        requests.find((r) => r.subjectCode === code);

    if (eligibleSubjects.length === 0) {
        return (
            <div className="text-center py-20">
                <RotateCcw className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-semibold">No subjects eligible for revaluation.</p>
                <p className="text-gray-400 text-sm mt-1">Results must be declared before applying.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300 space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a subject from the table below to apply for revaluation. You can only apply once per subject.
            </p>

            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Code</th>
                            <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Semester</th>
                            <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Marks</th>
                            <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                            <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-center px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {eligibleSubjects.map((subject) => {
                            const existing = getExistingRequest(subject.subjectCode);
                            return (
                                <tr key={subject.subjectCode} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                    <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">
                                        {subject.subjectName}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                        {subject.subjectCode}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-gray-600 dark:text-gray-300 text-xs">
                                        {subject.semester}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-300">
                                        {subject.originalMarks}/{subject.maxMarks}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-bold text-violet-600 dark:text-violet-400">
                                        {subject.grade}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        {existing ? (
                                            <RevalStatusBadge status={existing.status} />
                                        ) : (
                                            <span className="text-xs text-gray-400">Not Applied</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        {existing ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700">
                                                <CheckCircle2 className="size-3" /> Applied
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => onApply(subject)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all"
                                            >
                                                <Plus className="size-3" /> Apply
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplyTab;
