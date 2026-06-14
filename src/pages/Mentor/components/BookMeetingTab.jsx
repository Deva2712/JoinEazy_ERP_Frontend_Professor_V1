// src/pages/Mentor/components/BookMeetingTab.jsx
import React from "react";
import { SimpleForm } from "./MentorPrimitives";

const FIELDS = [
    { name: "preferredDate", label: "Preferred Date",    type: "date",     required: true },
    { name: "preferredTime", label: "Preferred Time",    type: "time",     required: true },
    { name: "mode",          label: "Mode",              type: "select",   required: true, options: ["Offline", "Online"] },
    { name: "agenda",        label: "Agenda / Purpose",  type: "textarea", required: true, placeholder: "What would you like to discuss?" },
];

export default function BookMeetingTab({ onRequestMeeting }) {
    return (
        <div className="animate-in fade-in duration-300 flex flex-col items-center">
            <div className="w-full max-w-lg">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 text-center">Request a Meeting</h2>
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                    <SimpleForm
                        fields={FIELDS}
                        onSubmit={onRequestMeeting}
                        submitLabel="Send Meeting Request"
                        successMessage="Meeting request sent!"
                    />
                </div>
                <p className="text-xs text-center text-gray-400 mt-3">
                    Your request will appear in the{" "}
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">Requested Meetings</span> tab once sent.
                </p>
            </div>
        </div>
    );
}