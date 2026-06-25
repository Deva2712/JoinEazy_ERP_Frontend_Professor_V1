// src/pages/Schedule/useScheduleData.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { scheduleService } from "@/api/services/schedule.service";
import { useNotifications } from "../../../context/NotificationContext";

export const useScheduleData = () => {
	const [userRole, setUserRole] = useState("student");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [scheduledMeetings, setScheduledMeetings] = useState([]);
	const [meetingRequests, setMeetingRequests] = useState([]);
	const [schedule, setSchedule] = useState(null);
	const [outgoingRequests, setOutgoingRequests] = useState([]);
	const [selectedDateFilter, setSelectedDateFilter] = useState(new Date());
	const [acceptedMeetings, setAcceptedMeetings] = useState([]);

	const location = useLocation();
	const { refreshNotifications } = useNotifications();

	const preFillData = location.state?.preFill;

	const fetchUserData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const role = localStorage.getItem("userRole") || "student";
			setUserRole(role);

			if (role === "professor" || role === "hod") {
				const response = await scheduleService.getScheduleOverview();
				if (response.success) {
					setScheduledMeetings(response.data.scheduledMeetings || []);
					setSchedule(response.data.schedule || null);
					setMeetingRequests(response.data.meetingRequests || []);
					setOutgoingRequests(response.data.outgoingRequests || []);
				} else {
					throw new Error("Failed to fetch schedule data.");
				}
			}
		} catch (err) {
			console.error("Error fetching schedule:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUserData();
		document.title = "Schedule & Meetings";
	}, [fetchUserData]);

	// ── Derived Data ──

	const allDisplayMeetings = useMemo(() => {
		return [
			...(scheduledMeetings || []),
			...acceptedMeetings,
		];
	}, [scheduledMeetings, acceptedMeetings]);

	const dateContext = useMemo(() => {
		if (!selectedDateFilter) return { toDateString: "", toISOString: "", dayName: "" };
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		return {
			toDateString: selectedDateFilter.toDateString(),
			toISOString: selectedDateFilter.toISOString().split("T")[0],
			dayName: days[selectedDateFilter.getDay()],
		};
	}, [selectedDateFilter]);

	const filteredMeetings = useMemo(() => {
		const { toDateString } = dateContext;
		return allDisplayMeetings.filter(
			(m) => new Date(m.startTime).toDateString() === toDateString,
		);
	}, [allDisplayMeetings, dateContext]);

	const filteredTimetable = useMemo(() => {
		if (!schedule?.timetable) return [];
		const { dayName, toISOString } = dateContext;

		return schedule.timetable.filter((slot) => {
			const startDate = slot.startDate || "1970-01-01";
			const endDate = slot.endDate || "9999-12-31";
			return (
				slot.day === dayName &&
				toISOString >= startDate &&
				toISOString <= endDate
			);
		});
	}, [schedule?.timetable, dateContext]);

	const availableCourses = useMemo(() => {
		if (!schedule?.timetable) return [];
		const courseMap = new Map();

		schedule.timetable.forEach((item) => {
			if (!courseMap.has(item.courseName)) {
				courseMap.set(item.courseName, {
					id: `course-${courseMap.size}`,
					courseName: item.courseName,
					courseCodes: new Set(),
				});
			}
			if (item.courseCode) {
				courseMap.get(item.courseName).courseCodes.add(item.courseCode);
			}
		});

		return Array.from(courseMap.values()).map((course) => ({
			...course,
			courseCodes: Array.from(course.courseCodes),
		}));
	}, [schedule?.timetable]);

	return {
		userRole, loading, error, schedule, setSchedule,
		meetingRequests, setMeetingRequests,
		outgoingRequests, setOutgoingRequests,
		acceptedMeetings, setAcceptedMeetings,
		selectedDateFilter, setSelectedDateFilter,
		allDisplayMeetings, filteredMeetings, filteredTimetable, availableCourses,
		preFillData, fetchUserData, refreshNotifications,
	};
};