// src/pages/AttendanceManagement/useAttendanceUI.js

import { useState, useMemo } from "react";

const useAttendanceUI = ({ students, profLogs, presentIds, absentIds }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeMonth, setActiveMonth] = useState(new Date());
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [departmentQuery, setDepartmentQuery] = useState("All");

	const departments = useMemo(
		() => [...new Set(students.map((s) => s.department))],
		[students],
	);

	const filteredStudents = useMemo(() => {
		return students.filter((s) => {
			const matchesSearch =
				s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesDept =
				departmentQuery === "All" || s.department === departmentQuery;
			return matchesSearch && matchesDept;
		});
	}, [students, searchQuery, departmentQuery]);

	const sortedFilteredLogs = useMemo(() => {
		return profLogs
			.filter((log) => {
				const d = new Date(log.date);
				return (
					d.getMonth() === activeMonth.getMonth() &&
					d.getFullYear() === activeMonth.getFullYear()
				);
			})
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}, [profLogs, activeMonth]);

	const allMarked = useMemo(() => {
		if (!students.length) return false;
		return students.every(
			(s) => presentIds.includes(s.id) || absentIds.includes(s.id),
		);
	}, [students, presentIds, absentIds]);

	return {
		searchQuery, setSearchQuery,
		activeMonth, setActiveMonth,
		isSettingsOpen, setIsSettingsOpen,
		departmentQuery, setDepartmentQuery,
		departments, filteredStudents, sortedFilteredLogs, allMarked,
	};
};

export default useAttendanceUI;