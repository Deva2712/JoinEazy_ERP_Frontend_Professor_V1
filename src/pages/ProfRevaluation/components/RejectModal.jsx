// src/pages/ProfRevaluation/components/RejectModal.jsx

import React, { useState } from "react";
import { X, XCircle, CheckCircle } from "lucide-react";

const RejectModal = ({ request, onClose, onSubmit }) => {
    const [reason, setReason]       = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!reason.trim()) return;
        onSubmit(request.id, reason.trim());
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 flex items-start justify-between">
                    <div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-0.5">Reject Request</p>
                        <h2 className="text-white font-bold text-lg">{request.subjectName}</h2>
                        <p className="text-white/60 text-sm">{request.studentName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="size-4 text-white" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {submitted && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400">Request rejected.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Reason for Rejection <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide a clear reason so the student understands why the request is rejected…"
                            rows={4}
                            className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none transition-all"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!reason.trim()}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
                        >
                            <XCircle className="size-4" />
                            Confirm Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;
