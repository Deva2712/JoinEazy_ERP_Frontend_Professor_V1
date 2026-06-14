import { useState, useEffect } from "react";
/**
 * useMaintenanceUI
 * Handles all local state and derived data for the Maintenance page.
 */
export function useMaintenanceUI({ requests = [], technicians = [], activeTab }) {
	const [historyCategory, setHistoryCategory] = useState("university");
	const [showRequestForm, setShowRequestForm] = useState(false);

	const defaultForm = {
		issueType: "",
		component: "",
		location: "",
		description: "",
		priority: "medium",
		category:
			activeTab === "history" || activeTab === "support"
				? "university"
				: activeTab,
	};
	const [formData, setFormData] = useState(defaultForm);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const getTechnicianInfo = (techId) =>
		technicians.find((t) => t.id === techId) || null;

	const displayRequests = requests.filter((req) => {
		const isResolved = ["solved", "closed", "rejected"].includes(req.status);
		if (activeTab === "history") {
			if (!isResolved) return false;
			return historyCategory === "all" || req.category === historyCategory;
		}
		return !isResolved && req.category === activeTab;
	});

	const statsData = [
		{
			label: "Pending Requests",
			value: requests
				.filter((r) => ["pending", "viewed", "inProgress"].includes(r.status))
				.length.toString(),
		},
		{
			label: "Action Required",
			value: requests.filter((r) => r.requiresAction).length.toString(),
		},
	];

	const openRequestForm = () => {
		setFormData({ ...defaultForm, category: activeTab });
		setShowRequestForm(true);
	};

	const closeRequestForm = () => setShowRequestForm(false);

	const handleFormSubmit = async (e, onSubmitRequest) => {
		e.preventDefault();
		const success = await onSubmitRequest(formData);
		if (success) {
			closeRequestForm();
			setFormData(defaultForm);
		}
	};

	return {
		historyCategory,
		setHistoryCategory,
		showRequestForm,
		formData,
		setFormData,
		defaultForm,
		displayRequests,
		statsData,
		getTechnicianInfo,
		openRequestForm,
		closeRequestForm,
		handleFormSubmit,
	};
}