// src/pages/StudentCourses/views/FeedbackView.jsx
import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import CourseFeedbackForm from "../components/CourseFeedbackForm";

export default function FeedbackView({ activeCohorts, onSubmitFeedback }) {
    const [expandedFb, setExpandedFb] = useState(null);

    if (!activeCohorts.length) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Star className="size-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No active courses</h3>
            <p className="text-gray-500 dark:text-gray-400">Enrol in a course to leave feedback.</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Click on a course to share your experience.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCohorts.map((cohort) => {
                    const isExpanded = expandedFb === cohort.id;
                    return (
                        <div key={cohort.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <button
                                onClick={() => setExpandedFb(isExpanded ? null : cohort.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{cohort.title}</h3>
                                        {cohort.courseCodes?.length > 0 && (
                                            <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">
                                                {cohort.courseCodes[0]}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {isExpanded ? "Rating: Teaching, Content, Difficulty, Recommend" : "Click to leave feedback"}
                                    </p>
                                </div>
                                {isExpanded
                                    ? <ChevronUp className="size-5 text-gray-400 shrink-0" />
                                    : <ChevronDown className="size-5 text-gray-400 shrink-0" />}
                            </button>
                            {isExpanded && (
                                <div className="px-5 pb-5">
                                    <CourseFeedbackForm cohort={cohort} onSubmit={onSubmitFeedback} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}