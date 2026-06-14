// src/pages/Mentor/components/MentorPrimitives.jsx
import React, { useState } from "react";
import { Star, CheckCircle, Send } from "lucide-react";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
    Pending:     "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Rejected:    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Accepted:    "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Rescheduled: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    Completed:   "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Upcoming:    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Online:      "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    Offline:     "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

export const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_STYLES[status] ?? STATUS_STYLES.Offline}`}>
        {status}
    </span>
);

// ── Star rating ───────────────────────────────────────────────────────────────

export const StarRating = ({ value, onChange, readonly = false }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
            <button
                key={s}
                onClick={() => !readonly && onChange?.(s)}
                disabled={readonly}
                className={`transition-transform ${readonly ? "cursor-default" : "hover:scale-110"}`}
            >
                <Star className={`size-${readonly ? "4" : "6"} ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
            </button>
        ))}
    </div>
);

// ── Simple form ───────────────────────────────────────────────────────────────

export const SimpleForm = ({ fields, onSubmit, submitLabel = "Submit", successMessage = "Submitted!" }) => {
    const [form,      setForm]      = useState(Object.fromEntries(fields.map((f) => [f.name, ""])));
    const [submitted, setSubmitted] = useState(false);
    const [errors,    setErrors]    = useState({});

    const handleSubmit = async () => {
        const newErrors = {};
        fields.filter((f) => f.required).forEach((f) => {
            if (!form[f.name]) newErrors[f.name] = "Required";
        });
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        const ok = await onSubmit(form);
        if (ok !== false) {
            setForm(Object.fromEntries(fields.map((f) => [f.name, ""])));
            setErrors({});
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    const inputCls = (name) =>
        `w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:border-cyan-500 transition-colors ${errors[name] ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`;

    return (
        <div className="space-y-4">
            {submitted && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-semibold">
                    <CheckCircle className="size-4 shrink-0" />{successMessage}
                </div>
            )}
            {fields.map((f) => (
                <div key={f.name}>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {f.type === "textarea" ? (
                        <textarea
                            rows={3}
                            value={form[f.name]}
                            onChange={(e) => { setForm((p) => ({ ...p, [f.name]: e.target.value })); setErrors((p) => ({ ...p, [f.name]: "" })); }}
                            placeholder={f.placeholder || ""}
                            className={`${inputCls(f.name)} resize-none`}
                        />
                    ) : f.type === "select" ? (
                        <select
                            value={form[f.name]}
                            onChange={(e) => { setForm((p) => ({ ...p, [f.name]: e.target.value })); setErrors((p) => ({ ...p, [f.name]: "" })); }}
                            className={inputCls(f.name)}
                        >
                            <option value="">Select...</option>
                            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ) : (
                        <input
                            type={f.type || "text"}
                            value={form[f.name]}
                            onChange={(e) => { setForm((p) => ({ ...p, [f.name]: e.target.value })); setErrors((p) => ({ ...p, [f.name]: "" })); }}
                            placeholder={f.placeholder || ""}
                            className={inputCls(f.name)}
                        />
                    )}
                    {errors[f.name] && <p className="text-xs text-red-500 mt-1">{errors[f.name]}</p>}
                </div>
            ))}
            <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
                <Send className="size-3.5" />{submitLabel}
            </button>
        </div>
    );
};