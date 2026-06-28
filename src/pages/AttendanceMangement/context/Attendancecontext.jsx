// src/pages/AttendanceMangement/context/Attendancecontext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { attendanceService } from "../../../api/services/attendance.service";
import { userService } from "../../../api/services/user.service";
import { leaveService } from "../../../api/services/leave.service";
import {
	encodeBase64,
	getTodayString,
	saveDraftToStorage,
	loadDraftFromStorage,
	clearDraftFromStorage,
} from "../utils/attendanceUtils";

const AttendanceContext = createContext(null);

export const useAttendance = () => {
	const ctx = useContext(AttendanceContext);
	if (!ctx) throw new Error("useAttendance must be used inside AttendanceProvider");
	return ctx;
};

// IST-aware today string
const getISTDateString = () =>
	new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

// Aaj + pichhle 2 working days (Sundays skip) — "aaj" hamesha included hota
// hai chahe woh Sunday hi ho; Sunday-skip sirf backdate (pichle) din ke liye
// hai, taaki professor aaj ki attendance kabhi bhi mark kar sake.
const getAllowedDates = () => {
	const todayStr = getISTDateString();
	const dates = [todayStr];
	let checked = 1;
	while (dates.length < 3 && checked < 10) {
		const d = new Date(todayStr + "T12:00:00Z");
		d.setUTCDate(d.getUTCDate() - checked);
		if (d.getUTCDay() !== 0) {
			const y = d.getUTCFullYear();
			const m = String(d.getUTCMonth() + 1).padStart(2, "0");
			const day = String(d.getUTCDate()).padStart(2, "0");
			dates.push(`${y}-${m}-${day}`);
		}
		checked++;
	}
	return dates;
};

export const AttendanceProvider = ({ children }) => {
	const navigate = useNavigate();
	const { courseId } = useParams();
	const location = useLocation();

	const [activeCourses, setActiveCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [departmentMapping, setDepartmentMapping] = useState(null);
	const [students, setStudents] = useState([]);
	const [presentIds, setPresentIds] = useState([]);
	const [absentIds, setAbsentIds] = useState([]);
	const [profLogs, setProfLogs] = useState([]);
	const [leaveApplications, setLeaveApplications] = useState([]);

	const todayStr = getISTDateString();
	const allowedDates = getAllowedDates();
	const [selectedDate, setSelectedDate] = useState(todayStr);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [markingLoading, setMarkingLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
	const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false);

	const [qrToken, setQrToken] = useState("");
	const [qrTimeout, setQrTimeout] = useState(60);
	const [timeLeft, setTimeLeft] = useState(60);

	const [viewMode, setViewMode] = useState("management");

	// ── Fetch dashboard + logs + leave ──────────────────────────────────────
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const [courseRes, logsRes, leaveRes] = await Promise.all([
				userService.getDashboardOverview(),
				attendanceService.getProfessorLogs(),
				leaveService.getApplications(),
			]);

			if (courseRes.status === "success" || courseRes.success) {
				const courses = courseRes.data.createdCohorts || [];
				setActiveCourses(courses.map((c) => ({
					id: c.id,
					cohort_name: c.cohort_name || "Untitled Course",
					course_codes: Array.isArray(c.course_codes) ? c.course_codes : [],
					member_count: c.member_count || 0,
				})));
			}

			if (logsRes.status === "success" || logsRes.success) {
				setProfLogs(logsRes.data);
			}

			if (leaveRes?.data?.applications) {
				setLeaveApplications(leaveRes.data.applications);
			}
		} catch (err) {
			console.error("Failed to fetch attendance data:", err);
			setError("Failed to load attendance records. Please check your connection.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		document.title = "Attendance Management";
	}, []);

	// ── Route-based view switching ───────────────────────────────────────────
	useEffect(() => {
		if (location.pathname.includes("/logs")) {
			setViewMode("prof-attendance");
			setSelectedCourse(null);
		} else if (courseId) {
			const found = activeCourses.find((c) => c.id.toString() === courseId);
			if (found) {
				setSelectedCourse(found);
				setViewMode(location.pathname.endsWith("/qr") ? "qr-view" : "management");
			}
		} else {
			setViewMode("management");
			setSelectedCourse(null);
		}
	}, [courseId, activeCourses, location.pathname]);

	// ── Fetch students + load log for selectedDate ────────────────────────────
	useEffect(() => {
		if (!selectedCourse) return;

		const fetchStudents = async () => {
			setMarkingLoading(true);
			setSubmitError(null);

			try {
				const response = await attendanceService.getAttendanceLogs(selectedCourse.id);

				if (response.status === "success" || response.success) {
					const { students: list, logs, isFinal } = response.data;
					const logsForDate = logs?.[selectedDate] || [];

					setDepartmentMapping(response.departmentMapping);
					setStudents(list || []);

					if (selectedDate === todayStr && isFinal) {
						// Aaj ka final log — locked
						setHasSubmitted(true);
						setPresentIds(logsForDate);
						setAbsentIds((list || []).map((s) => s.id).filter((id) => !logsForDate.includes(id)));
						clearDraftFromStorage(`${selectedCourse.id}_${selectedDate}`);
					} else if (logsForDate.length > 0) {
						// Past date ya aaj ka draft — editable, existing data load karo
						setHasSubmitted(false);
						setPresentIds(logsForDate);
						setAbsentIds((list || []).map((s) => s.id).filter((id) => !logsForDate.includes(id)));
					} else {
						// Koi log nahi — draft check karo
						setHasSubmitted(false);
						const draft = loadDraftFromStorage(`${selectedCourse.id}_${selectedDate}`);
						if (draft) {
							setPresentIds(draft.presentIds || []);
							setAbsentIds(draft.absentIds || []);
						} else {
							setPresentIds([]);
							setAbsentIds([]);
						}
					}
				}
			} catch (err) {
				console.error("Failed to fetch students:", err);
			} finally {
				setMarkingLoading(false);
			}
		};

		fetchStudents();
	}, [selectedCourse?.id, selectedDate]);

	// ── QR timer ────────────────────────────────────────────────────────────
	const handleTimerExpiry = useCallback(() => {
		if (hasSubmitted) return;
		const marked = [...presentIds, ...absentIds];
		const remaining = students.map((s) => s.id).filter((id) => !marked.includes(id));
		if (remaining.length > 0) setAbsentIds((prev) => [...new Set([...prev, ...remaining])]);
		setQrToken("");
	}, [students, presentIds, absentIds, hasSubmitted]);

	useEffect(() => {
		let timer;
		if (qrToken && timeLeft > 0) {
			timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
		} else if (timeLeft === 0 && qrToken) {
			handleTimerExpiry();
			if (viewMode === "qr-view") navigate(`/attendance-management/${courseId}`);
		}
		return () => clearInterval(timer);
	}, [qrToken, timeLeft, handleTimerExpiry, viewMode, navigate, courseId]);

	const generateNewQR = useCallback(() => {
		if (!selectedCourse || hasSubmitted) return;
		const payload = JSON.stringify({ cid: selectedCourse.id, ts: Date.now(), exp: qrTimeout });
		setQrToken(encodeBase64(payload));
		setTimeLeft(qrTimeout);
	}, [selectedCourse, hasSubmitted, qrTimeout]);

	useEffect(() => {
		if (viewMode === "qr-view" && !qrToken && !hasSubmitted && timeLeft > 0) generateNewQR();
	}, [viewMode, qrToken, hasSubmitted, generateNewQR, timeLeft]);

	// ── Mark handlers ────────────────────────────────────────────────────────
	const handleMarkPresent = (id) => {
		if (hasSubmitted) return;
		setAbsentIds((prev) => prev.filter((sid) => sid !== id));
		setPresentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
	};

	const handleMarkAbsent = (id) => {
		if (hasSubmitted) return;
		setPresentIds((prev) => prev.filter((sid) => sid !== id));
		setAbsentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
	};

	const markAllStatus = (status) => {
		if (hasSubmitted) return;
		const allIds = students.map((s) => s.id);
		if (status === "present") { setPresentIds(allIds); setAbsentIds([]); }
		else { setAbsentIds(allIds); setPresentIds([]); }
	};

	const handleManualSaveDraft = () => {
		if (!selectedCourse || hasSubmitted) return;
		saveDraftToStorage(`${selectedCourse.id}_${selectedDate}`, { presentIds, absentIds });
		setIsSaveSuccessOpen(true);
	};

	// ── Submit attendance ────────────────────────────────────────────────────
	const handleSaveAttendance = async () => {
		if (!selectedCourse || hasSubmitted) return;
		setSubmitLoading(true);
		setSubmitError(null);
		setIsConfirmModalOpen(false);

		try {
			const response = await attendanceService.markAttendance(
				selectedCourse.id,
				{ studentIds: presentIds, date: selectedDate, status: "final" },
				selectedCourse.id,
			);

			if (response.status === "success" || response.success) {
				setHasSubmitted(true);
				setQrToken("");
				setTimeLeft(0);
				clearDraftFromStorage(`${selectedCourse.id}_${selectedDate}`);
				setIsSubmitSuccessOpen(true);
			} else {
				throw new Error(response.error || response.message || "Failed to finalize attendance");
			}
		} catch (err) {
			setSubmitError(err.message || "Submission failed. Please try again.");
			console.error("Failed to submit attendance:", err);
		} finally {
			setSubmitLoading(false);
		}
	};

	const actions = {
		onSelectCourse: (course) =>
			navigate(course ? `/attendance-management/${course.id}` : "/attendance-management"),
		onRefresh: fetchData,
		onGenerateQR: generateNewQR,
		onMarkPresent: handleMarkPresent,
		onMarkAbsent: handleMarkAbsent,
		onMarkAll: markAllStatus,
		setQrTimeout,
		onSaveDraft: handleManualSaveDraft,
		onSaveClick: () => setIsConfirmModalOpen(true),
		onConfirmSave: handleSaveAttendance,
		setConfirmModal: setIsConfirmModalOpen,
		setSaveSuccessModal: setIsSaveSuccessOpen,
		setSubmitSuccessModal: setIsSubmitSuccessOpen,
		switchToLogs: () => navigate("/attendance-management/logs"),
		switchToManagement: () => navigate("/attendance-management"),
		openQRView: () => navigate(`/attendance-management/${courseId}/qr`),
		closeQRView: () => navigate(`/attendance-management/${courseId}`),
	};

	const value = {
		courses: activeCourses,
		students,
		presentIds,
		absentIds,
		profLogs,
		leaveApplications,
		qr: { token: qrToken, timeLeft, qrTimeout },
		loading,
		error,
		markingLoading,
		submitLoading,
		hasSubmitted,
		submitError,
		viewMode,
		selectedCourse,
		departmentMapping,
		isConfirmModalOpen,
		isSaveSuccessOpen,
		isSubmitSuccessOpen,
		selectedDate,
		setSelectedDate,
		allowedDates,
		actions,
	};

	return (
		<AttendanceContext.Provider value={value}>
			{children}
		</AttendanceContext.Provider>
	);
};