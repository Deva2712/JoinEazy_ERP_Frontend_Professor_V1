// src/pages/StudentCourses/components/CourseFeedbackForm.jsx
import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import StarRating from "./StarRating";

const FEEDBACK_QUESTIONS = [
    { id: "teaching",   label: "Teaching Quality", desc: "How effective was the instructor's teaching?"   },
    { id: "content",    label: "Course Content",   desc: "Was the content relevant and well-structured?" },
    { id: "difficulty", label: "Difficulty Level", desc: "How appropriate was the course difficulty?"    },
    { id: "recommend",  label: "Would Recommend",  desc: "Would you recommend this course to others?"    },
];

export default function CourseFeedbackForm({ cohort, onSubmit }) {
    const [ratings,   setRatings]   = useState({});
    const [comment,   setComment]   = useState("");
    const [submitted, setSubmitted] = useState(false);

    const allAnswered = FEEDBACK_QUESTIONS.every((q) => (ratings[q.id] || 0) > 0);

    const handleSubmit = () => {
        if (!allAnswered) return;
        onSubmit(cohort.id, { ratings, comment });
        setSubmitted(true);
    };

    if (submitted) return (
        <div className="flex flex-col items-center py-8 text-center gap-3">
            <CheckCircle className="size-10 text-green-500" />
            <p className="font-bold text-gray-900 dark:text-white">Feedback submitted — thank you!</p>
        </div>
    );

    return (
        <div className="space-y-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            {FEEDBACK_QUESTIONS.map((q) => (
                <div key={q.id}>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-0.5">{q.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{q.desc}</p>
                    <StarRating
                        value={ratings[q.id] || 0}
                        onChange={(v) => setRatings((p) => ({ ...p, [q.id]: v }))}
                    />
                </div>
            ))}
            <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Additional Comments (optional)
                </p>
                <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Any other thoughts about this course..."
                    className="w-full px-4 py-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 transition-colors resize-none"
                />
            </div>
            {!allAnswered && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    Please rate all questions before submitting.
                </p>
            )}
            <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
            >
                <Send className="size-3.5" />Submit Feedback
            </button>
        </div>
    );
}