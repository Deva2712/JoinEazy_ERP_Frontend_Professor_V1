// src/pages/StudentCourses/views/registration/RegistrationDone.jsx
import React, { useState } from "react";
import {
    CheckCircle, ClipboardList, X, Edit2, Save, Clock, Lock,
    BookOpen, Tag, Award,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";
import StatusBadge from "../../components/StatusBadge";

function RegistrationRow({ reg, isPastDue, onCancel, electiveCourses, onSwapElective }) {
    const [editing, setEditing] = useState(false);
    const [swapTo,  setSwapTo]  = useState("");

    const canEdit   = reg.status === "Pending" && !isPastDue && reg.isElective;
    const canCancel = reg.status === "Pending" && !isPastDue;

    const handleSwap = () => {
        if (swapTo && swapTo !== reg.courseId.toString()) {
            onSwapElective(reg.id, swapTo);
            setEditing(false);
            setSwapTo("");
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Priority number */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    {reg.priority != null ? (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-extrabold flex items-center justify-center mt-0.5">
                            {reg.priority}
                        </div>
                    ) : reg.isCompulsory ? (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center mt-0.5">
                            <BookOpen className="size-3.5" />
                        </div>
                    ) : null}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{reg.title}</h3>
                            <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">{reg.courseCode}</span>
                            {reg.isCompulsory && (
                                <span className="px-2 py-0.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800 flex items-center gap-1">
                                    <BookOpen className="size-3" />Compulsory
                                </span>
                            )}
                            {reg.isElective && reg.priority != null && (
                                <span className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                                    <Tag className="size-3" />
                                    {["1st","2nd","3rd","4th","5th"][reg.priority - 1]} Priority
                                </span>
                            )}
                            <StatusBadge status={reg.status} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {reg.instructor} · <span className="font-semibold">{reg.credits} Credits</span>
                        </p>
                        {reg.adminRemarks && (
                            <p className="text-xs text-gray-400 mt-1 italic">"{reg.adminRemarks}"</p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1">
                            Applied {new Date(reg.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                {!isPastDue && (
                    <div className="flex items-center gap-2 shrink-0">
                        {canEdit && !editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-bold rounded-xl transition-colors"
                            >
                                <Edit2 className="size-3" />Change
                            </button>
                        )}
                        {canCancel && (
                            <button
                                onClick={() => onCancel(reg.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold rounded-xl transition-colors"
                            >
                                <X className="size-3" />Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Elective swap editor */}
            {editing && electiveCourses?.length > 0 && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <select
                        value={swapTo}
                        onChange={(e) => setSwapTo(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-400 text-gray-800 dark:text-gray-200"
                    >
                        <option value="">Select a different elective…</option>
                        {electiveCourses.map((c) => (
                            <option key={c.id} value={c.id} disabled={c.id === reg.courseId}>
                                {c.title} ({c.courseCode}) — {c.credits} Credits
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSwap}
                        disabled={!swapTo || swapTo === reg.courseId.toString()}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                        <Save className="size-3" />Save
                    </button>
                    <button
                        onClick={() => { setEditing(false); setSwapTo(""); }}
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 text-xs font-bold rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default function RegistrationDone({
    myRegistrations,
    registrationConfig,
    registrationCourses,
    onCancelRegistration,
    onSwapElective,
}) {
    const isPastDue = registrationConfig?.windowEnd
        ? new Date() > new Date(registrationConfig.windowEnd)
        : false;

    const electiveCourses = registrationCourses?.filter((c) => c.isElective) ?? [];
    const totalCredits    = myRegistrations.reduce((sum, r) => sum + (r.credits || 0), 0);

    // Sort: compulsory first, then electives by priority
    const sortedRegistrations = [...myRegistrations].sort((a, b) => {
        if (a.isCompulsory && !b.isCompulsory) return -1;
        if (!a.isCompulsory && b.isCompulsory) return 1;
        if (a.priority != null && b.priority != null) return a.priority - b.priority;
        return 0;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* ── Success banner — compact ── */}
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full shrink-0 self-start sm:self-center">
                    <CheckCircle className="size-7 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Registration Submitted!</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                        Your registration is pending admin approval. You'll be notified once confirmed.
                    </p>
                </div>
                {/* Window status pill */}
                {!isPastDue && registrationConfig?.windowEnd ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl shrink-0">
                        <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 whitespace-nowrap">
                            Changes until {formatDate(registrationConfig.windowEnd)}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shrink-0">
                        <Lock className="size-3.5 text-gray-400" />
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">Window closed</p>
                    </div>
                )}
            </div>

            {/* Summary strip */}
            {myRegistrations.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Courses",       value: myRegistrations.length,                                        icon: ClipboardList },
                        { label: "Total Credits", value: totalCredits,                                                  icon: Award         },
                        { label: "Pending",       value: myRegistrations.filter((r) => r.status === "Pending").length,  icon: Clock         },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center gap-1">
                            <Icon className="size-4 text-blue-500 mb-0.5" />
                            <p className="text-xl font-extrabold text-gray-900 dark:text-white">{value}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Registration list */}
            {myRegistrations.length > 0 && (
                <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <ClipboardList className="size-4 text-blue-600" />My Registrations
                    </h2>
                    <div className="space-y-2">
                        {sortedRegistrations.map((reg) => (
                            <RegistrationRow
                                key={reg.id}
                                reg={reg}
                                isPastDue={isPastDue}
                                onCancel={onCancelRegistration}
                                electiveCourses={electiveCourses}
                                onSwapElective={onSwapElective}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}