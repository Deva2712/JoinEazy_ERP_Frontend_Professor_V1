// src/pages/Registrar/components/LorTab.jsx
// Shared LoR tab — renders student view or professor view based on role.
// Both read/write from the same _lorRequests mock array → synced.

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileSignature, CheckCircle, XCircle, Upload, Clock,
    Search, ChevronDown, ChevronUp, CalendarDays, User,
    AlertTriangle, Inbox, Video, MapPin, FileText,
} from "lucide-react";

/* ─────────────────────── shared atoms ──────────────────────────────────── */

const StatusBadge = ({ status }) => {
    const styles = {
        Pending:   "bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-900/20 dark:text-amber-400  dark:border-amber-800",
        Approved:  "bg-green-50  text-green-700  border-green-200  dark:bg-green-900/20 dark:text-green-400  dark:border-green-800",
        Rejected:  "bg-red-50    text-red-700    border-red-200    dark:bg-red-900/20   dark:text-red-400    dark:border-red-800",
        Submitted: "bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-900/20  dark:text-blue-400   dark:border-blue-800",
    };
    const icons = {
        Pending:   <Clock className="size-3 mr-1" />,
        Approved:  <CheckCircle className="size-3 mr-1" />,
        Rejected:  <XCircle className="size-3 mr-1" />,
        Submitted: <Upload className="size-3 mr-1" />,
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${styles[status] || "bg-gray-50 border-gray-200 text-gray-600"}`}>
            {icons[status]}{status}
        </span>
    );
};

/* ─────────────────────── Schedule Meeting Modal ─────────────────────────── */
// Lightweight inline modal to schedule a meeting about this LoR

const ScheduleMeetingModal = ({ lorReq, currentUserRole, onConfirm, onClose }) => {
    const [dateTime, setDateTime]   = useState("");
    const [mode, setMode]           = useState("offline");
    const [venue, setVenue]         = useState("");
    const [link, setLink]           = useState("");
    const [agenda, setAgenda]       = useState(`Discussion regarding LoR request for: ${lorReq.purpose}`);

    const minStr = (() => { const d = new Date(); d.setMinutes(d.getMinutes() + 30); return d.toISOString().slice(0, 16); })();

    const canSubmit = dateTime && ((mode === "offline" && venue) || (mode === "online" && link));

    const handleSubmit = () => {
        if (!canSubmit) return;
        onConfirm({
            lorId: lorReq.id,
            studentName: lorReq.studentName,
            professorName: lorReq.teacherName || "Professor",
            subject: `LoR Discussion — ${lorReq.studentName}`,
            requestedTime: new Date(dateTime).toISOString(),
            mode,
            venue: mode === "offline" ? venue : null,
            link:  mode === "online"  ? link  : null,
            reason: agenda,
            status: "pending",
            createdAt: new Date().toISOString(),
            initiatedBy: currentUserRole,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                            <Video className="size-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Schedule LoR Meeting</h3>
                            <p className="text-xs text-gray-400">{lorReq.studentName} · {lorReq.purpose?.slice(0, 40)}…</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <XCircle className="size-4 text-gray-400" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Date-time */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date & Time *</label>
                        <input type="datetime-local" min={minStr} value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Mode toggle */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                            {["offline", "online"].map((m) => (
                                <button key={m} onClick={() => setMode(m)}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-purple-600 text-white" : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}
                                >
                                    {m === "offline" ? <MapPin className="size-3.5" /> : <Video className="size-3.5" />}
                                    {m.charAt(0).toUpperCase() + m.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Venue / Link */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            {mode === "offline" ? "Venue *" : "Meeting Link *"}
                        </label>
                        {mode === "offline" ? (
                            <input type="text" placeholder="e.g. Room 301, Block A" value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-purple-500"
                            />
                        ) : (
                            <input type="url" placeholder="https://meet.google.com/..." value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-purple-500"
                            />
                        )}
                    </div>

                    {/* Agenda */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Agenda</label>
                        <textarea rows={2} value={agenda} onChange={(e) => setAgenda(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-purple-500 resize-none"
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={!canSubmit}
                        className="flex-1 py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm transition-colors">
                        Schedule Meeting
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────── Professor LoR Card ─────────────────────────────── */

const ProfessorLorCard = ({ req, onApprove, onReject, onSubmitLor, onScheduleMeeting }) => {
    const [expanded, setExpanded]     = useState(false);
    const [actionMode, setActionMode] = useState(null); // "approve"|"reject"|"upload"|"meeting"
    const [remarks, setRemarks]       = useState("");
    const [lorFile, setLorFile]       = useState(null);
    const fileRef = useRef();

    const isPending  = req.status === "Pending";
    const isApproved = req.status === "Approved";
    const isUrgent   = req.urgency?.toLowerCase().includes("urgent");

    const handleAction = () => {
        if (actionMode === "approve") onApprove(req.id, remarks);
        else if (actionMode === "reject") { if (!remarks.trim()) return; onReject(req.id, remarks); }
        else if (actionMode === "upload") { if (!lorFile) return; onSubmitLor(req.id, lorFile, remarks); }
        setActionMode(null); setRemarks(""); setLorFile(null);
    };

    return (
        <>
            {actionMode === "meeting" && (
                <ScheduleMeetingModal
                    lorReq={req} currentUserRole="professor"
                    onConfirm={(data) => { onScheduleMeeting(data); setActionMode(null); }}
                    onClose={() => setActionMode(null)}
                />
            )}
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 p-5 cursor-pointer select-none" onClick={() => setExpanded(v => !v)}>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 shrink-0">
                            <User className="size-4 text-purple-600 dark:text-purple-400" />
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
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{req.purpose}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                                <CalendarDays className="size-3" />
                                Deadline: <span className="font-semibold text-gray-600 dark:text-gray-300">
                                    {req.deadline ? new Date(req.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={req.status} />
                        {expanded ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
                    </div>
                </div>

                {/* Expanded */}
                {expanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-4 space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Purpose</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{req.purpose}</p>
                        </div>

                        {req.supportingDocFileName && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supporting Doc (from student)</p>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-fit">
                                    <FileText className="size-4 text-purple-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{req.supportingDocFileName}</span>
                                </div>
                            </div>
                        )}

                        {req.professorRemarks && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Remarks</p>
                                <p className="text-sm italic text-amber-700 dark:text-amber-400">{req.professorRemarks}</p>
                            </div>
                        )}

                        {req.lorFileUrl && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">LoR Submitted</p>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 w-fit">
                                    <CheckCircle className="size-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{req.lorFileUrl}</span>
                                </div>
                            </div>
                        )}

                        <p className="text-[11px] text-gray-400">Requested: {new Date(req.requestedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>

                        {/* Action buttons */}
                        {!actionMode && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {isPending && (
                                    <>
                                        <button onClick={() => setActionMode("approve")} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors">
                                            <CheckCircle className="size-3.5" /> Approve
                                        </button>
                                        <button onClick={() => setActionMode("reject")} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors">
                                            <XCircle className="size-3.5" /> Reject
                                        </button>
                                    </>
                                )}
                                {(isPending || isApproved) && (
                                    <button onClick={() => setActionMode("upload")} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors">
                                        <Upload className="size-3.5" /> Upload & Submit LoR
                                    </button>
                                )}
                                <button onClick={() => setActionMode("meeting")} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl transition-colors">
                                    <Video className="size-3.5" /> Schedule Meeting
                                </button>
                            </div>
                        )}

                        {/* Inline form for approve / reject / upload */}
                        {actionMode && actionMode !== "meeting" && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                                {actionMode === "upload" && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">LoR Document *</label>
                                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx"
                                            onChange={(e) => setLorFile(e.target.files[0] || null)}
                                            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 dark:file:bg-purple-900/30 dark:file:text-purple-300 hover:file:bg-purple-100 cursor-pointer"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        {actionMode === "reject" ? "Reason for rejection *" : "Remarks (optional)"}
                                    </label>
                                    <textarea rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)}
                                        placeholder={actionMode === "reject"
                                            ? "e.g. Supporting document missing, Please attach your updated CV and SOP…"
                                            : "Any notes for student or registrar…"}
                                        className="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500 resize-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleAction}
                                        disabled={(actionMode === "reject" && !remarks.trim()) || (actionMode === "upload" && !lorFile)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors">
                                        {actionMode === "approve" ? "Confirm Approve" : actionMode === "reject" ? "Confirm Reject" : "Submit LoR"}
                                    </button>
                                    <button onClick={() => { setActionMode(null); setRemarks(""); setLorFile(null); }}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

/* ─────────────────────── Student LoR Status Card ────────────────────────── */

const StudentLorCard = ({ req, onScheduleMeeting }) => {
    const [expanded, setExpanded] = useState(false);
    const [showMeetingModal, setShowMeetingModal] = useState(false);

    return (
        <>
            {showMeetingModal && (
                <ScheduleMeetingModal
                    lorReq={req} currentUserRole="student"
                    onConfirm={(data) => { onScheduleMeeting(data); setShowMeetingModal(false); }}
                    onClose={() => setShowMeetingModal(false)}
                />
            )}
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 p-5 cursor-pointer select-none" onClick={() => setExpanded(v => !v)}>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 shrink-0">
                            <FileSignature className="size-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{req.type || "Letter of Recommendation"}</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                                👤 {req.teacherName || "Professor"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{req.purpose}</p>
                            {req.deadline && (
                                <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                                    <CalendarDays className="size-3" />
                                    Deadline: <span className="font-semibold text-gray-600 dark:text-gray-300">
                                        {new Date(req.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={req.lorStatus || req.status || "Pending"} />
                        {expanded ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
                    </div>
                </div>

                {expanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-4 space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Purpose</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{req.purpose}</p>
                        </div>

                        {req.professorRemarks && (
                            <div className={`p-3 rounded-xl border ${(req.lorStatus || req.status) === "Rejected" ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800" : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"}`}>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">Professor's Remarks</p>
                                <p className="text-sm italic text-gray-700 dark:text-gray-300">{req.professorRemarks}</p>
                            </div>
                        )}

                        {req.lorFileUrl && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">LoR Document</p>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 w-fit">
                                    <CheckCircle className="size-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{req.lorFileUrl}</span>
                                </div>
                            </div>
                        )}

                        <p className="text-[11px] text-gray-400">Requested: {new Date(req.requestedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>

                        {/* Schedule meeting button — student can request discussion */}
                        <button onClick={(e) => { e.stopPropagation(); setShowMeetingModal(true); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl transition-colors">
                            <Video className="size-3.5" /> Request Discussion Meeting
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

/* ─────────────────────── Professor LorTab View ──────────────────────────── */

const ProfessorLorTab = ({ lorRequests, onApprove, onReject, onSubmitLor, onScheduleMeeting }) => {
    const [search, setSearch]   = useState("");
    const [filter, setFilter]   = useState("All");
    const STATUS_TABS = ["All", "Pending", "Approved", "Rejected", "Submitted"];

    const pendingCount = lorRequests.filter(r => r.status === "Pending").length;

    const filtered = lorRequests.filter(r => {
        const matchStatus = filter === "All" || r.status === filter;
        const q = search.toLowerCase();
        return matchStatus && (!q || r.studentName?.toLowerCase().includes(q) || r.studentRollNo?.toLowerCase().includes(q) || r.purpose?.toLowerCase().includes(q));
    });

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <FileSignature className="size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        LoR Requests from Students
                        {pendingCount > 0 && (
                            <span className="inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">{pendingCount} pending</span>
                        )}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Review, approve, reject, upload LoR or schedule a discussion.</p>
                </div>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by student name, roll no, purpose…" value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:border-purple-500"
                    />
                </div>
                <div className="flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl gap-0.5 overflow-x-auto no-scrollbar shrink-0">
                    {STATUS_TABS.map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${filter === s ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-purple-600 dark:text-gray-400"}`}>
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
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map(req => (
                        <ProfessorLorCard key={req.id} req={req}
                            onApprove={onApprove} onReject={onReject}
                            onSubmitLor={onSubmitLor} onScheduleMeeting={onScheduleMeeting} />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────── Student LorTab View ────────────────────────────── */

const StudentLorTab = ({ lorRequests, onScheduleMeeting }) => {
    // Student sees their own LoR requests (type === "Letter of Recommendation")
    const myLors = lorRequests.filter(r => r.type === "Letter of Recommendation" || r.lorStatus !== undefined);

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <FileSignature className="size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">My LoR Requests</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Track the status of your recommendation letter requests.</p>
                </div>
            </div>

            {myLors.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-20 text-center">
                    <Inbox className="size-12 text-gray-200 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No LoR requests yet.</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Use the "Request a Document" tab to submit one.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {myLors.map(req => (
                        <StudentLorCard key={req.id} req={req} onScheduleMeeting={onScheduleMeeting} />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────── Main Export ───────────────────────────────────────── */

const LorTab = ({ userRole, lorRequests, onApprove, onReject, onSubmitLor, onScheduleMeeting }) => {
    if (userRole === "professor" || userRole === "hod") {
        return (
            <ProfessorLorTab
                lorRequests={lorRequests}
                onApprove={onApprove}
                onReject={onReject}
                onSubmitLor={onSubmitLor}
                onScheduleMeeting={onScheduleMeeting}
            />
        );
    }
    return (
        <StudentLorTab
            lorRequests={lorRequests}
            onScheduleMeeting={onScheduleMeeting}
        />
    );
};

export default LorTab;