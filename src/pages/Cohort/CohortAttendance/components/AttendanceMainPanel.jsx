import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ArrowLeft, Coffee, SearchX, Clock3,
  FileQuestion, Download, ChevronRight, Edit3, AlertCircle,
} from "lucide-react";
import AttendanceReportTable from "./AttendanceReportTable";
import StudentAttendanceTable from "./StudentAttendanceTable";

const getStatusConfig = (statusMessage) => {
  if (statusMessage?.includes("Sunday"))
    return { icon: <Coffee className="w-10 h-10 text-amber-500" />, title: "Weekly Leave", bgColor: "bg-amber-50 dark:bg-amber-900/20", showAction: false };
  if (statusMessage?.includes("not been marked for today"))
    return { icon: <Clock3 className="w-10 h-10 text-blue-500" />, title: "Pending Entry", bgColor: "bg-blue-50 dark:bg-blue-900/20", showAction: true, buttonText: "Mark Attendance" };
  if (statusMessage?.includes("No attendance log"))
    return { icon: <SearchX className="w-10 h-10 text-red-400" />, title: "No Log Found", bgColor: "bg-red-50 dark:bg-red-800", showAction: false };
  return { icon: <FileQuestion className="w-10 h-10 text-blue-500" />, title: "Status Update", bgColor: "bg-blue-50 dark:bg-blue-900/20", showAction: false };
};

const AttendanceMainPanel = ({
  cohort, selectedDate, stats, filteredStudents, presentStudentIds,
  filteredReportData, dateRange, searchQuery, setSearchQuery,
  matrixSearch, setMatrixSearch, departments, departmentFilter,
  setDepartmentFilter, showReport, setShowReport, statusMessage,
  isDraft, draftData, onExport, navigate,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
      {showReport ? (
        <>
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowReport(false)} className="p-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Attendance Report</h3>
                <p className="text-xs text-gray-500 mt-1">P: Present | A: Absent | -: No Log</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search by name or roll number..." value={matrixSearch} onChange={(e) => setMatrixSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full outline-none" />
              </div>
              <button onClick={onExport} className="flex items-center gap-2 py-2 px-4 bg-emerald-600 text-white rounded-lg font-bold text-sm">
                <Download className="size-4" /> Export CSV
              </button>
            </div>
          </div>
          <AttendanceReportTable filteredReportData={filteredReportData} dateRange={dateRange} />
        </>
      ) : statusMessage && !isDraft ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
          {(() => {
            const sc = getStatusConfig(statusMessage);
            return <>
              <div className={`p-6 ${sc.bgColor} rounded-full mb-6`}>{sc.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 uppercase">{sc.title}</h3>
              <p className="text-base text-gray-500 mb-6">{statusMessage}</p>
              {sc.showAction && (
                <button onClick={() => navigate(`/attendance-management/${cohort?.id}`)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold">
                  {sc.buttonText} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>;
          })()}
        </div>
      ) : (
        <>
          {isDraft && (
            <div className="bg-orange-50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-800/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <AlertCircle className="size-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-900 dark:text-orange-100">Unsubmitted Attendance Draft</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300/80">This log is saved locally but hasn't been submitted yet.</p>
                </div>
              </div>
              <button onClick={() => navigate(`/attendance-management/${cohort?.id}`)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg whitespace-nowrap">
                <Edit3 className="size-4" /> Continue Marking
              </button>
            </div>
          )}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attendance Log</h3>
              <span className="text-sm font-bold text-blue-500 uppercase">
                {new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none">
                <option value="All">All Departments</option>
                {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full outline-none" />
              </div>
            </div>
          </div>
          <StudentAttendanceTable stats={stats} filteredStudents={filteredStudents} presentStudentIds={presentStudentIds} />
        </>
      )}
    </div>
  );
};

export default AttendanceMainPanel;