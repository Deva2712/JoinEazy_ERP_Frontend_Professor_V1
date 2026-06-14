// src/pages/Research/useResearchUI.js
import { useState, useEffect, useMemo } from "react";

export function useResearchUI({ data, view, actions }) {
	const { rawAvailableProjects = [], rawAvailablePublications = [], selectedItem, selectedUser } = { ...data, ...view };

	const [isApplyModalOpen,       setIsApplyModalOpen]       = useState(false);
	const [isCreateModalOpen,      setIsCreateModalOpen]      = useState(false);
	const [createType,             setCreateType]             = useState("Project");
	const [editData,               setEditData]               = useState(null);
	const [isRoleModalOpen,        setIsRoleModalOpen]        = useState(false);
	const [activeResearchId,       setActiveResearchId]       = useState(null);
	const [editingRole,            setEditingRole]            = useState(null);
	const [isTimelineModalOpen,    setIsTimelineModalOpen]    = useState(false);
	const [editingEvent,           setEditingEvent]           = useState(null);
	const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
	const [isFilterSidebarOpen,    setIsFilterSidebarOpen]    = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [view.selectedItem, view.selectedUser, view.viewMode]);

	// ── Modal helpers ─────────────────────────────────────────────────────────
	const handleOpenCreateModal = (type) => { setEditData(null); setCreateType(type); setIsCreateModalOpen(true); };
	const handleOpenEditModal   = (item, type) => { setEditData(item); setCreateType(type); setIsCreateModalOpen(true); };

	const handleOpenRoleModal = (researchId, role = null) => {
		setActiveResearchId(researchId);
		setEditingRole(role);
		setIsRoleModalOpen(true);
	};

	const handleRoleSubmit = (formData) => {
		if (editingRole?.id) actions.onUpdateRole(activeResearchId, editingRole.id, formData);
		else                 actions.onCreateRole(activeResearchId, formData);
		setIsRoleModalOpen(false);
		setEditingRole(null);
	};

	const handleOpenTimelineModal = (event = null) => { setEditingEvent(event); setIsTimelineModalOpen(true); };

	const handleTimelineSubmit = (formData) => {
		if (editingEvent) actions.onUpdateTimelineEvent(view.selectedItem.data.id, editingEvent.id, formData);
		else              actions.onAddTimelineEvent(view.selectedItem.data.id, formData);
		setIsTimelineModalOpen(false);
	};

	const getPotentialContributors = () => {
		if (!view.selectedItem?.data) return [];
		const { professorName, collaborators, coAuthors } = view.selectedItem.data;
		return [...new Set([...(professorName ? [professorName] : []), ...(collaborators || coAuthors || [])])];
	};

	// ── Derived filter metadata ───────────────────────────────────────────────
	const availableCategories = useMemo(() => {
		const all = [...rawAvailableProjects, ...rawAvailablePublications];
		return [...new Set(all.map((i) => i.category))].filter(Boolean).sort();
	}, [rawAvailableProjects, rawAvailablePublications]);

	const availableYears = useMemo(() => {
		const all = [...rawAvailableProjects, ...rawAvailablePublications];
		const years = all.map((i) => { const d = i.createdAt || i.publishedDate; return d ? new Date(d).getFullYear().toString() : null; });
		return [...new Set(years.filter(Boolean))].sort((a, b) => b - a);
	}, [rawAvailableProjects, rawAvailablePublications]);

	return {
		// modal state
		isApplyModalOpen, setIsApplyModalOpen,
		isCreateModalOpen, setIsCreateModalOpen,
		createType, editData,
		isRoleModalOpen, setIsRoleModalOpen,
		editingRole, setEditingRole,
		isTimelineModalOpen, setIsTimelineModalOpen,
		editingEvent, setEditingEvent,
		isEditProfileModalOpen, setIsEditProfileModalOpen,
		isFilterSidebarOpen, setIsFilterSidebarOpen,
		// handlers
		handleOpenCreateModal, handleOpenEditModal,
		handleOpenRoleModal, handleRoleSubmit,
		handleOpenTimelineModal, handleTimelineSubmit,
		getPotentialContributors,
		// derived
		availableCategories, availableYears,
	};
}