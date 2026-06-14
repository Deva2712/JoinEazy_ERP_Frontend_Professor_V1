// src/pages/ExamDuties/ExamDutiesController.jsx

import React, { useState, useEffect, useMemo } from "react";
// import { examAPI } from "../../services/api";
import { examService } from "../../api/services/exam.service";
import { useJobs } from "../../context/JobTrayContext";
import { useNotifications } from "../../context/NotificationContext";
import ExamDutiesUI from "./ExamDutiesUI";

/**
 * Controller for managing and displaying the Exam Schedule.
 */
const ExamDutiesController = () => {
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [activeTab, setActiveTab] = useState("current");
	const [selectedYear, setSelectedYear] = useState(
		new Date().getFullYear().toString(),
	);
	const [selectedMonth, setSelectedMonth] = useState("");

	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();

	useEffect(() => {
		fetchData();
		document.title = "Exam Duties";
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await examService.getDuties();
			const data = Array.isArray(response?.data)
				? response.data
				: response?.data?.data || [];
			setExams(data);
		} catch (err) {
			setError("Unable to load exam schedule. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return [currentYear.toString(), (currentYear - 1).toString()];
	}, []);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const filteredExams = useMemo(() => {
		if (activeTab === "current") {
			return exams.filter(
				(exam) =>
					new Date(exam.startTime) >= new Date().setHours(0, 0, 0, 0),
			);
		}
		if (!selectedMonth) return [];
		return exams.filter((exam) => {
			const d = new Date(exam.startTime);
			return (
				d.getFullYear().toString() === selectedYear &&
				months[d.getMonth()] === selectedMonth
			);
		});
	}, [exams, activeTab, selectedYear, selectedMonth]);

	/**
	 * Updates duty status based on the new workflow.
	 */
	const handleUpdateDutyStatus = async (id, status, reason = null) => {
		const previousExams = [...exams];

		const nextStatus = status === "REJECTION_REVOKED" ? "ASSIGNED" : status;

		setExams((prev) =>
			prev.map((exam) =>
				exam.id === id
					? {
							...exam,
							status: nextStatus,
							// This ensures the reason is saved when moving to review
							rejectionReason:
								status === "REJECTION_REVIEW"
									? reason
									: exam.rejectionReason,
							isCheckedIn: nextStatus === "CONFIRMED",
						}
					: exam,
			),
		);

		try {
			await Promise.all([
				examService.updateDutyStatus(id, {
					status: nextStatus,
					isCheckedIn: nextStatus === "CONFIRMED",
					reason,
				}),
				refreshJobs(),
				refreshNotifications(),
			]);
		} catch (err) {
			setExams(previousExams);
			setError("Failed to update status. Please try again.");
		}
	};

	return (
		<ExamDutiesUI
			exams={filteredExams}
			loading={loading}
			error={error}
			state={{ activeTab, selectedYear, selectedMonth, years, months }}
			actions={{
				onRefresh: fetchData,
				setActiveTab,
				setSelectedYear,
				setSelectedMonth,
				onUpdateStatus: handleUpdateDutyStatus,
			}}
		/>
	);
};

export default ExamDutiesController;
