// components/DutyListSection.jsx
import React from "react";
import { ArrowLeft, History } from "lucide-react";
import ExamDutyCard from "./ExamDutyCard";

/**
 * DutyListSection
 *
 * Props:
 *   activeTab           {string}   "current" | "history"
 *   selectedMonth       {string}
 *   selectedYear        {string}
 *   selectedDateFilter  {string|null}
 *   sortedExams         {Array}
 *   loading             {boolean}
 *   onClearDateFilter   {() => void}
 *   onUpdateStatus      {(id, status) => void}
 *   formatIsoToDate     {(iso: string) => string}
 *   formatIsoToTime     {(iso: string) => string}
 */
const DutyListSection = ({
  activeTab,
  selectedMonth,
  selectedYear,
  selectedDateFilter,
  sortedExams,
  loading,
  onClearDateFilter,
  onUpdateStatus,
  formatIsoToDate,
  formatIsoToTime,
}) => {
  // Empty state — history tab, no month selected yet
  if (activeTab === "history" && !selectedMonth) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
        <History className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          View Past Duties
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center px-6">
          Select a month to see your duty history.
        </p>
      </div>
    );
  }

  const heading =
    activeTab === "current"
      ? "Invigilation Duties"
      : `${selectedMonth} ${selectedYear}`;

  const badge = selectedDateFilter
    ? formatIsoToDate(selectedDateFilter)
    : `${sortedExams.length} Total`;

  return (
    <div className="space-y-4">
      {/* Row header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-4">
          {selectedDateFilter && (
            <button
              onClick={onClearDateFilter}
              className="flex items-center justify-center size-9 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
            {heading}
          </h3>
        </div>
        <span className="px-3 py-1 bg-lime-100 dark:bg-lime-900/40 rounded-full text-[10px] font-black text-lime-700 dark:text-lime-400 uppercase">
          {badge}
        </span>
      </div>

      {/* Cards */}
      <section className="flex flex-col gap-4">
        {sortedExams.map((exam) => (
          <ExamDutyCard
            key={exam.id}
            exam={exam}
            formatIsoToDate={formatIsoToDate}
            formatIsoToTime={formatIsoToTime}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </section>

      {/* Empty */}
      {sortedExams.length === 0 && !loading && (
        <div className="p-12 text-center text-gray-400 text-sm italic">
          No duties found for this period.
        </div>
      )}
    </div>
  );
};

export default DutyListSection;