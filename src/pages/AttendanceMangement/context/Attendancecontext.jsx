// src/pages/AttendanceManagement/context/AttendanceContext.jsx

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
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
	if (!ctx)
		throw new Error("useAttendance must be used inside AttendanceProvider");
	return ctx;
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
				setActiveCourses(
					courses.map((c) => ({
						id: c.id,
						cohort_name: c.cohort_name || "Untitled Course",
						course_codes: Array.isArray(c.course_codes) ? c.course_codes : [],
						member_count: c.member_count || 0,
					})),
				);
			}

			if (logsRes.status === "success" || logsRes.success) {
			 console.log('profLogs data:', logsRes.data);
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

	useEffect(() => {
		if (!selectedCourse) return;

		const fetchStudents = async () => {
			setMarkingLoading(true);
			setSubmitError(null);

			try {
				const response = await attendanceService.getAttendanceLogs(selectedCourse.id);

				if (response.status === "success" || response.success) {
					const { students: list, logs, isFinal } = response.data;
					const today = getTodayString();
					const logsForToday = logs?.[today] || [];

					setDepartmentMapping(response.departmentMapping);
					setStudents(list || []);

					if (isFinal) {
						setHasSubmitted(true);
						setPresentIds(logsForToday);
						setAbsentIds(
							(list || []).map((s) => s.id).filter((id) => !logsForToday.includes(id)),
						);
						clearDraftFromStorage(selectedCourse.id);
					} else {
						setHasSubmitted(false);
						const draft = loadDraftFromStorage(selectedCourse.id);
						if (draft) {
							setPresentIds(draft.presentIds || []);
							setAbsentIds(draft.absentIds || []);
						} else {
							setPresentIds(logsForToday);
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
	}, [selectedCourse?.id]);

	const handleTimerExpiry = useCallback(() => {
		if (hasSubmitted) return;
		const marked = [...presentIds, ...absentIds];
		const remaining = students.map((s) => s.id).filter((id) => !marked.includes(id));
		if (remaining.length > 0) {
			setAbsentIds((prev) => [...new Set([...prev, ...remaining])]);
		}
		setQrToken("");
	}, [students, presentIds, absentIds, hasSubmitted]);

	useEffect(() => {
		let timer;
		if (qrToken && timeLeft > 0) {
			timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
		} else if (timeLeft === 0 && qrToken) {
			handleTimerExpiry();
			if (viewMode === "qr-view") {
				navigate(`/attendance-management/${courseId}`);
			}
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
		if (viewMode === "qr-view" && !qrToken && !hasSubmitted && timeLeft > 0) {
			generateNewQR();
		}
	}, [viewMode, qrToken, hasSubmitted, generateNewQR, timeLeft]);

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
		if (status === "present") {
			setPresentIds(allIds);
			setAbsentIds([]);
		} else {
			setAbsentIds(allIds);
			setPresentIds([]);
		}
	};

	const handleManualSaveDraft = () => {
		if (!selectedCourse || hasSubmitted) return;
		saveDraftToStorage(selectedCourse.id, { presentIds, absentIds });
		setIsSaveSuccessOpen(true);
	};

	const handleSaveAttendance = async () => {
		if (!selectedCourse || hasSubmitted) return;
		setSubmitLoading(true);
		setSubmitError(null);
		setIsConfirmModalOpen(false);

		try {
			// FIX: cohortId was undefined — use selectedCourse.id instead
			const response = await attendanceService.markAttendance(
				selectedCourse.id,
				{
					studentIds: presentIds,
					date: getTodayString(),
					status: "final",
				},
				selectedCourse.id,  // cohortId = same as courseId for this context
			);

			if (response.status === "success" || response.success) {
				setHasSubmitted(true);
				setQrToken("");
				setTimeLeft(0);
				clearDraftFromStorage(selectedCourse.id);
				setIsSubmitSuccessOpen(true);
			} else {
				throw new Error(response.message || "Failed to finalize attendance");
			}
		} catch (err) {
			setSubmitError("Submission failed. Please try again.");
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
		actions,
	};

	return (
		<AttendanceContext.Provider value={value}>
			{children}
		</AttendanceContext.Provider>
	);
};