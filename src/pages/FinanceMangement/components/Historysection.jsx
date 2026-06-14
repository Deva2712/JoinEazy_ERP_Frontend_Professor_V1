// components/HistorySection.jsx
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import FinanceRequestCard from "./FinanceRequestCard";

const EmptyState = () => (
  <div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
    <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-6 text-amber-500">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No History Records</h3>
    <p className="text-sm text-gray-500 max-w-xs">
      Try adjusting your filters or search query to find what you're looking for.
    </p>
  </div>
);

/**
 * HistorySection
 *
 * Props:
 *   filters              {object}
 *   setFilters           {(f) => void}
 *   groupedHistory       {object}  – { "Month Year": [item, ...] }
 *   onOpenFilterDrawer   {() => void}
 *   onEditItem           {(item) => void}
 */
const HistorySection = ({ filters, setFilters, groupedHistory, onOpenFilterDrawer, onEditItem }) => (
  <div className="space-y-6">
    {/* Search + mobile filter trigger */}
    <div className="flex gap-3">
      <div className="relative flex-grow group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full pl-12 pr-4 py-3.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
        />
      </div>
      <button
        onClick={onOpenFilterDrawer}
        className="lg:hidden px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-amber-500/50 active:scale-95"
      >
        <SlidersHorizontal className="size-5 text-amber-600" />
      </button>
    </div>

    {/* Grouped list */}
    {Object.entries(groupedHistory).length > 0 ? (
      Object.entries(groupedHistory).map(([month, items]) => (
        <div key={month} className="space-y-4">
          <div className="flex items-center gap-4">
            <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest">{month}</h4>
            <div className="h-px flex-grow bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="grid gap-4">
            {items.map((item) => (
              <FinanceRequestCard
                key={item.id}
                item={item}
                type={item.amount_requested ? "Advance" : "Expense"}
                onEdit={onEditItem}
              />
            ))}
          </div>
        </div>
      ))
    ) : (
      <EmptyState />
    )}
  </div>
);

export default HistorySection;