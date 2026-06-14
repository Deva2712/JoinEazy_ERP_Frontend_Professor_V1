// src/pages/StudentResearch/useStudentResearchUI.js

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const useStudentResearchUI = ({ rawAvailableProjects = [], rawAvailablePublications = [], selectedItem }) => {
	const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
	const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [selectedItem]);

	const availableCategories = useMemo(() => {
		const allItems = [...rawAvailableProjects, ...rawAvailablePublications];
		return [...new Set(allItems.map((item) => item.category))].filter(Boolean).sort();
	}, [rawAvailableProjects, rawAvailablePublications]);

	const availableYears = useMemo(() => {
		const allItems = [...rawAvailableProjects, ...rawAvailablePublications];
		const years = allItems.map((item) => {
			const date = item.createdAt || item.publishedDate;
			return date ? new Date(date).getFullYear().toString() : null;
		});
		return [...new Set(years.filter(Boolean))].sort((a, b) => b - a);
	}, [rawAvailableProjects, rawAvailablePublications]);

	return {
		isApplyModalOpen, setIsApplyModalOpen,
		isFilterSidebarOpen, setIsFilterSidebarOpen,
		availableCategories, availableYears,
		navigate,
	};
};

export default useStudentResearchUI;