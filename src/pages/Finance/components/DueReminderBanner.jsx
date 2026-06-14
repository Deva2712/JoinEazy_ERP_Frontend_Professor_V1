// src/pages/Finance/components/DueReminderBanner.jsx
import React from "react";
import { AlertCircle, Zap } from "lucide-react";
import { fmt } from "./shared";

const URGENCY = {
  high:   { wrap: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800",       icon: "bg-red-100 dark:bg-red-900/30",    zap: "text-red-600 dark:text-red-400",    title: "text-red-800 dark:text-red-300",    sub: "text-red-600 dark:text-red-400",    btn: "bg-red-600 hover:bg-red-700 text-white"       },
  medium: { wrap: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800", icon: "bg-amber-100 dark:bg-amber-900/30", zap: "text-amber-600 dark:text-amber-400", title: "text-amber-800 dark:text-amber-300", sub: "text-amber-600 dark:text-amber-400", btn: "bg-amber-500 hover:bg-amber-600 text-white"     },
  low:    { wrap: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800",    icon: "bg-blue-100 dark:bg-blue-900/30",   zap: "text-blue-600 dark:text-blue-400",   title: "text-blue-800 dark:text-blue-300",  sub: "text-blue-600 dark:text-blue-400",  btn: "bg-blue-600 hover:bg-blue-700 text-white"      },
};

const DueReminderBanner = ({ reminders = [], onPayNow }) => {
  if (reminders.length === 0) return null;

  const sorted = [...reminders].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.urgency] ?? 2) - (order[b.urgency] ?? 2);
  });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="size-4 text-red-500" />
        <p className="text-sm font-bold text-gray-800 dark:text-white">Due Reminders</p>
        <span className="ml-auto text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
          {reminders.length} pending
        </span>
      </div>
      <div className="space-y-2">
        {sorted.map((r) => {
          const u = URGENCY[r.urgency] ?? URGENCY.low;
          return (
            <div key={r.id} className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${u.wrap}`}>
              <div className={`p-1.5 rounded-lg shrink-0 ${u.icon}`}>
                <Zap className={`size-3.5 ${u.zap}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${u.title}`}>{r.label}</p>
                <p className={`text-xs mt-0.5 ${u.sub}`}>Due {r.dueDate} · {fmt(r.amount)}</p>
              </div>
              <button onClick={() => onPayNow?.(r)} className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors ${u.btn}`}>
                Pay Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DueReminderBanner;