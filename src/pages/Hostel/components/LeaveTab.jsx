// src/pages/Hostel/components/LeaveTab.jsx
import React from "react";
import { Clock, AlertCircle } from "lucide-react";
import { StatusBadge, RequestSection, SimpleForm } from "./HostelPrimitives";

const LeaveCard = ({ item }) => (
    <div className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.reason || "Leave request"}</p>
                <p className="text-xs text-gray-400 mt-1">
                    {item.fromDate
                        ? `${item.fromDate}${item.fromTime ? " " + item.fromTime : ""} → ${item.toDate}${item.toTime ? " " + item.toTime : ""}`
                        : new Date(item.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
            </div>
            <StatusBadge status={item.status} />
        </div>
        {item.status === "Pending" && (
            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2">
                <Clock className="size-3.5 flex-shrink-0" />Awaiting warden approval.
            </div>
        )}
        {item.status === "Rejected" && item.rejectionReason && (
            <div className="mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded-r-xl px-3 py-2">
                <AlertCircle className="size-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400">{item.rejectionReason}</p>
            </div>
        )}
    </div>
);

export default function LeaveTab({ leaveRequests, onSubmitLeaveRequest, userProfile }) {
    const fields = [
        { name: "fromDate",      label: "From Date",      type: "date",     required: true  },
        { name: "fromTime",      label: "From Time",      type: "time",     required: true  },
        { name: "toDate",        label: "To Date",        type: "date",     required: true  },
        { name: "toTime",        label: "To Time",        type: "time",     required: true  },
        { name: "reason",        label: "Reason",         type: "textarea", required: true,  placeholder: "Reason for leave…" },
        { name: "parentContact", label: "Parent Contact", type: "text",     required: false, readonly: true, defaultValue: userProfile.parentContact || "" },
    ];

    return (
        <RequestSection
            newContent={
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                    <SimpleForm fields={fields} onSubmit={onSubmitLeaveRequest} submitLabel="Submit Leave Request" />
                </div>
            }
            items={leaveRequests}
            renderItem={(item) => <LeaveCard key={item.id} item={item} />}
            accentColor="blue"
        />
    );
}