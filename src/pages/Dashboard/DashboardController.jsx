// src/pages/Dashboard/DashboardController.jsx
import React from "react";
import StudentDashboardUI from "./StudentDashboardUI";
import ProfessorDashboardUI from "./ProfessorDashboardUI";
import HodDashboardUI from "./HodDashboardUI";
import HrDashboardUI from "./HrDashboardUI";
import useDashboardData from "./hooks/useDashboardData";

const DashboardController = () => {
	const {
		userType,
		loading,
		error,
		tasks,
		userProfile,
		onRetry,
		onToggleTask,
		onAddTask,
	} = useDashboardData();

	// localStorage role check
	const role = localStorage.getItem("userRole");
	const isHod      = role === "hod";
	const isHr       = role === "hr";
	const isProfessor = userType === 1 || role === "professor";

	// HR → HrDashboardUI (separate violet-themed dashboard)
	if (isHr) {
		return (
			<HrDashboardUI
				loading={loading}
				error={error}
				onRetry={onRetry}
				userProfile={userProfile}
				tasks={tasks}
				onToggleTask={onToggleTask}
			/>
		);
	}

	// HoD → HodDashboardUI (teal theme)
	if (isHod) {
		return (
			<HodDashboardUI
				loading={loading}
				error={error}
				onRetry={onRetry}
				userProfile={userProfile}
				tasks={tasks}
				onToggleTask={onToggleTask}
			/>
		);
	}

	// Professor → ProfessorDashboardUI
	// Student → StudentDashboardUI
	return isProfessor ? (
		<ProfessorDashboardUI
			loading={loading}
			error={error}
			onRetry={onRetry}
			userProfile={userProfile}
			tasks={tasks}
			onToggleTask={onToggleTask}
		/>
	) : (
		<StudentDashboardUI
			loading={loading}
			error={error}
			onRetry={onRetry}
			userProfile={userProfile}
			tasks={tasks}
			onToggleTask={onToggleTask}
			onAddTask={onAddTask}
		/>
	);
};

export default DashboardController;