import React from "react";
import { Search, ChevronDown } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

export const TABS = [
  { key: "current", label: "Upcoming Duties", icon: "Calendar" },
  { key: "history", label: "Duty History",    icon: "History"  },
];

export const STATUS_PRIORITY = {
  REJECTION_REVOKED:  0,
  REJECTION_APPROVED: 1,
  ASSIGNED:           2,
  CONFIRMED:          3,
  REJECTION_REVIEW:   4,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const formatIsoToDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

export const formatIsoToTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

// ─── HistoryFilters Component ─────────────────────────────────────────────────

const HistoryFilters = ({ selectedYear, selectedMonth, setSelectedYear, setSelectedMonth, years, months }) => {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 md:p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4 w-full lg:w-auto">
        <div className="flex items-center gap-3 col-span-1 sm:col-span-2 lg:mr-4">
          <Search className="size-5 text-lime-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
            Duty Archive
          </h3>
        </div>

        {[
          { label: "Year",  value: selectedYear,  onChange: setSelectedYear,  options: years,  placeholder: null },
          { label: "Month", value: selectedMonth, onChange: setSelectedMonth, options: months, placeholder: "Select Month..." },
        ].map(({ label, value, onChange, options, placeholder }) => (
          <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              {label}
            </span>
            <div className="relative">
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-bold py-2.5 pl-4 pr-10 outline-none ring-1 ring-gray-200 dark:ring-gray-600 focus:ring-2 focus:ring-lime-500 transition-all min-w-[140px]"
              >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryFilters;