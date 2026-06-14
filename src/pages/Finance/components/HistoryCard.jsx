// src/pages/Finance/components/HistoryCard.jsx
import React, { useState } from "react";
import {
  ChevronDown, Calendar, Hash, Tag,
  AlertCircle, Receipt, ArrowUpRight,
} from "lucide-react";
import { fmt, StatusBadge, ModeIcon, getFeeColors, EXPANDED_BORDER } from "./shared";

const HistoryCard = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const { icon: TypeIcon, bg, text } = getFeeColors(entry.feeType);
  const activeBorder = EXPANDED_BORDER[entry.status] ?? "border-emerald-300 dark:border-emerald-700";

  return (
    <div
      onClick={() => setExpanded((e) => !e)}
      className={`group cursor-pointer rounded-2xl border bg-white dark:bg-[#1a1d26] transition-all duration-200 overflow-hidden select-none ${
        expanded
          ? `${activeBorder} shadow-lg scale-[1.008]`
          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md hover:scale-[1.002]"
      }`}
    >
      {/* ── Collapsed row ── */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`p-2.5 rounded-xl shrink-0 transition-all duration-200 ${bg} ${expanded ? "scale-110" : "group-hover:scale-105"}`}>
          <TypeIcon className={`size-5 ${text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{entry.label}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="size-3" />{entry.date}</span>
            <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><ModeIcon mode={entry.mode} className="size-3" />{entry.mode}</span>
            {entry.txnId && (
              <>
                <span className="text-gray-300 dark:text-gray-600 text-xs hidden sm:inline">·</span>
                <span className="text-xs text-gray-400 font-mono hidden sm:flex items-center gap-1"><Hash className="size-3" />{entry.txnId}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-base font-extrabold text-gray-900 dark:text-white">{fmt(entry.amount)}</p>
          <StatusBadge status={entry.status} />
          <ChevronDown className={`size-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div onClick={(e) => e.stopPropagation()} className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-[#13151e]/70">
          <div className="px-5 pt-4 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {[
              ["Fee Head",       entry.feeHead ?? entry.label],
              ["Semester",       entry.semester],
              ["Payment Mode",   entry.mode],
              ["Transaction ID", entry.txnId,             "font-mono"],
              ["Reference No.",  entry.refNo,             "font-mono"],
              ["Processed On",   entry.processedOn ?? entry.date],
              ["Bank / Gateway", entry.gateway],
              ["Initiated By",   entry.initiatedBy ?? "Student Portal"],
            ].filter(([, v]) => v).map(([label, value, extra = ""]) => (
              <div key={label}>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
                <p className={`text-xs text-gray-800 dark:text-gray-200 font-medium break-all ${extra}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Charges breakdown */}
          {entry.charges?.length > 0 && (
            <div className="mx-5 mb-4 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-100/70 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Charges Breakdown</p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {entry.charges.map((c) => (
                  <div key={c.label} className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5"><Tag className="size-3 text-gray-400" />{c.label}</span>
                    <span className={`text-xs font-semibold ${c.type === "deduction" ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>
                      {c.type === "deduction" ? `– ${fmt(c.amount)}` : fmt(c.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Total Paid</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{fmt(entry.amount)}</span>
              </div>
            </div>
          )}

          {/* Failure reason */}
          {entry.status === "Failed" && entry.failReason && (
            <div className="mx-5 mb-4 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span><strong>Failure reason:</strong> {entry.failReason}</span>
            </div>
          )}

          {/* Receipt shortcut */}
          {entry.receiptId && (
            <div className="px-5 pb-4 pt-1 flex justify-end">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                <Receipt className="size-3.5" /> View Receipt <ArrowUpRight className="size-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryCard;