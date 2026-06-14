// src/pages/Hostel/components/HostelPrimitives.jsx
import React, { useState } from "react";
import { CheckCircle, XCircle, RefreshCw, Send, Clock, AlertCircle } from "lucide-react";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
    Pending:       "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Approved:      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Rejected:      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Open:          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Resolved:      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
};

export const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>
        {status}
    </span>
);

// ── Contact banner ────────────────────────────────────────────────────────────

import { Phone, Mail } from "lucide-react";

export const ContactBanner = ({ icon: Icon, label, name, phone, email, color = "blue" }) => (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-100 dark:border-${color}-800 rounded-xl px-4 py-3.5 mb-5`}>
        <div className="flex items-start gap-3">
            <div className={`size-8 rounded-lg bg-${color}-100 dark:bg-${color}-900/40 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`size-4 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold text-${color}-600 dark:text-${color}-400 uppercase tracking-wider mb-1`}>{label}</p>
                {name  && <p className={`text-sm font-bold text-${color}-800 dark:text-${color}-200 mb-1.5`}>{name}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {phone && (
                        <a href={`tel:${phone}`} className={`flex items-center gap-1.5 text-xs font-medium text-${color}-700 dark:text-${color}-300 hover:underline`}>
                            <Phone className="size-3 flex-shrink-0" />{phone}
                        </a>
                    )}
                    {email && (
                        <a href={`mailto:${email}`} className={`flex items-center gap-1.5 text-xs font-medium text-${color}-700 dark:text-${color}-300 hover:underline`}>
                            <Mail className="size-3 flex-shrink-0" />{email}
                        </a>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// ── Simple form ───────────────────────────────────────────────────────────────

export const SimpleForm = ({ fields, onSubmit, submitLabel = "Submit" }) => {
    const init = Object.fromEntries(fields.map((f) => [f.name, f.defaultValue || ""]));
    const [form,      setForm]      = useState(init);
    const [submitted, setSubmitted] = useState(false);
    const [errors,    setErrors]    = useState({});

    // Keep readonly fields in sync if defaultValues change (e.g. profile loaded async)
    React.useEffect(() => {
        setForm((prev) => {
            const next = { ...prev };
            fields.forEach((f) => {
                if (f.readonly) next[f.name] = f.defaultValue || "";
            });
            return next;
        });
    }, [fields.map((f) => f.defaultValue).join(",")]);

    const handleSubmit = async () => {
        const newErrors = {};
        fields.filter((f) => f.required && !f.readonly).forEach((f) => {
            if (!form[f.name]) newErrors[f.name] = "Required";
        });
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        const ok = await onSubmit(form);
        if (ok !== false) {
            setForm(Object.fromEntries(fields.map((f) => [f.name, f.readonly ? form[f.name] : (f.defaultValue || "")])));
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }
        setErrors({});
    };

    const inputCls = (f) =>
        `w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white border rounded-xl outline-none transition-colors ${
            f.readonly
                ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-default"
                : `bg-gray-50 dark:bg-gray-800 focus:border-blue-500 ${errors[f.name] ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`
        }`;

    return (
        <div className="space-y-4">
            {submitted && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 text-sm font-semibold">
                    <CheckCircle className="size-4 flex-shrink-0" />Request submitted successfully!
                </div>
            )}
            {fields.map((f) => (
                <div key={f.name}>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        {f.label}
                        {f.required && !f.readonly && <span className="text-red-500 ml-1">*</span>}
                        {f.readonly && <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case">(auto-filled)</span>}
                    </label>
                    {f.type === "textarea" ? (
                        <textarea
                            rows={3}
                            value={form[f.name]}
                            readOnly={f.readonly}
                            onChange={(e) => { if (!f.readonly) { setForm((p) => ({ ...p, [f.name]: e.target.value })); setErrors((p) => ({ ...p, [f.name]: "" })); } }}
                            placeholder={f.placeholder || ""}
                            className={`${inputCls(f)} resize-none`}
                        />
                    ) : f.type === "select" ? (
                        <select
                            value={form[f.name]}
                            readOnly={f.readonly}
                            onChange={(e) => { if (!f.readonly) { setForm((p) => ({ ...p, [f.name]: e.target.value })); setErrors((p) => ({ ...p, [f.name]: "" })); } }}
                            className={inputCls(f)}
                        >
                            <option value="">{f.placeholder || "Select an option"}</option>
                            {(f.options || []).map((option) => (
                                <option key={option.value || option} value={option.value || option}>
                                    {option.label || option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={f.type || "text"}
                            value={form[f.name]}
                            readOnly={f.readonly}
                            onChange={(e) => { if (!f.readonly) { setForm((p) => ({ ...p, [f.name]: e.target.value })); setErrors((p) => ({ ...p, [f.name]: "" })); } }}
                            placeholder={f.placeholder || ""}
                            className={inputCls(f)}
                        />
                    )}
                    {errors[f.name] && <p className="text-xs text-red-500 mt-1">{errors[f.name]}</p>}
                </div>
            ))}
            <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
                <Send className="size-3.5" />{submitLabel}
            </button>
        </div>
    );
};

// ── Bucketed request list (Approved / Pending / Rejected grouping) ─────────────

const BUCKETS = [
    { key: "Approved", label: "Approved", color: "text-green-600 dark:text-green-400",  dot: "bg-green-500",  match: (s) => s === "Approved" || s === "Resolved" },
    { key: "Pending",  label: "Pending",  color: "text-yellow-600 dark:text-yellow-400", dot: "bg-yellow-500", match: (s) => s === "Pending"  || s === "Open" || s === "In Progress" },
    { key: "Rejected", label: "Rejected", color: "text-red-600 dark:text-red-400",       dot: "bg-red-500",    match: (s) => s === "Rejected" },
];

export const BucketedList = ({ items, renderItem }) => {
    if (!items.length) {
        return <p className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No requests submitted yet.</p>;
    }
    return (
        <div className="space-y-8 mt-6">
            {BUCKETS.map(({ key, label, color, dot, match }) => {
                const bucket = items.filter((i) => match(i.status));
                if (!bucket.length) return null;
                return (
                    <div key={key}>
                        <div className={`flex items-center gap-2 mb-3 ${color}`}>
                            <span className={`size-2 rounded-full ${dot}`} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">{label}</h3>
                            <span className="text-xs font-bold opacity-60">({bucket.length})</span>
                        </div>
                        <div className="space-y-3">{bucket.map(renderItem)}</div>
                    </div>
                );
            })}
        </div>
    );
};

// ── New / My requests sub-tab shell ──────────────────────────────────────────

export const RequestSection = ({ newContent, items, renderItem, accentColor = "blue" }) => {
    const [tab, setTab] = useState("new");
    const active   = `bg-white dark:bg-[#1a1d26] text-${accentColor}-600 dark:text-${accentColor}-400 shadow-sm`;
    const inactive = "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200";

    return (
        <div className="animate-in fade-in duration-300 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
                    {[
                        { key: "new",      label: "New request", icon: Send          },
                        { key: "requests", label: "My requests", icon: CheckCircle,  count: items.length },
                    ].map(({ key, label, icon: Icon, count }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === key ? active : inactive}`}
                        >
                            <Icon className="size-4" />{label}
                            {count > 0 && (
                                <span className={`ml-1 bg-${accentColor}-100 dark:bg-${accentColor}-900/40 text-${accentColor}-600 dark:text-${accentColor}-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                {tab === "new"      && newContent}
                {tab === "requests" && <BucketedList items={items} renderItem={renderItem} />}
            </div>
        </div>
    );
};