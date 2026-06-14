// src/pages/Revaluation/components/ApplyRevaluationModal.jsx

import React, { useState } from "react";
import { X, Send, CheckCircle, ChevronDown } from "lucide-react";

const ApplyRevaluationModal = ({ subjects = [], existingRequestCodes = [], onClose, onSubmit }) => {
    const [form, setForm] = useState({
        subjectCode: "",
        examType: "End Term",
        priority: "Mid",
        reason: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const availableSubjects = subjects.filter(
        (s) => !existingRequestCodes.includes(s.subjectCode)
    );

    const selectedSubject = subjects.find((s) => s.subjectCode === form.subjectCode);

    const handleSubmit = () => {
        if (!form.subjectCode || !form.reason.trim()) return;
        const data = {
            ...selectedSubject,
            examType: form.examType,
            priority: form.priority,
            reason: form.reason.trim(),
        };
        onSubmit(data);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5 flex items-start justify-between">
                    <div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-0.5">
                            New Application
                        </p>
                        <h2 className="text-white font-bold text-lg">Apply for Revaluation</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X className="size-4 text-white" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {submitted && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                Revaluation request submitted!
                            </p>
                        </div>
                    )}

                    {/* Subject Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Subject <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={form.subjectCode}
                                onChange={(e) => setForm((p) => ({ ...p, subjectCode: e.target.value }))}
                                className="w-full appearance-none px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            >
                                <option value="">Select a subject…</option>
                                {availableSubjects.map((s) => (
                                    <option key={s.subjectCode} value={s.subjectCode}>
                                        {s.subjectName} ({s.subjectCode})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        </div>
                        {selectedSubject && (
                            <div className="mt-2 flex items-center gap-3 p-2.5 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800">
                                <div className="text-xs text-violet-700 dark:text-violet-300 font-semibold">
                                    {selectedSubject.semester} &bull; Current: {selectedSubject.originalMarks}/{selectedSubject.maxMarks} ({selectedSubject.grade})
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Exam Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Exam Type
                        </label>
                        <div className="flex gap-2">
                            {["End Term", "Midterm 1", "Midterm 2"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setForm((p) => ({ ...p, examType: t }))}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                        form.examType === t
                                            ? "bg-violet-600 text-white border-violet-600"
                                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Priority <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {["High", "Mid", "Low"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                                        form.priority === p
                                            ? p === "High"
                                                ? "bg-red-600 text-white border-red-600"
                                                : p === "Mid"
                                                ? "bg-yellow-500 text-white border-yellow-500"
                                                : "bg-gray-600 text-white border-gray-600"
                                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={form.reason}
                            onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                            placeholder="Explain clearly why you believe a revaluation is warranted…"
                            rows={4}
                            className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none transition-all"
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
                            disabled={!form.subjectCode || !form.reason.trim()}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
                        >
                            <Send className="size-4" />
                            Submit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyRevaluationModal;
