// src/pages/StudentAttendance/StudentAttendanceController.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentAttendanceService } from "@/api/services/studentAttendance.service";
import StudentAttendanceUI from "./StudentAttendanceUI";

export default function StudentAttendanceController() {
    const navigate = useNavigate();

    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [courses,      setCourses]      = useState([]);
    const [overallStats, setOverallStats] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await studentAttendanceService.getAttendance();
            if (!res.success) throw new Error(res.error);
            setCourses(res.data.courses);
            setOverallStats(res.data.overallStats);
        } catch (err) {
            console.error("Student attendance load error:", err);
            setError("Failed to load attendance data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        document.title = "My Attendance – Joineazy";
    }, []);

    return (
        <StudentAttendanceUI
            loading={loading}
            error={error}
            onRetry={fetchData}
            courses={courses}
            overallStats={overallStats}
            onBack={() => navigate("/dashboard")}
            onAttendanceMarked={fetchData}
        />
    );
}