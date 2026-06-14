// src/pages/Finance/components/ReceiptCard.jsx
import React from "react";
import {
  Receipt, Hash, Tag, Download,
  ExternalLink, Printer, BadgeCheck,
} from "lucide-react";
import { fmt, StatusBadge } from "./shared";

const ReceiptCard = ({ receipt, onDownload, onView }) => (
  <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    {/* Header */}
    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
          <Receipt className="size-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{receipt.label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
            <Hash className="size-3" />{receipt.receiptNo}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-extrabold text-gray-900 dark:text-white">{fmt(receipt.amount)}</p>
        <StatusBadge status={receipt.status ?? "Paid"} />
      </div>
    </div>

    {/* Meta grid */}
    <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-3 border-b border-gray-100 dark:border-gray-800">
      {[
        ["Payment Date",   receipt.date],
        ["Semester",       receipt.semester],
        ["Payment Mode",   receipt.mode],
        ["Transaction ID", receipt.txnId,          "font-mono text-xs"],
        ["Reference No.",  receipt.refNo,          "font-mono text-xs"],
        ["Collected By",   receipt.collectedBy ?? "Finance Office"],
        ["Fee Category",   receipt.category],
        ["Academic Year",  receipt.academicYear],
      ].filter(([, v]) => v).map(([label, value, extra = ""]) => (
        <div key={label}>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
          <p className={`text-xs text-gray-800 dark:text-gray-200 font-medium ${extra}`}>{value}</p>
        </div>
      ))}
    </div>

    {/* Breakdown */}
    {receipt.breakdown?.length > 0 && (
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 space-y-1.5">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Fee Components</p>
        {receipt.breakdown.map((item) => (
          <div key={item.label} className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5"><Tag className="size-3 text-gray-400" />{item.label}</span>
            <span className={`font-semibold ${item.type === "deduction" ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}>
              {item.type === "deduction" ? `– ${fmt(item.amount)}` : fmt(item.amount)}
            </span>
          </div>
        ))}
        {receipt.tax > 0 && (
          <div className="flex justify-between items-center text-xs pt-1 border-t border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">GST / Tax (18%)</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{fmt(receipt.tax)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-xs pt-1.5 border-t border-gray-200 dark:border-gray-700 font-bold">
          <span className="text-gray-800 dark:text-gray-200">Total Paid</span>
          <span className="text-emerald-600 dark:text-emerald-400">{fmt(receipt.amount)}</span>
        </div>
      </div>
    )}

    {/* Note */}
    {receipt.note && (
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Note</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{receipt.note}</p>
      </div>
    )}

    {/* Actions */}
    <div className="px-5 py-3 flex items-center gap-2">
      {onView && (
        <button onClick={() => onView(receipt)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors border border-gray-200 dark:border-gray-700">
          <ExternalLink className="size-3.5" />View
        </button>
      )}
      <button onClick={() => onDownload(receipt)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-800">
        <Download className="size-3.5" />Download PDF
      </button>
      <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors border border-gray-200 dark:border-gray-700">
        <Printer className="size-3.5" />Print
      </button>
      <div className="ml-auto flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600">
        <BadgeCheck className="size-3 text-emerald-500" />Verified
      </div>
    </div>
  </div>
);

export default ReceiptCard;