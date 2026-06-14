// src/pages/Finance/components/FeeCard.jsx
import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp, IndianRupee } from "lucide-react";
import { fmt, StatusBadge, getFeeColors } from "./shared";

const FeeCard = ({ fee, onPay }) => {
  const [open, setOpen] = useState(false);
  const pct = Math.round(((fee.total - fee.due) / fee.total) * 100);
  const { icon: Icon, bg, text } = getFeeColors(fee.type);

  return (
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${bg}`}>
              <Icon className={`size-5 ${text}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{fee.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{fee.semester}</p>
            </div>
          </div>
          <StatusBadge status={fee.status} />
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Paid: {fmt(fee.total - fee.due)}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-500" : pct > 50 ? "bg-blue-500" : "bg-amber-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Due: {fmt(fee.due)}</p>
            {fee.dueDate && (
              <p className="text-[10px] text-red-500 font-medium mt-0.5 flex items-center gap-1">
                <Clock className="size-3" />Due by {fee.dueDate}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setOpen(!open)} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 transition-colors">
              {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {fee.due > 0 && (
              <button onClick={() => onPay(fee)} className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-1.5">
                <IndianRupee className="size-3" />Pay Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown drawer */}
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50/50 dark:bg-gray-900/20 space-y-2">
          {fee.breakdown?.map((item) => (
            <div key={item.label} className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={`font-semibold ${item.type === "deduction" ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                {item.type === "deduction" ? `– ${fmt(item.amount)}` : fmt(item.amount)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-xs font-bold">
            <span className="text-gray-700 dark:text-gray-300">Net Payable</span>
            <span className="text-gray-900 dark:text-white">{fmt(fee.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCard;