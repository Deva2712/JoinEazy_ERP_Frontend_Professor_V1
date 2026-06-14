// src/pages/HodHrLeave/components/LeaveApprovalCard.jsx
import React, { useState } from "react";
import {
  Calendar, Clock, ChevronDown, ChevronUp,
  User, CheckCircle2, XCircle, MessageSquare,
  ExternalLink, BookOpen, MapPin, RotateCcw,
  AlertCircle, History,
} from "lucide-react";

const LeaveApprovalCard = ({ app, role, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [remark, setRemark] = useState("");
  const [isActing, setIsActing] = useState(false);

  // role prop is "HoD" or "HR"
  const myApproval = app.leaveApproval?.[role];
  const myStatus = myApparoval?.status || "Pending";
  const isAlreadyActed = myStatus !== "Pending";

  const formattedDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })
      : "N/A";

  const formatTime = (t) => {
    if (!t) return "N/A";
    const [h, m] = t.split(":");
    const d = new Date(); d.setHours(+h, +m);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const dateRange =
    app.fromDate === app.toDate
      ? formattedDate(app.fromDate)
      : `${formattedDate(app.fromDate)} → ${formattedDate(app.toDate)}`;

  const overallStatusStyle = {
    Approved:     "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    Rejected:     "bg-red-100    dark:bg-red-900/30    text-red-700    dark:text-red-300",
    Resubmitted:  "bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300",
    Pending:      "bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300",
  }[app.status] || "bg-gray-100 text-gray-700";

  const myStatusStyle = {
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100    text-red-700",
    Pending:  "bg-amber-100  text-amber-700",
  }[myStatus] || "bg-gray-100 text-gray-600";

  const handleApprove = async (e) => {
    e.stopPropagation();
    setIsActing(true);
    await onApprove(app.id, role, remark);
    setIsActing(false);
    setRemark("");
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    if (!remark.trim()) { alert("Please provide a remark before rejecting."); return; }
    setIsActing(true);
    await onReject(app.id, role, remark);
    setIsActing(false);
    setRemark("");
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-teal-500/20 hover:border-teal-500/30 ${
        isExpanded ? "ring-teal-500/20 border-teal-500/30 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="p-4 sm:p-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* Faculty name + leave type */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">
                {app.facultyName || "Faculty Member"}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                {app.leaveType}
              </span>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-teal-500" /> {dateRange}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-teal-500" />
                Applied: {formattedDate(app.appliedAt)}
              </span>
              {app.courseName && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-teal-500" /> {app.courseName}
                </span>
              )}
            </div>
          </div>

          {/* Right badges */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
            <div className="flex flex-col items-end gap-1.5">
              <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider ${overallStatusStyle}`}>
                {app.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider ${myStatusStyle}`}>
                {role}: {myStatus}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-teal-500 transition-colors">
              {isExpanded ? <><span>Collapse</span><ChevronUp className="size-3" /></> : <><span>{isAlreadyActed ? "View Details" : "Review"}</span><ChevronDown className="size-3" /></>}
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div
            className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {app.courseName && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Course</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-teal-500" /> {app.courseName}
                  </p>
                </div>
              )}
              {app.roomNumber && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Room</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-teal-500" /> {app.roomNumber}
                  </p>
                </div>
              )}
              {app.timings?.startTime && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Timings</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-teal-500" />
                    {formatTime(app.timings.startTime)} – {formatTime(app.timings.endTime)}
                  </p>
                </div>
              )}
              {app.replacementFaculty && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Replacement</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <User className="size-3.5 text-teal-500" /> {app.replacementFaculty}
                  </p>
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reason</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 leading-relaxed">
                {app.reason}
              </p>
            </div>

            {/* Supporting Doc */}
            {app.supporting_doc_link && (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Supporting Document</p>
                <a
                  href={app.supporting_doc_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
                >
                  <ExternalLink className="size-4" /> View Document
                </a>
              </div>
            )}

            {/* Both approvals status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["HoD", "HR"].map((r) => {
                const d = app.leaveApproval?.[r];
                return (
                  <div key={r} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{r} Decision</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        d?.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                        d?.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {d?.status || "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                      {d?.remark || "No remarks yet."}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Previous version */}
            {app.previousVersion && (
              <div className="relative pl-5 py-1 border-l-2 border-gray-200 dark:border-gray-700 ml-2 space-y-2">
                <div className="flex items-center gap-2 -ml-[33px] mb-2">
                  <div className="size-6 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center z-10">
                    <History className="size-3 text-blue-500" />
                  </div>
                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Previous Submission</span>
                </div>
                <div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 text-sm text-gray-500 dark:text-gray-400">
                  <p className="italic">{app.previousVersion.reason}</p>
                  <p className="text-[10px] mt-2 text-gray-400">Applied: {formattedDate(app.previousVersion.appliedAt)}</p>
                </div>
              </div>
            )}

            {/* Action panel — shown when status is still Pending for this role */}
            {!isAlreadyActed ? (
              <div className="p-4 sm:p-5 bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-800 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-teal-600" />
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-300">Your decision is pending</p>
                </div>

                {/* Remark input */}
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <MessageSquare className="size-3" /> Remark
                    <span className="text-red-400 normal-case font-normal text-[10px]">(required for rejection)</span>
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Add your remark here..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={isActing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <XCircle className="size-4" /> Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isActing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-4" /> Approve
                  </button>
                </div>
              </div>
            ) : (
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                myStatus === "Approved"
                  ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800"
                  : "bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-800"
              }`}>
                {myStatus === "Approved"
                  ? <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                  : <XCircle className="size-5 text-red-600 shrink-0" />}
                <div>
                  <p className={`text-sm font-bold ${myStatus === "Approved" ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                    You {myStatus === "Approved" ? "approved" : "rejected"} this leave
                  </p>
                  {myApproval?.remark && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">"{myApproval.remark}"</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApprovalCard;