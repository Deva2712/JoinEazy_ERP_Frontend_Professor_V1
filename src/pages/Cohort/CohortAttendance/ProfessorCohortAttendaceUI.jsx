// src/pages/Cohort/CohortAttendance/ProfessorCohortAttendaceUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import MiniCalendar from "../../../components/common/MiniCalendar";
import AttendanceMainPanel from "./components/AttendanceMainPanel";

const ProfessorCohortAttendanceUI = ({
  cohort, attendanceData, selectedDate, setSelectedDate,
  reportData, dateRange, uiConfig, draftData,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [matrixSearch, setMatrixSearch] = useState("");

  const { students, logs } = attendanceData;
  const {
    loading, showReport, setShowReport, statusMessage,
    customMarkers, onExport, isDraft, departmentFilter, setDepartmentFilter,
  } = uiConfig;

  const presentStudentIds = isDraft ? draftData?.presentIds || [] : logs[selectedDate] || [];
  const departments = [...new Set(students.map((s) => s.department))];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (departmentFilter === "All" || s.department === departmentFilter);
  });

  const filteredReportData = reportData.filter(
    (s) =>
      s.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(matrixSearch.toLowerCase()),
  );

  const stats = {
    total: students.length,
    present: presentStudentIds.length,
    absent: students.length - presentStudentIds.length,
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading...</div>;

  return (
    <div className="font-sans min-h-screen">
      <main className="px-4 py-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {!showReport && (
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                <MiniCalendar
                  onDateClick={setSelectedDate}
                  customMarkers={customMarkers}
                  selectedDate={selectedDate}
                  startDate={cohort?.start_date}
                  endDate={cohort?.end_date}
                  disbaleFuture={true}
                />
                <button
                  onClick={() => setShowReport(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md"
                >
                  <FileText className="size-4" /> Attendance Report
                </button>
              </div>
            </aside>
          )}
          <div className="flex-grow overflow-hidden">
            <AttendanceMainPanel
              cohort={cohort}
              selectedDate={selectedDate}
              stats={stats}
              filteredStudents={filteredStudents}
              presentStudentIds={presentStudentIds}
              filteredReportData={filteredReportData}
              dateRange={dateRange}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              matrixSearch={matrixSearch}
              setMatrixSearch={setMatrixSearch}
              departments={departments}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              showReport={showReport}
              setShowReport={setShowReport}
              statusMessage={statusMessage}
              isDraft={isDraft}
              draftData={draftData}
              onExport={onExport}
              navigate={navigate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessorCohortAttendanceUI;