import React, { useState, useRef } from "react";
import { X, Send, CalendarDays } from "lucide-react";
import { EVENT_TYPES } from "../constants/calendar.constants";

const AddEventModal = ({ date, onClose, onAdd }) => {
    const [form, setForm]           = useState({ title: "", type: "personal", time: "", notes: "" });
    const [done, setDone]           = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const submittingRef             = useRef(false);

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleAdd = () => {
        if (!form.title || submittingRef.current) return;
        submittingRef.current = true;
        setSubmitting(true);
        onAdd({ ...form, date: date.toISOString().split("T")[0] });
        setDone(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 shadow-2xl">

                {done ? (
                    /* Success state */
                    <div className="flex flex-col items-center py-8 gap-3">
                        <CalendarDays className="size-12 text-violet-500" />
                        <p className="font-bold text-gray-900 dark:text-white">Event Added!</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Add Event · {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </h3>
                            <button onClick={onClose}>
                                <X className="size-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <input
                                value={form.title}
                                onChange={set("title")}
                                placeholder="Event title *"
                                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-violet-500 text-gray-900 dark:text-white"
                            />
                            <select
                                value={form.type}
                                onChange={set("type")}
                                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-violet-500 text-gray-900 dark:text-white"
                            >
                                {Object.entries(EVENT_TYPES).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                            <input
                                type="time"
                                value={form.time}
                                onChange={set("time")}
                                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-violet-500 text-gray-900 dark:text-white"
                            />
                            <textarea
                                value={form.notes}
                                onChange={set("notes")}
                                rows={2}
                                placeholder="Notes (optional)"
                                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-violet-500 resize-none text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={handleAdd}
                                disabled={submitting || done}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl"
                            >
                                <Send className="size-4" />Add Event
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddEventModal;