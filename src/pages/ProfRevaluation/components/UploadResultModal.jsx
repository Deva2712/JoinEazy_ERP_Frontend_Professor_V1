// src/pages/ProfRevaluation/components/UploadResultModal.jsx

import React, { useState } from "react";
import { X, Upload, CheckCircle } from "lucide-react";

const GRADES = ["O", "A+", "A", "B+", "B", "C", "D", "F"];

const UploadResultModal = ({ request, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        revisedMarks: request.originalMarks ?? "",
        revisedGrade: request.originalGrade ?? "B",
        remarks: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!form.revisedMarks || !form.remarks.trim()) return;
        onSubmit(request.id, {
            revisedMarks: Number(form.revisedMarks),
            revisedGrade: form.revisedGrade,
            remarks: form.remarks.trim(),
        });
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
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex items-start justify-between">
                    <div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-0.5">
                            Upload Revised Result
                        </p>
                        <h2 className="text-white font-bold text-lg">{request.subjectName}</h2>
                        <p className="text-white/60 text-sm mt-0.5">
                            {request.studentName} &bull; {request.enrollmentNo}
                        </p>
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
                                Result uploaded successfully!
                            </p>
                        </div>
                    )}

                    {/* Original marks reference */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex gap-4 text-sm">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Original Marks</p>
                            <p className="font-bold text-gray-900 dark:text-white">{request.originalMarks}/{request.maxMarks}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Original Grade</p>
                            <p className="font-bold text-gray-900 dark:text-white">{request.originalGrade}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Reason</p>
                            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-2">{request.reason}</p>
                        </div>
                    </div>

                    {/* Revised Marks */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Revised Marks <span className="text-red-500">*</span> (out of {request.maxMarks})
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={request.maxMarks}
                            value={form.revisedMarks}
                            onChange={(e) => setForm((p) => ({ ...p, revisedMarks: e.target.value }))}
                            className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                    </div>

                    {/* Revised Grade */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Revised Grade <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {GRADES.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setForm((p) => ({ ...p, revisedGrade: g }))}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                        form.revisedGrade === g
                                            ? "bg-emerald-600 text-white border-emerald-600"
                                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Remarks <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={form.remarks}
                            onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))}
                            placeholder="Briefly explain the reason for the revised marks…"
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all"
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
                            disabled={!form.revisedMarks || !form.remarks.trim()}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
                        >
                            <Upload className="size-4" />
                            Upload Result
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadResultModal;
