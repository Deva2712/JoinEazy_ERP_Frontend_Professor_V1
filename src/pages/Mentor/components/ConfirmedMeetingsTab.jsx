// src/pages/Mentor/components/ConfirmedMeetingsTab.jsx
import React from "react";
import { CheckSquare } from "lucide-react";
import { StatusBadge } from "./MentorPrimitives";

const MeetingCard = ({ m }) => (
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={m.status} />
            <StatusBadge status={m.mode} />
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(m.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {new Date(m.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{m.location}</p>
        {m.meetLink && (
            <a href={m.meetLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 underline">
                Join Meeting
            </a>
        )}
        {m.notes && <p className="text-xs text-gray-400 italic">"{m.notes}"</p>}
        {m.rescheduleDate && (
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Rescheduled to: {new Date(m.rescheduleDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </p>
        )}
    </div>
);

const CONFIRMED_STATUSES = new Set(["Completed", "Upcoming", "Accepted", "Rescheduled"]);

export default function ConfirmedMeetingsTab({ meetings }) {
    const confirmed = meetings.filter((m) => CONFIRMED_STATUSES.has(m.status));

    if (!confirmed.length) {
        return (
            <div className="text-center py-20">
                <CheckSquare className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No confirmed meetings yet.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmed.map((m) => <MeetingCard key={m.id} m={m} />)}
        </div>
    );
}