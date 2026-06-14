// src/pages/StudentCourses/StudentCoursesController.jsx
import React, { useState, useEffect } from "react";
import { userService } from "@/api/services/user.service";
import { courseService } from "@/api/services/course.service";
import { studentCoursesService } from "@/api/services/studentCourses.service";
import useRegistrationActions from "./utils/Useregistrationactions";
import StudentCoursesUI from "./StudentCoursesUI";

const StudentCoursesController = () => {
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

    // My Courses tab
    const [activeCohorts,   setActiveCohorts]   = useState([]);
    const [archivedCohorts, setArchivedCohorts] = useState([]);

    // Registration tab
    const [registrationConfig,  setRegistrationConfig]  = useState({ isOpen: false });
    const [registrationCourses, setRegistrationCourses] = useState([]);
    const [myRegistrations,     setMyRegistrations]     = useState([]);

    // Shared user profile (auto-fills registration form)
    const [userProfile, setUserProfile] = useState({});

    // ── Registration action handlers (extracted) ──────────────────────────────
    const { handleSubmitRegistration, handleSwapElective, handleSubmitFeedback } =
        useRegistrationActions(setMyRegistrations, fetchData);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    async function fetchData() {
        try {
            setLoading(true);
            setError(null);

            const [dashRes, archivedRes, regRes] = await Promise.all([
                userService.getDashboardOverview(),
                courseService.getArchivedCourses(),
                studentCoursesService.getOverview(),
            ]);

            // ── My Courses ──────────────────────────────────────────────────
            if (dashRes.success) {
                const { data } = dashRes;
                const todoAssignments = data.todoAssignments || [];
                const meetings        = data.upcomingMeetings || [];
                const now             = new Date();

                setUserProfile({
                    fullName:     data.user?.fullName     || data.user?.name  || "",
                    rollNumber:   data.user?.rollNumber   || data.user?.employeeId || "",
                    email:        data.user?.officialEmail || data.user?.personalEmail || "",
                    semester:     data.user?.currentSemester || "",
                    academicYear: data.user?.academicYear || "",
                    organization: data.user?.organization || "Mahindra University",
                });

                const normaliseCohort = (c) => {
                    const cohortId = c.id;
                    const ca       = todoAssignments.filter((a) => a.cohortId === cohortId);
                    return {
                        ...c,
                        title:      c.title      || c.cohort_name,
                        startDate:  c.startDate  || c.start_date,
                        endDate:    c.endDate    || c.end_date,
                        createdAt:  c.createdAt  || c.created_at,
                        status:     c.status     || c.visibility,
                        courseCodes: c.courseCodes || c.course_codes || [],
                        totalDue:    ca.length,
                        dueThisWeek: ca.filter((a) => {
                            const d = Math.ceil((new Date(a.dueDate) - now) / 86400000);
                            return d >= 0 && d < 8;
                        }).length,
                        upcomingMeetings: meetings.filter((m) => {
                            if (m.cohortId !== cohortId) return false;
                            return new Date(m.scheduledAt || m.startTime) >= now;
                        }).length,
                    };
                };

                setActiveCohorts(
                    (data.cohorts || data.joinedCohorts || [])
                        .map(normaliseCohort)
                        .filter((c) => c.status !== "Archived"),
                );

                const archivedRaw = archivedRes.success
                    ? Array.isArray(archivedRes.data)
                        ? archivedRes.data
                        : archivedRes.data?.data || []
                    : [];
                setArchivedCohorts(archivedRaw.map(normaliseCohort));
            } else {
                throw new Error(dashRes.error || "Failed to fetch courses");
            }

            // ── Registration tab ────────────────────────────────────────────
            if (regRes.success) {
                setRegistrationConfig(regRes.data.registrationConfig   || { isOpen: false });
                setRegistrationCourses(regRes.data.registrationCourses || []);
                setMyRegistrations(regRes.data.myRegistrations         || []);
            }
        } catch (err) {
            console.error("StudentCourses load error:", err);
            setError("Failed to load courses. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        document.title = "My Courses – Joineazy";
    }, []);

    // ── Handlers ─────────────────────────────────────────────────────────────

    /** Cancel a pending registration by its ID. */
    const handleCancelRegistration = async (registrationId) => {
        setMyRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
        try {
            await studentCoursesService.cancelRegistration(registrationId);
        } catch {
            fetchData();
        }
    };

    return (
        <StudentCoursesUI
            loading={loading}
            error={error}
            onRetry={fetchData}
            userProfile={userProfile}
            activeCohorts={activeCohorts}
            archivedCohorts={archivedCohorts}
            registrationConfig={registrationConfig}
            registrationCourses={registrationCourses}
            myRegistrations={myRegistrations}
            onSubmitRegistration={handleSubmitRegistration}
            onCancelRegistration={handleCancelRegistration}
            onSwapElective={handleSwapElective}
            onSubmitFeedback={handleSubmitFeedback}
        />
    );
};

export default StudentCoursesController;