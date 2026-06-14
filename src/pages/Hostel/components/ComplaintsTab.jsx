// src/pages/Hostel/components/ComplaintsTab.jsx
import React from "react";
import { ShieldAlert, Clock, RefreshCw } from "lucide-react";
import { StatusBadge, ContactBanner, RequestSection, SimpleForm } from "./HostelPrimitives";

const ComplaintCard = ({ item }) => (
    <div className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.subject || "Complaint"}</p>
                {item.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
            </div>
            <StatusBadge status={item.status} />
        </div>
        {(item.status === "Pending" || item.status === "Open") && (
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                <Clock className="size-3.5 flex-shrink-0" />Under review by hostel administration.
            </div>
        )}
        {item.status === "In Progress" && (
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                <RefreshCw className="size-3.5 flex-shrink-0" />Being actively addressed.
            </div>
        )}
    </div>
);

const FIELDS = [
    { name: "subject",     label: "Subject",            type: "text",     required: true  },
    { name: "description", label: "Description",        type: "textarea", required: true,  placeholder: "Detailed description…" },
    { name: "against",     label: "Against (optional)", type: "text",     required: false, placeholder: "Person / Department (if applicable)" },
];

export default function ComplaintsTab({ complaints, onSubmitComplaint, antiRaggingDept }) {
    return (
        <RequestSection
            newContent={
                <>
                    <ContactBanner icon={ShieldAlert} label="Anti-Ragging Committee" name={antiRaggingDept.name} phone={antiRaggingDept.contact} email={antiRaggingDept.email} color="red" />
                    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <SimpleForm fields={FIELDS} onSubmit={onSubmitComplaint} submitLabel="Submit Complaint" />
                    </div>
                </>
            }
            items={complaints}
            renderItem={(item) => <ComplaintCard key={item.id} item={item} />}
            accentColor="blue"
        />
    );
}