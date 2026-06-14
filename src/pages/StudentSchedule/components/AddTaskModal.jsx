import React, { useState } from "react";
import { Plus, X, BrainCircuit, Bell } from "lucide-react";

const AddTaskModal = ({ onClose, onAdd }) => {
    const [form, setForm] = useState({
        type: "study",
        title: "",
        time: "06:00 PM",
        duration: 60,
    });

    const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = () => {
        if (!form.title.trim()) return;
        onAdd(form);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Plus className="size-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add to Today's Plan</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="size-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Type */}
                    <div className="flex gap-3">
                        {[
                            { value: "study",    label: "Study Session", icon: BrainCircuit, color: "emerald" },
                            { value: "reminder", label: "Reminder",       icon: Bell,         color: "amber"   },
                        ].map(({ value, label, icon: Icon, color }) => (
                            <button
                                key={value}
                                onClick={() => update("type", value)}
                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                    form.type === value
                                        ? color === "emerald"
                                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                            : "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Icon className={`size-5 ${form.type === value ? (color === "emerald" ? "text-emerald-600" : "text-amber-600") : "text-gray-400"}`} />
                                <span className={`text-xs font-bold ${form.type === value ? (color === "emerald" ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400") : "text-gray-500"}`}>
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            placeholder={form.type === "study" ? "e.g. Revise Trees chapter" : "e.g. Submit assignment"}
                            className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Time + Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Time</label>
                            <input
                                type="time"
                                onChange={(e) => {
                                    const [h, min] = e.target.value.split(":").map(Number);
                                    const suffix = h >= 12 ? "PM" : "AM";
                                    const h12 = h % 12 || 12;
                                    update("time", `${String(h12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${suffix}`);
                                }}
                                className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Duration (min)</label>
                            <input
                                type="number"
                                min={5}
                                max={480}
                                step={5}
                                value={form.duration}
                                onChange={(e) => update("duration", Number(e.target.value))}
                                className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
                    <button onClick={onClose} className="flex-1 h-11 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!form.title.trim()}
                        className="flex-1 h-11 flex items-center justify-center gap-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all"
                    >
                        <Plus className="size-4" /> Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;