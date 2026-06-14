// src/pages/Mentor/components/RequestedMeetingsTab.jsx
import React from "react";
import { ClipboardList } from "lucide-react";
import { StatusBadge } from "./MentorPrimitives";

const RequestCard = ({ req }) => (
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={req.status} />
            <StatusBadge status={req.mode} />
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{req.agenda}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
            {req.preferredDate} · {req.preferredTime}
        </p>
        {req.status === "Rejected" && req.rejectionReason && (
            <p className="text-xs text-red-500 dark:text-red-400 italic">Reason: {req.rejectionReason}</p>
        )}
    </div>
);

export default function RequestedMeetingsTab({ meetingRequests }) {
    if (!meetingRequests.length) {
        return (
            <div className="text-center py-20">
                <ClipboardList className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No meeting requests yet.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetingRequests.map((req) => <RequestCard key={req.id} req={req} />)}
        </div>
    );
}