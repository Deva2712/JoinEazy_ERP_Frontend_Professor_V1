// src/pages/Dashboard/useDashboardData.js
import { useState, useEffect } from "react";
import { userService } from "@/api/services/user.service";
import { scheduleService } from "@/api/services/schedule.service";
import { leaveService } from "@/api/services/leave.service";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const buildProfessorTasks = (data, scheduleResponse, leaveResponse, today, todayISO, todayName) => {
	// 1. Timetable — classes happening today
	let timetableTasks = [];
	if (scheduleResponse.success && scheduleResponse.data.schedule?.timetable) {
		timetableTasks = scheduleResponse.data.schedule.timetable
			.filter((slot) => {
				const startDate = slot.startDate || "1970-01-01";
				const endDate = slot.endDate || "9999-12-31";
				return slot.day === todayName && todayISO >= startDate && todayISO <= endDate;
			})
			.map((slot) => ({
				id: `class-${slot.id || Math.random()}`,
				title: `${slot.courseName} • Room ${slot.roomNumber}`,
				date: "Today",
				time: slot.startTime,
				completed: false,
				type: "class",
			}));
	}

	// 2. Meetings — deduplicated, today only
	const rawMeetings = [
		...(data.upcomingMeetings || []),
		...(scheduleResponse.data?.scheduledMeetings || []),
	];
	const meetingTasks = rawMeetings
		.filter(
			(m, index, self) =>
				new Date(m.dateTime || m.startTime).toDateString() === today.toDateString() &&
				self.findIndex((t) => t.id === m.id) === index,
		)
		.map((m) => ({
			id: `meeting-${m.id}`,
			title: `Meeting with ${m.participantName}`,
			date: "Today",
			time: new Date(m.dateTime || m.startTime).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			completed: false,
			type: "meeting",
		}));

	// 3. Assignments — grading tasks
	const assignmentTasks = (data.todoAssignments || []).map((a) => ({
		id: `assignment-${a.id}`,
		title: `Grade: ${a.title}`,
		date: new Date(a.dueDate).toLocaleDateString(),
		time: "Due",
		completed: false,
		type: "assignment",
	}));

	// 4. Substitutions — accepted, today only
	let substitutionTasks = [];
	const subData = leaveResponse.data || leaveResponse;
	if (subData?.substitutionRequests) {
		substitutionTasks = subData.substitutionRequests
			.filter((sub) => {
				const isAccepted = sub.status === "Accepted";
				const isToday = new Date(sub.fromDate).toDateString() === today.toDateString();
				return isAccepted && isToday;
			})
			.map((sub) => ({
				id: `sub-${sub.id}`,
				title: `Covering: ${sub.courseName || "Class"} for ${sub.requesterName}`,
				date: "Today",
				time: sub.timings?.startTime || "Scheduled",
				completed: false,
				type: "substitution",
			}));
	}

	return [...timetableTasks, ...meetingTasks, ...assignmentTasks, ...substitutionTasks];
};

const buildStudentTasks = (data, today) => {
	// 1. Pending assignments — sorted by due date
	const assignmentTasks = (data.todoAssignments || [])
		.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
		.map((a) => {
			const due = new Date(a.dueDate);
			const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
			const dateLabel =
				diff < 0
					? "Overdue"
					: diff === 0
						? "Today"
						: diff === 1
							? "Tomorrow"
							: due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
			return {
				id: `assignment-${a.id}`,
				title: a.title,
				date: dateLabel,
				time: a.courseName || "Assignment",
				completed: false,
				type: "assignment",
			};
		});

	// 2. Meetings — today only
	const meetingTasks = (data.upcomingMeetings || [])
		.filter((m) => new Date(m.dateTime || m.startTime).toDateString() === today.toDateString())
		.map((m) => ({
			id: `meeting-${m.id}`,
			title: m.subject || `Meeting with ${m.participantName}`,
			date: "Today",
			time: new Date(m.dateTime || m.startTime).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			completed: false,
			type: "meeting",
		}));

	return [...meetingTasks, ...assignmentTasks];
};

const useDashboardData = () => {
	const [userType, setUserType] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [cohorts, setCohorts] = useState([]);
	const [statsData, setStatsData] = useState({});
	const [userProfile, setUserProfile] = useState({
		fullName: "Demo User",
		rollNumber: "N/A",
		organization: "Mahindra University",
		semester: null,
		academicYear: null,
	});

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);

			const dashResponse = await userService.getDashboardOverview();

			if (!dashResponse.success) {
				setUserType(0);
				setError(dashResponse.error || "Failed to fetch data");
				return;
			}

			const { data } = dashResponse;

			const role = localStorage.getItem("userRole");
			const isStaff = data.isAllowedCreate || data.isAllowedCreateCohort || data.is_allowed_create_cohort || role === "professor" || role === "hod" || role === "hr";
			setUserType(isStaff ? 1 : 0);

			const [scheduleResponse, leaveResponse] = isStaff
				? await Promise.all([
						scheduleService.getScheduleOverview(),
						leaveService.getApplications(),
					])
				: [null, null];

			setUserProfile({
				fullName: data.user?.fullName || data.user?.name || "Demo User",
				employeeId: data.user?.employeeId || "N/A",
				organization: data.user?.organization || "Mahindra University",
				department: data.user?.department || data.user?.departmentName || null,
				semester: data.user?.currentSemester || null,
				academicYear: data.user?.academicYear || null,
			});

			setCohorts(data.cohorts || data.joinedCohorts || []);
			setStatsData({
				todoAssignments: data.todoAssignments || [],
				meetings: data.upcomingMeetings || [],
			});

			const today = new Date();
			const todayISO = today.toISOString().split("T")[0];
			const todayName = DAYS[today.getDay()];

			const newTasks = isStaff
				? buildProfessorTasks(data, scheduleResponse, leaveResponse, today, todayISO, todayName)
				: buildStudentTasks(data, today);

			setTasks(newTasks);
		} catch (err) {
			console.error("Dashboard Load Error:", err);
			setError("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
		document.title = "Dashboard - Joineazy";
	}, []);

	const handleToggleTask = (taskId) => {
		setTasks((prev) =>
			prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
		);
	};

	const handleAddTask = (task) => {
		setTasks((prev) => [task, ...prev]);
	};

	return {
		userType,
		loading,
		error,
		tasks,
		cohorts,
		statsData,
		userProfile,
		onRetry: fetchDashboardData,
		onToggleTask: handleToggleTask,
		onAddTask: handleAddTask,
	};
};

export default useDashboardData;