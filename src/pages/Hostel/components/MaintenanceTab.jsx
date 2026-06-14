// src/pages/Hostel/components/MaintenanceTab.jsx
import React, { useState } from "react";
import { Wrench, CheckCircle, RefreshCw } from "lucide-react";
import { StatusBadge, ContactBanner, RequestSection, SimpleForm } from "./HostelPrimitives";

const MaintenanceTimeline = ({ steps = [] }) => {
    if (!steps.length) return <p className="text-xs text-gray-400 dark:text-gray-500">No progress updates yet.</p>;

    return (
        <div className="pl-1">
            {steps.map((step, i) => {
                const isDone   = !!step.completedAt;
                const isActive = !isDone && steps.slice(0, i).every((s) => !!s.completedAt);
                const isLast   = i === steps.length - 1;
                return (
                    <div key={i} className="flex items-start gap-3 relative">
                        {!isLast && (
                            <div
                                className={`absolute left-3.5 top-7 w-0.5 ${isDone ? "bg-green-400 dark:bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
                                style={{ height: "calc(100% - 4px)" }}
                            />
                        )}
                        <div className={`size-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                            isDone   ? "bg-green-50 border-green-500 text-green-600 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400"
                            : isActive ? "bg-blue-50 border-blue-400 text-blue-500 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-400"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        }`}>
                            {isDone   && <CheckCircle className="size-3.5" />}
                            {isActive && <RefreshCw   className="size-3.5 animate-spin" />}
                            {!isDone && !isActive && <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
                        </div>
                        <div className={`pb-5 flex-1 ${isLast ? "pb-0" : ""}`}>
                            <p className={`text-xs font-semibold leading-tight ${isDone ? "text-gray-800 dark:text-gray-200" : isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"}`}>
                                {step.label}
                            </p>
                            {(step.completedAt || step.note) && (
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                    {[step.completedAt, step.note].filter(Boolean).join(" · ")}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const MaintenanceCard = ({ item }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button onClick={() => setOpen((v) => !v)} className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.description || "Maintenance request"}</p>
                    <div className="flex items-center gap-2 mt-1">
                        {item.category && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.category}</span>
                        )}
                        <span className="text-xs text-gray-400">{new Date(item.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={item.status} />
                    <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
                </div>
            </button>
            {open && (
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Progress</p>
                    <MaintenanceTimeline steps={item.steps} />
                </div>
            )}
        </div>
    );
};

const FIELDS = [
    { name: "category",    label: "Category",    type: "text",     required: true,  placeholder: "e.g. Electrical, Plumbing, Furniture" },
    { name: "description", label: "Description", type: "textarea", required: true,  placeholder: "Describe the issue…" },
    {
        name: "priority",
        label: "Priority",
        type: "select",
        required: false,
        placeholder: "Select priority",
        options: [
            { value: "Low",    label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High",   label: "High" },
        ],
    },
];

export default function MaintenanceTab({ maintenanceRequests, onSubmitMaintenance, maintenanceDept }) {
    return (
        <RequestSection
            newContent={
                <>
                    <ContactBanner icon={Wrench} label="Maintenance Department" name={maintenanceDept.name} phone={maintenanceDept.contact} email={maintenanceDept.email} color="blue" />
                    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <SimpleForm fields={FIELDS} onSubmit={onSubmitMaintenance} submitLabel="Submit Request" />
                    </div>
                </>
            }
            items={maintenanceRequests}
            renderItem={(item) => <MaintenanceCard key={item.id} item={item} />}
            accentColor="blue"
        />
    );
}