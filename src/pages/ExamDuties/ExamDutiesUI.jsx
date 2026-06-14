import React, { useMemo, useEffect, useState } from "react";
import { RefreshCw, ArrowLeft, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import MiniCalendar from "../../components/common/MiniCalendar";
import DutyListSection from "./components/DutyListSection";
import HistoryFilters, { TABS, STATUS_PRIORITY, formatIsoToDate, formatIsoToTime } from "./components/Examdutieshelpers";

const ExamDutiesUI = ({ exams = [], loading, error, state, actions }) => {
  const navigate = useNavigate();
  const { activeTab, selectedYear, selectedMonth, years, months } = state;
  const { onRefresh, setActiveTab, setSelectedYear, setSelectedMonth, onUpdateStatus } = actions;

  const [calendarKey, setCalendarKey] = useState(0);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCalendarKey((k) => k + 1);
  }, [activeTab]);

  const currentMonthDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);

  const filteredExams = useMemo(() =>
    activeTab === "current"
      ? exams.filter((e) => new Date(e.startTime) >= currentMonthDate)
      : exams,
  [exams, activeTab, currentMonthDate]);

  const sortedExams = useMemo(() => {
    let list = selectedDateFilter
      ? filteredExams.filter((e) => e.startTime.startsWith(selectedDateFilter))
      : [...filteredExams];

    return list.sort((a, b) => {
      const pa = STATUS_PRIORITY[a.status] ?? 5;
      const pb = STATUS_PRIORITY[b.status] ?? 5;
      return pa !== pb ? pa - pb : new Date(a.startTime) - new Date(b.startTime);
    });
  }, [filteredExams, selectedDateFilter]);

  const statsData = [
    { label: "Assigned Duties", value: String(filteredExams.filter((e) => e.status === "ASSIGNED" || e.status === "REJECTION_REVOKED").length), icon: CheckCircle2 },
    { label: "Review Pending",  value: String(filteredExams.filter((e) => e.status === "REJECTION_REVIEW").length), icon: AlertCircle },
  ];

  const dutyMarkers = useMemo(() =>
    filteredExams
      .filter((e) => e.status !== "REJECTION_APPROVED")
      .map((e) => ({
        date: e.startTime.split("T")[0],
        className: e.status === "REJECTION_REVIEW"
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
          : e.status === "REJECTION_REVOKED"
            ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100"
            : "bg-lime-50 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 hover:bg-lime-100",
        dotColor: e.status === "REJECTION_REVIEW" ? "bg-blue-400"
          : e.status === "REJECTION_REVOKED" ? "bg-red-400" : "bg-lime-400",
      })),
  [filteredExams]);

  const calendarRestriction = useMemo(() => {
    if (activeTab === "history" && selectedMonth && selectedYear) {
      return new Date(parseInt(selectedYear), months.indexOf(selectedMonth), 1);
    }
    return null;
  }, [activeTab, selectedMonth, selectedYear, months]);

  const showCalendar = activeTab === "current" || (activeTab === "history" && selectedMonth);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
      <HeaderController />

      {/* Hero */}
      <div className="bg-gradient-to-br from-lime-600 via-lime-700 to-lime-800/90 dark:from-lime-900 dark:via-lime-950 dark:to-lime-950 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors border border-white/10">
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Exam Duties</h1>
                <p className="text-lime-50 text-sm mt-0.5">View your upcoming invigilation timings and hall allocations.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-2 md:pb-0">
              {statsData.map((s, i) => <StatSummaryCard key={i} {...s} />)}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                  activeTab === key
                    ? "bg-gray-50 dark:bg-[#0f1117] text-lime-700 dark:text-lime-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="px-4 py-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <AlertTriangle className="size-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
            <button onClick={onRefresh} className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
              <RefreshCw className="size-4" /> Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="size-12 animate-spin mb-4 text-lime-600" />
            <p className="font-bold text-gray-900 dark:text-white">Loading Duties Data</p>
            <p className="text-sm">Please wait while we fetch your exam duties...</p>
          </div>
        ) : (
          <>
            {activeTab === "history" && (
              <HistoryFilters
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                setSelectedYear={setSelectedYear}
                setSelectedMonth={setSelectedMonth}
                years={years}
                months={months}
              />
            )}

            <div className="flex flex-col lg:flex-row gap-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              {showCalendar && (
                <aside className="flex-shrink-0 w-full lg:w-80 space-y-6">
                  <MiniCalendar
                    key={calendarKey}
                    customMarkers={dutyMarkers}
                    selectedDateColor="bg-lime-600"
                    viewOnly={false}
                    onDateClick={(date) => setSelectedDateFilter((prev) => prev === date ? null : date)}
                    selectedDate={selectedDateFilter}
                    restrictToMonth={calendarRestriction}
                    minDate={activeTab === "current" ? currentMonthDate : null}
                  />
                </aside>
              )}
              <div className="flex-grow min-w-0 space-y-6">
                <DutyListSection
                  activeTab={activeTab}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedDateFilter={selectedDateFilter}
                  sortedExams={sortedExams}
                  loading={loading}
                  onClearDateFilter={() => setSelectedDateFilter(null)}
                  onUpdateStatus={onUpdateStatus}
                  formatIsoToDate={formatIsoToDate}
                  formatIsoToTime={formatIsoToTime}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNavController />
      <FooterController />
    </div>
  );
};

export default ExamDutiesUI;