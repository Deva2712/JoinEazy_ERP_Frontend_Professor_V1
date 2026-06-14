import { useState, useEffect, useMemo } from "react";
import { attendanceService } from "@/api/services/attendance.service";

const useCohortAttendance = ({ cohortId, cohortData }) => {
  const [attendanceData, setAttendanceData] = useState({ students: [], logs: {} });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const startDate = cohortData?.start_date;
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await attendanceService.getAttendanceLogs(cohortId);
        if (response.status === "success") {
          setAttendanceData(response.data);
          const hasFinalLog = response.data.logs[todayStr] && response.data.isFinal;
          if (!hasFinalLog) {
            const savedDraft = localStorage.getItem(`attendance_draft_${cohortId}`);
            if (savedDraft) setDraftData(JSON.parse(savedDraft));
          }
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cohortId) fetchAttendance();
  }, [cohortId, todayStr]);

  const getDateRange = () => {
    if (!startDate) return [];
    const dates = [];
    let current = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    while (current <= today) {
      if (current.getDay() !== 0) dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates.reverse();
  };

  const getCustomMarkers = () => {
    const markers = Object.keys(attendanceData.logs).map((date) => ({
      date,
      className: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100",
      dotColor: "bg-blue-400",
    }));
    if (draftData && !attendanceData.logs[todayStr]) {
      markers.push({
        date: todayStr,
        className: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100",
        dotColor: "bg-orange-500",
      });
    }
    return markers;
  };

  const getStatusMessage = () => {
    const isSunday = new Date(selectedDate).getDay() === 0;
    const hasLog = attendanceData.logs[selectedDate]?.length > 0;
    if (isSunday) return "Sunday is a weekly leave day.";
    if (selectedDate === todayStr && draftData) return "You have an unsubmitted draft for today.";
    if (selectedDate === todayStr && !hasLog) return "Attendance has not been marked for today yet.";
    if (!hasLog) return "No attendance log was found for this date.";
    return null;
  };

  const reportData = useMemo(() => {
    const { students, logs } = attendanceData;
    const allDates = getDateRange();

    return students.map((student) => {
      const dailyStatus = {};
      let daysPresent = 0;
      let totalLoggedDays = 0;

      allDates.forEach((date) => {
        let logEntry = logs[date];
        if (date === todayStr && draftData && !logEntry) logEntry = draftData.presentIds;

        if (logEntry) {
          totalLoggedDays++;
          const isPresent = logEntry.includes(student.id);
          dailyStatus[date] = isPresent;
          if (isPresent) daysPresent++;
        } else {
          dailyStatus[date] = null;
        }
      });

      return {
        ...student,
        dailyStatus,
        daysPresent,
        totalLoggedDays,
        percentage: totalLoggedDays > 0 ? ((daysPresent / totalLoggedDays) * 100).toFixed(1) : 0,
      };
    });
  }, [attendanceData, startDate, draftData, todayStr]);

  const handleExportCSV = () => {
    const allDates = getDateRange().reverse();
    const headers = ["Roll Number", "Name", ...allDates, "Total Present", "Percentage"].join(",");
    const rows = reportData.map((s) => {
      const dailyRow = allDates.map((date) => {
        if (s.dailyStatus[date] === true) return "P";
        if (s.dailyStatus[date] === false) return "A";
        return "-";
      });
      return [s.rollNumber, s.name, ...dailyRow, s.daysPresent, `${s.percentage}%`].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Full_Attendance_Report_(${cohortData?.course_code}).csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
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
  };
};

export default useCohortAttendance;