// src/pages/Cohort/CohortAttendance/CohortAttendanceController.jsx
import React from "react";
import ProfessorCohortAttendanceUI from "./ProfessorCohortAttendaceUI";
import StudentAttendanceView from "./StudentAttendanceView";
import useCohortAttendance from "./utils/Usecohortattendance";

const CohortAttendanceController = ({ cohortId, cohortData }) => {
  const {
    attendanceData,
    selectedDate,
    setSelectedDate,
    loading,
    showReport,
    setShowReport,
    draftData,
    departmentFilter,
    setDepartmentFilter,
    reportData,
    todayStr,
    getDateRange,
    getCustomMarkers,
    getStatusMessage,
    handleExportCSV,
  } = useCohortAttendance({ cohortId, cohortData });

  // FIX: Controller pehle sirf ProfessorUI render karta tha — student ke liye
  // kuch nahi dikhta tha. Ab user_type check karke sahi view render hota hai.
  const user_type = cohortData?.user_type ?? 0;

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 animate-pulse">Loading attendance...</p>
        </div>
      </div>
    );
  }

  // ── Student View ──────────────────────────────────────────────────────────
  if (user_type === 0) {
    return (
      <StudentAttendanceView
        cohortData={cohortData}
        reportData={reportData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        attendanceData={attendanceData}
        customMarkers={getCustomMarkers()}
        dateRange={getDateRange()}
        todayStr={todayStr}
      />
    );
  }

  // ── Professor View ────────────────────────────────────────────────────────
  const uiConfig = {
    loading,
    showReport,
    setShowReport,
    statusMessage: getStatusMessage(),
    customMarkers: getCustomMarkers(),
    onExport: handleExportCSV,
    isDraft: !!(selectedDate === todayStr && draftData),
    departmentFilter,
    setDepartmentFilter,
  };

  return (
    <ProfessorCohortAttendanceUI
      cohort={cohortData}
      attendanceData={attendanceData}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      reportData={reportData}
      dateRange={getDateRange()}
      uiConfig={uiConfig}
      draftData={draftData}
    />
  );
};

export default CohortAttendanceController;