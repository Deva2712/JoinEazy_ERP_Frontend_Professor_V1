// src/pages/Mentor/components/FeedbackTab.jsx
import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { StarRating } from "./MentorPrimitives";

const FeedbackForm = ({ onSubmit }) => {
    const [rating,    setRating]    = useState(0);
    const [comment,   setComment]   = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        const ok = await onSubmit({ rating, comment });
        if (ok !== false) {
            setRating(0);
            setComment("");
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <div className="space-y-4">
            {submitted && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-semibold">
                    <CheckCircle className="size-4 shrink-0" />Feedback submitted!
                </div>
            )}
            <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Session Rating</p>
                <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Comments (optional)</p>
                <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the mentoring session?"
                    className="w-full px-4 py-3 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-cyan-500 resize-none"
                />
            </div>
            <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
            >
                <Send className="size-3.5" />Submit Feedback
            </button>
        </div>
    );
};

const FeedbackHistoryCard = ({ fb }) => (
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-2">
            <StarRating value={fb.rating} readonly />
            <span className="text-xs text-gray-400 ml-1">{fb.date}</span>
        </div>
        {fb.comment && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{fb.comment}"</p>
        )}
    </div>
);

export default function FeedbackTab({ feedbackHistory, onSubmitFeedback }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* Leave feedback */}
            <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Leave Feedback</h2>
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                    <FeedbackForm onSubmit={onSubmitFeedback} />
                </div>
            </div>

            {/* Feedback history */}
            <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Feedback History</h2>
                {feedbackHistory.length > 0 ? (
                    <div className="space-y-3">
                        {feedbackHistory.map((fb) => <FeedbackHistoryCard key={fb.id} fb={fb} />)}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <MessageSquare className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No feedback submitted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}