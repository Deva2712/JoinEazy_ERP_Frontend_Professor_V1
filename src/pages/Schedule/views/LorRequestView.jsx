// src/pages/Schedule/views/LorRequestView.jsx
// Professor's LoR inbox — approve / reject / upload final LoR + request meeting

import React, { useState, useRef } from "react";
import {
    FileText, CheckCircle, XCircle, Upload, Clock,
    Search, ChevronDown, ChevronUp, CalendarDays,
    User, BookOpen, AlertTriangle, Inbox,
    Video, MapPin, Calendar, MessageSquare, X,
} from "lucide-react";
import { lorService } from "@/api/services/Lor.service";

/* ─── Status badge ─────────────────────────────────────────────────────────── */
const LorStatusBadge = ({ status }) => {
    const map = {
        Pending:   "bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-900/20  dark:text-amber-400  dark:border-amber-800",
        Approved:  "bg-green-50  text-green-700  border-green-200  dark:bg-green-900/20  dark:text-green-400  dark:border-green-800",
        Rejected:  "bg-red-50    text-red-700    border-red-200    dark:bg-red-900/20    dark:text-red-400    dark:border-red-800",
        Submitted: "bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-900/20   dark:text-blue-400   dark:border-blue-800",
    };
    const icons = {
        Pending:   <Clock className="size-3 mr-1" />,
        Approved:  <CheckCircle className="size-3 mr-1" />,
        Rejected:  <XCircle className="size-3 mr-1" />,
        Submitted: <Upload className="size-3 mr-1" />,
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${map[status] || "bg-gray-50 border-gray-200 text-gray-600"}`}>
            {icons[status]}{status}
        </span>
    );
};

/* ─── Meeting Request Modal ────────────────────────────────────────────────── */
const MeetingRequestModal = ({ lorRequest, onClose, onSubmit }) => {
    const [subject,      setSubject]      = useState(`LoR Discussion – ${lorRequest.studentName}`);
    const [proposedTime, setProposedTime] = useState("");
    const [meetingMode,  setMeetingMode]  = useState("offline");
    const [notes,        setNotes]        = useState("");
    const [loading,      setLoading]      = useState(false);

    const handleSubmit = async () => {
        if (!proposedTime) return;
        setLoading(true);
        await onSubmit(lorRequest.id, { subject, proposedTime, meetingMode, notes, requestedBy: "professor" });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">Request a Meeting</h3>
                        <p className="text-xs text-gray-500 mt-0.5">With {lorRequest.studentName} · {lorRequest.studentRollNo}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <X className="size-4 text-gray-500" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500"
                        />
                    </div>

                    {/* Proposed Time */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Proposed Date & Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={proposedTime}
                            onChange={(e) => setProposedTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500"
                        />
                    </div>

                    {/* Meeting Mode */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Meeting Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { key: "offline", label: "In-person", icon: MapPin },
                                { key: "online",  label: "Online",    icon: Video  },
                            ].map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setMeetingMode(key)}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                                        meetingMode === key
                                            ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
                                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                                    }`}
                                >
                                    <Icon className="size-4" /> {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Notes (optional)
                        </label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What should the student prepare? Any agenda points…"
                            className="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!proposedTime || loading}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            <Calendar className="size-3.5" />
                            {loading ? "Sending…" : "Send Request"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Meeting history row ──────────────────────────────────────────────────── */
const MeetingRow = ({ mtg }) => {
    const modeIcon = mtg.meetingMode === "online"
        ? <Video className="size-3 text-blue-500" />
        : <MapPin className="size-3 text-gray-400" />;

    const statusColor = {
        Pending:  "text-amber-600 dark:text-amber-400",
        Accepted: "text-green-600 dark:text-green-400",
        Rejected: "text-red-500 dark:text-red-400",
    }[mtg.status] || "text-gray-400";

    return (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700">
            {modeIcon}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{mtg.subject}</p>
                {mtg.proposedTime && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(mtg.proposedTime).toLocaleString("en-IN", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                    </p>
                )}
            </div>
            <span className={`text-[10px] font-bold ${statusColor} shrink-0`}>{mtg.status}</span>
        </div>
    );
};

/* ─── Single LoR card ──────────────────────────────────────────────────────── */
const LorCard = ({ req, onApprove, onReject, onSubmitLor, onRequestMeeting }) => {
    const [expanded,    setExpanded]    = useState(false);
    const [remarksText, setRemarksText] = useState("");
    const [lorFile,     setLorFile]     = useState(null);
    const [actionMode,  setActionMode]  = useState(null); // "approve" | "reject" | "upload"
    const [showMeeting, setShowMeeting] = useState(false);
    const fileRef = useRef();

    const isUrgent   = req.urgency?.toLowerCase().includes("urgent");
    const isPending  = req.status === "Pending";
    const isApproved = req.status === "Approved";
    const meetings   = req.meetingRequests || [];

    const handleAction = () => {
        if (actionMode === "approve") {
            onApprove(req.id, remarksText);
        } else if (actionMode === "reject") {
            if (!remarksText.trim()) return;
            onReject(req.id, remarksText);
        } else if (actionMode === "upload") {
            if (!lorFile) return;
            onSubmitLor(req.id, lorFile, remarksText);
        }
        setActionMode(null);
        setRemarksText("");
        setLorFile(null);
    };

    const actionLabel = actionMode === "approve" ? "Confirm Approve"
        : actionMode === "reject"  ? "Confirm Reject"
        : actionMode === "upload"  ? "Submit LoR"
        : null;

    return (
        <>
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-shadow hover:shadow-md">
                {/* Card header */}
                <div
                    className="flex items-start justify-between gap-3 p-5 cursor-pointer select-none"
                    onClick={() => setExpanded((v) => !v)}
                >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 shrink-0 mt-0.5">
                            <User className="size-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <p className="font-bold text-sm text-gray-900 dark:text-white">{req.studentName}</p>
                                <span className="text-xs text-gray-400 font-mono">{req.studentRollNo}</span>
                                {isUrgent && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                        <AlertTriangle className="size-2.5" /> URGENT
                                    </span>
                                )}
                                {meetings.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        <Calendar className="size-2.5" /> {meetings.length} meeting{meetings.length > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{req.purpose}</p>
                            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-400">
                                <CalendarDays className="size-3" />
                                <span>Deadline:</span>
                                <span className="font-semibold text-gray-600 dark:text-gray-300">
                                    {req.deadline
                                        ? new Date(req.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <LorStatusBadge status={req.status} />
                        {expanded ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
                    </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-4 space-y-4">
                        {/* Purpose */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Purpose</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{req.purpose}</p>
                        </div>

                        {/* Supporting doc from student */}
                        {req.supportingDocFileName && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supporting Document (from student)</p>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-fit">
                                    <FileText className="size-4 text-purple-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{req.supportingDocFileName}</span>
                                </div>
                            </div>
                        )}

                        {/* Professor remarks */}
                        {req.professorRemarks && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Remarks</p>
                                <p className="text-sm italic text-amber-700 dark:text-amber-400">{req.professorRemarks}</p>
                            </div>
                        )}

                        {/* Submitted LoR file */}
                        {req.lorFileUrl && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted LoR</p>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 w-fit">
                                    <CheckCircle className="size-4 text-green-600" />
                                    <span className="text-sm text-green-700 dark:text-green-400 font-semibold">{req.lorFileUrl}</span>
                                </div>
                            </div>
                        )}

                        {/* Meeting history */}
                        {meetings.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Meeting Requests</p>
                                <div className="flex flex-col gap-2">
                                    {meetings.map((m) => <MeetingRow key={m.id} mtg={m} />)}
                                </div>
                            </div>
                        )}

                        {/* Requested at */}
                        <p className="text-[11px] text-gray-400">
                            Requested: {new Date(req.requestedAt).toLocaleString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                            })}
                        </p>

                        {/* Action buttons */}
                        {!actionMode && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {isPending && (
                                    <>
                                        <button
                                            onClick={() => setActionMode("approve")}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors"
                                        >
                                            <CheckCircle className="size-3.5" /> Approve
                                        </button>
                                        <button
                                            onClick={() => setActionMode("reject")}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
                                        >
                                            <XCircle className="size-3.5" /> Reject
                                        </button>
                                    </>
                                )}
                                {(isPending || isApproved) && (
                                    <button
                                        onClick={() => setActionMode("upload")}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors"
                                    >
                                        <Upload className="size-3.5" /> Upload & Submit LoR
                                    </button>
                                )}
                                {/* Meeting request — always available */}
                                <button
                                    onClick={() => setShowMeeting(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-sm font-bold rounded-xl transition-colors"
                                >
                                    <MessageSquare className="size-3.5" /> Request Meeting
                                </button>
                            </div>
                        )}

                        {/* Inline action form */}
                        {actionMode && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                                {actionMode === "upload" && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            LoR Document <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setLorFile(e.target.files[0] || null)}
                                            className="w-full text-sm text-gray-500 dark:text-gray-400
                                                file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
                                                file:text-sm file:font-bold file:bg-rose-50 file:text-rose-700
                                                dark:file:bg-rose-900/30 dark:file:text-rose-300
                                                hover:file:bg-rose-100 cursor-pointer"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        {actionMode === "reject" ? "Reason for rejection *" : "Remarks (optional)"}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={remarksText}
                                        onChange={(e) => setRemarksText(e.target.value)}
                                        placeholder={
                                            actionMode === "reject"
                                                ? "Explain why you are rejecting this request…"
                                                : "Add any notes for the student or registrar…"
                                        }
                                        className="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500 resize-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAction}
                                        disabled={
                                            (actionMode === "reject" && !remarksText.trim()) ||
                                            (actionMode === "upload" && !lorFile)
                                        }
                                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
                                    >
                                        {actionLabel}
                                    </button>
                                    <button
                                        onClick={() => { setActionMode(null); setRemarksText(""); setLorFile(null); }}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Meeting request modal */}
            {showMeeting && (
                <MeetingRequestModal
                    lorRequest={req}
                    onClose={() => setShowMeeting(false)}
                    onSubmit={onRequestMeeting}
                />
            )}
        </>
    );
};

/* ─── Main View ────────────────────────────────────────────────────────────── */
const LorRequestsView = ({ lorRequests = [], onApprove, onReject, onSubmitLor, onRequestMeeting }) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected", "Submitted"];

    const filtered = lorRequests.filter((r) => {
        const matchStatus = filter === "All" || r.status === filter;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            r.studentName?.toLowerCase().includes(q) ||
            r.studentRollNo?.toLowerCase().includes(q) ||
            r.purpose?.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const pendingCount = lorRequests.filter((r) => r.status === "Pending").length;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="size-5 text-rose-600" />
                        LoR Requests
                        {pendingCount > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                                {pendingCount} pending
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Review, approve, reject and submit Letters of Recommendation. Use "Request Meeting" to discuss with the student.
                    </p>
                </div>
            </div>

            {/* Search + filter bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group flex-1">
                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by student name, roll no, or purpose…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500 transition-all"
                    />
                </div>
                <div className="flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl gap-0.5 overflow-x-auto no-scrollbar shrink-0">
                    {STATUS_FILTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                                filter === s
                                    ? "bg-rose-600 text-white shadow"
                                    : "text-gray-500 hover:text-rose-600 dark:text-gray-400"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-20 text-center">
                    <Inbox className="size-12 text-gray-200 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No LoR requests found.</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                        When students request a LoR from you, they'll appear here.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((req) => (
                        <LorCard
                            key={req.id}
                            req={req}
                            onApprove={onApprove}
                            onReject={onReject}
                            onSubmitLor={onSubmitLor}
                            onRequestMeeting={onRequestMeeting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LorRequestsView;