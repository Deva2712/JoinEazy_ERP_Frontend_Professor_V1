// src/pages/Mentor/MentorUI.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowLeft, RefreshCw, AlertTriangle, User, CheckSquare, ClipboardList, Video, MessageSquare } from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import StatSummaryCard     from "../../components/common/StatSummaryCard";

import MentorDetailsTab      from "./components/MentorDetailsTab";
import ConfirmedMeetingsTab  from "./components/ConfirmedMeetingsTab";
import RequestedMeetingsTab  from "./components/RequestedMeetingsTab";
import BookMeetingTab        from "./components/BookMeetingTab";
import FeedbackTab           from "./components/FeedbackTab";

const TABS = [
    { key: "mentor",    label: "Mentor Details",     Icon: User          },
    { key: "confirmed", label: "Confirmed Meetings", Icon: CheckSquare   },
    { key: "requested", label: "Requested Meetings", Icon: ClipboardList },
    { key: "book",      label: "Book a Meeting",     Icon: Video         },
    { key: "feedback",  label: "Feedback",           Icon: MessageSquare },
];

const CONFIRMED_STATUSES = new Set(["Completed", "Upcoming", "Accepted", "Rescheduled"]);

export default function MentorUI({
    loading = false,
    error = null,
    onRetry = () => {},
    mentor = null,
    meetings = [],
    feedbackHistory = [],
    meetingRequests = [],
    onRequestMeeting = () => {},
    onSubmitFeedback = () => {},
}) {
    const navigate    = useNavigate();
    const [activeTab, setActiveTab] = useState("mentor");

    const confirmedCount = meetings.filter((m) => CONFIRMED_STATUSES.has(m.status)).length;

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex justify-center py-32"><RefreshCw className="size-10 animate-spin text-cyan-600" /></div>
            <BottomNavController /><FooterController />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <AlertTriangle className="size-10 text-red-600 mb-4" />
                <h2 className="text-xl font-bold dark:text-white mb-2">Failed to load</h2>
                <button onClick={onRetry} className="mt-4 bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold">Try Again</button>
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* Banner */}
            <div className="bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-900 dark:via-sky-900 dark:to-blue-900 text-white">
                <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
                    <div className="flex items-center justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                                <ArrowLeft className="size-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Mentor</h1>
                                <p className="text-white/70 text-sm mt-0.5">Your assigned mentor, meetings &amp; feedback.</p>
                            </div>
                        </div>
                        {mentor && (
                            <div className="pb-2 md:pb-0">
                                <StatSummaryCard label="Meetings" value={confirmedCount.toString()} icon={Users} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto">
                        {TABS.map(({ key, label, Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                                    activeTab === key
                                        ? "bg-gray-50 dark:bg-[#0f1117] text-cyan-600 dark:text-cyan-400"
                                        : "text-white/70 hover:bg-white/10"
                                }`}
                            >
                                <Icon className="size-4" />{label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
                {activeTab === "mentor"    && <MentorDetailsTab     mentor={mentor} />}
                {activeTab === "confirmed" && <ConfirmedMeetingsTab meetings={meetings} />}
                {activeTab === "requested" && <RequestedMeetingsTab meetingRequests={meetingRequests} />}
                {activeTab === "book"      && <BookMeetingTab       onRequestMeeting={onRequestMeeting} />}
                {activeTab === "feedback"  && <FeedbackTab          feedbackHistory={feedbackHistory} onSubmitFeedback={onSubmitFeedback} />}
            </main>

            <BottomNavController />
            <FooterController />
        </div>
    );
}