// src/pages/Cohort/CohortAttendance/StudentAttendanceView.jsx
import React, { useState } from "react";
import { CheckCircle, XCircle, Minus, CalendarDays, TrendingUp, Award } from "lucide-react";
import MiniCalendar from "../../../components/common/MiniCalendar";

const StudentAttendanceView = ({
  cohortData,
  reportData,
  selectedDate,
  setSelectedDate,
  attendanceData,
  customMarkers,
  dateRange,
  todayStr,
}) => {
  const [searchDate, setSearchDate] = useState("");

  // Find current logged-in student's data from reportData
  // reportData has one entry per student — we pick the one that matches current user
  const authUser   = JSON.parse(localStorage.getItem("authUser") || "{}");
  const currentUserId = authUser?.id;

  // Try to match by user id, else fall back to first entry (mock scenario)
  const myRecord =
    reportData.find((s) => s.id === currentUserId || s.user_id === currentUserId) ||
    reportData[0] ||
    null;

  // Today's status from logs
  const todayLog     = attendanceData.logs?.[todayStr] || [];
  const todayStatus  = myRecord
    ? todayLog.includes(myRecord.id)
      ? "present"
      : todayLog.length > 0
      ? "absent"
      : "not-marked"
    : "not-marked";

  // Selected date status
  const selectedLog    = attendanceData.logs?.[selectedDate] || [];
  const selectedStatus = myRecord
    ? selectedLog.includes(myRecord.id)
      ? "present"
      : selectedLog.length > 0
      ? "absent"
      : "not-marked"
    : "not-marked";

  // Summary stats
  const daysPresent    = myRecord?.daysPresent    ?? 0;
  const totalLogged    = myRecord?.totalLoggedDays ?? 0;
  const percentage     = myRecord?.percentage     ?? 0;

  const attendanceColor =
    percentage >= 75 ? "text-emerald-600" :
    percentage >= 50 ? "text-yellow-600"  :
    "text-red-600";

  const attendanceBg =
    percentage >= 75 ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" :
    percentage >= 50 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"     :
    "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";

  const StatusBadge = ({ status }) => {
    if (status === "present")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5" /> Present
        </span>
      );
    if (status === "absent")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
          <XCircle className="w-3.5 h-3.5" /> Absent
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500">
        <Minus className="w-3.5 h-3.5" /> Not Marked
      </span>
    );
  };

  // Filtered date log for history view
  const filteredDates = dateRange
    .filter((d) => !searchDate || d.includes(searchDate))
    .slice(0, 60); // show last 60 days max

  return (
    <div className="font-sans min-h-screen">
      <main className="px-4 py-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Calendar + Today Status ──────────────────────────── */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <MiniCalendar
              onDateClick={setSelectedDate}
              customMarkers={customMarkers}
              selectedDate={selectedDate}
              startDate={cohortData?.start_date}
              endDate={cohortData?.end_date}
              disbaleFuture={true}
            />

            {/* Today's status card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Today's Status</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{todayStr}</span>
                <StatusBadge status={todayStatus} />
              </div>
            </div>

            {/* Selected date status */}
            {selectedDate !== todayStr && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Selected Date</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedDate}</span>
                  <StatusBadge status={selectedStatus} />
                </div>
              </div>
            )}
          </aside>

          {/* ── Right: Summary + History ────────────────────────────────── */}
          <div className="flex-grow space-y-6">

            {/* Attendance summary */}
            <div className={`rounded-2xl border p-6 ${attendanceBg}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/60 dark:bg-black/20 rounded-xl">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Overall Attendance</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cohortData?.title || "This course"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{daysPresent}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">Days Present</p>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{totalLogged - daysPresent}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">Days Absent</p>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-black ${attendanceColor}`}>{percentage}%</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">Percentage</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Attendance Progress</span>
                  <span className="font-bold">{daysPresent}/{totalLogged} days</span>
                </div>
                <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      percentage >= 75 ? "bg-emerald-500" :
                      percentage >= 50 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {percentage < 75 && (
                  <p className="text-xs text-red-500 font-semibold mt-2">
                    ⚠️ Minimum 75% attendance required. You need{" "}
                    {Math.max(0, Math.ceil((0.75 * totalLogged - daysPresent) / 0.25))} more days present.
                  </p>
                )}
              </div>
            </div>

            {/* Attendance History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Attendance History</h3>
                </div>
                <input
                  type="text"
                  placeholder="Filter by date (YYYY-MM-DD)"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                />
              </div>

              {filteredDates.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No attendance records found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Day</th>
                        <th className="px-6 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredDates.map((date) => {
                        const log    = attendanceData.logs?.[date] || [];
                        const marked = log.length > 0;
                        const status = !marked
                          ? "not-marked"
                          : myRecord && log.includes(myRecord.id)
                          ? "present"
                          : "absent";
                        const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
                        const formatted = new Date(date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        });

                        return (
                          <tr
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className="group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-3 font-semibold text-gray-800 dark:text-gray-200">
                              {formatted}
                              {date === todayStr && (
                                <span className="ml-2 text-[10px] font-black text-blue-500 uppercase">Today</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-gray-400 text-xs">{dayName}</td>
                            <td className="px-6 py-3 text-right">
                              <StatusBadge status={status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAttendanceView;