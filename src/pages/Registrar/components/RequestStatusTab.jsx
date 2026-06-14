// src/pages/Registrar/components/RequestStatusTab.jsx
import React, { useState } from "react";
import {
    FileStack, CalendarDays, ChevronDown, FileText,
    Download, Video, Link2, MessageSquare, Paperclip, XCircle,
} from "lucide-react";
import { StatusBadge, StatusTimeline } from "./shared";

/* ─── LOR-specific extra info ────────────────────────────────────── */
const LorDetails = ({ req }) => {
    if (req.type !== "Letter of Recommendation") return null;

    const meeting = req.meeting;

    return (
        <div className="mt-3 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-3">

            {/* Professor remarks */}
            {req.professorRemarks && (
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Professor's Remarks</p>
                    <p className="text-xs italic text-amber-700 dark:text-amber-400">
                        💬 {req.professorRemarks}
                    </p>
                </div>
            )}

            {/* Rejection doc from professor */}
            {req.rejectionDocFileName && (
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Document from Professor</p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 w-fit">
                        <Paperclip className="size-3.5 text-red-500" />
                        <span className="text-xs text-red-700 dark:text-red-400 font-medium">{req.rejectionDocFileName}</span>
                        <button className="text-xs text-red-600 hover:underline font-bold flex items-center gap-0.5">
                            <Download className="size-3" /> Download
                        </button>
                    </div>
                </div>
            )}

            {/* Final LOR from registrar */}
            {req.lorFileUrl && (
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your LoR (Ready to Download)</p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 w-fit">
                        <FileText className="size-3.5 text-green-600" />
                        <span className="text-xs text-green-700 dark:text-green-400 font-semibold">{req.lorFileUrl}</span>
                        <button className="text-xs text-green-700 hover:underline font-bold flex items-center gap-0.5">
                            <Download className="size-3" /> Download
                        </button>
                    </div>
                </div>
            )}

            {/* Meeting info */}
            {meeting && (
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        <Video className="size-3 inline mr-1" />Discussion Meeting
                    </p>
                    <div className={`rounded-xl border px-3 py-2 space-y-1.5 ${
                        meeting.status === "Accepted"
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : meeting.status === "Cancelled"
                            ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                    }`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                                {meeting.requestedBy === "professor" ? "Professor proposed" : "You requested"} a meeting
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                meeting.status === "Accepted" ? "bg-green-600 text-white" :
                                meeting.status === "Cancelled" ? "bg-gray-400 text-white" :
                                "bg-purple-500 text-white"
                            }`}>
                                {meeting.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {new Date(meeting.proposedDate + "T" + meeting.proposedTime).toLocaleString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                            })}
                        </p>
                        {meeting.meetingLink && (
                            <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                            >
                                <Link2 className="size-3" /> Join Meeting
                            </a>
                        )}
                        {meeting.note && (
                            <p className="text-xs italic text-gray-500 dark:text-gray-400 flex items-start gap-1">
                                <MessageSquare className="size-3 mt-0.5 shrink-0" />{meeting.note}
                            </p>
                        )}
                        {/* Student can accept if professor proposed and it's pending */}
                        {meeting.requestedBy === "professor" && meeting.status === "Pending" && (
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => req._onAcceptMeeting?.(req.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-colors"
                                >
                                    Accept Meeting
                                </button>
                                <button
                                    onClick={() => req._onCancelMeeting?.(req.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-colors"
                                >
                                    <XCircle className="size-3" /> Decline
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Student can request meeting if none exists and status is Pending/Rejected */}
            {!meeting && (req.status === "Pending" || req.status === "Rejected") && (
                <MeetingRequestButton registrarReqId={req.id} onRequest={req._onRequestMeeting} />
            )}
        </div>
    );
};

/* ─── Student meeting request button ─────────────────────────────── */
const MeetingRequestButton = ({ registrarReqId, onRequest }) => {
    const [open, setOpen]             = useState(false);
    const [date, setDate]             = useState("");
    const [time, setTime]             = useState("");
    const [link, setLink]             = useState("");
    const [note, setNote]             = useState("");

    const handleSubmit = () => {
        if (!date || !time) return;
        onRequest?.(registrarReqId, {
            proposedDate: date,
            proposedTime: time,
            meetingLink: link || null,
            note: note || null,
            requestedBy: "student",
        });
        setOpen(false);
        setDate(""); setTime(""); setLink(""); setNote("");
    };

    return (
        <div>
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                    <Video className="size-3.5" /> Request a Discussion Meeting
                </button>
            ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Request a Meeting</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date *</label>
                            <input
                                type="date"
                                value={date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time *</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            <Link2 className="size-3 inline mr-0.5" />Meet Link (optional)
                        </label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://meet.google.com/..."
                            className="w-full px-3 py-2 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Note (optional)</label>
                        <textarea
                            rows={2}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="What would you like to discuss?"
                            className="w-full px-3 py-2 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500 resize-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!date || !time}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                            Send Request
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Main Tab ───────────────────────────────────────────────────── */
const RequestStatusTab = ({ documentRequests, onRequestMeeting, onAcceptMeeting, onCancelMeeting }) => {
    const [filter, setFilter] = useState("All");

    const filterTypes = ["All", ...new Set(documentRequests.map((r) => r.type))];
    const filtered = filter === "All" ? documentRequests : documentRequests.filter((r) => r.type === filter);

    // Inject callbacks into each request so LorDetails can call them
    const enriched = filtered.map((req) => ({
        ...req,
        _onRequestMeeting: onRequestMeeting,
        _onAcceptMeeting:  onAcceptMeeting,
        _onCancelMeeting:  onCancelMeeting,
    }));

    return (
        <div className="space-y-5">
            {/* Filter row */}
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filter by:</span>
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none pl-4 pr-8 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500 font-semibold"
                    >
                        {filterTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                </div>
                <span className="text-xs text-gray-400">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center py-20 text-center">
                    <FileStack className="size-10 text-gray-200 dark:text-gray-700 mb-3" />
                    <p className="text-sm text-gray-400">No requests found.</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Use the Document Requests tab to submit one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enriched.map((req) => (
                        <div key={req.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{req.type}</p>
                                    {req.teacherName && (
                                        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                                            👤 {req.teacherName}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{req.purpose}</p>
                                </div>
                                <StatusBadge status={req.status} />
                            </div>

                            <StatusTimeline status={req.status} />

                            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-400">
                                <CalendarDays className="size-3.5" />
                                <span>Requested:</span>
                                <span className="font-semibold text-gray-600 dark:text-gray-300">
                                    {new Date(req.requestedAt).toLocaleString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric",
                                        hour: "2-digit", minute: "2-digit",
                                    })}
                                </span>
                            </div>

                            {req.remarks && (
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 italic border-t border-gray-100 dark:border-gray-800 pt-2">
                                    📌 {req.remarks}
                                </p>
                            )}

                            {/* LOR-specific extras: remarks, meeting, download */}
                            <LorDetails req={req} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RequestStatusTab;