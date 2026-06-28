// src/pages/Research/ResearchUI.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Compass, Send, Microscope, RefreshCw, AlertTriangle } from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import StatSummaryCard     from "../../components/common/StatSummaryCard";

import MyProjectsView      from "./views/MyProjectsView";
import MyPublicationsView  from "./views/MyPublicationsView";
import ExploreResearchView from "./views/ExploreResearchView";
import ApplicationsView    from "./views/ApplicationsView";
import ResearchDetailsView from "./views/ResearchDetailsView";
import UserProfileView     from "./views/UserProfileView";

import ApplicationModal        from "./components/ApplicationModal";
import PostResearchModal        from "./components/PostResearchModal";
import RoleManagementModal      from "./components/RoleManagementModal";
import TimelineManagementModal  from "./components/TimelineManagementModal";
import EditProfileModal         from "./components/EditProfileModal";
import ResearchFilterSidebar    from "./components/ResearchFilterSidebar";

import { useResearchUI } from "./components/Useresearchui";

const TABS = [
	{ key: "my-projects",     label: "My Projects",    icon: Microscope },
	{ key: "my-publications", label: "My Publications", icon: BookOpen   },
	{ key: "explore",         label: "Explore",         icon: Compass    },
	{ key: "my-applications", label: "Applications",    icon: Send       },
];

const BackButton = ({ onClick }) => (
	<button onClick={onClick} className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-all group rounded-full">
		<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 group-hover:shadow-sm transition-all">
			<ArrowLeft className="size-4" />
		</div>
		<span className="text-xs uppercase tracking-widest">Return</span>
	</button>
);

const ResearchUI = ({ data, view, actions }) => {
	const {
		myProjects = [], myPublications = [], rawMyProjects = [], rawMyPublications = [],
		availableProjects = [], availablePublications = [], myApplications = [],
		timelineEvents = [], availableParticipants = [], allUsers = [],
		rawAvailableProjects = [], rawAvailablePublications = [],
	} = data;

	const { loading, error, viewMode, selectedItem, selectedUser, personalSearchQuery, exploreSearchQuery, filters } = view;
	const { onRefresh, onTabChange, onApply, onStar, setSelectedItem, setFilters,
		onPersonalSearchChange, onExploreSearchChange, onCreateSubmit, onUpdateSubmit,
		onDeleteRole, onDeleteTimelineEvent, onViewUser, onClearUser, onUpdateUser, onApplicationAction } = actions;

	const navigate = useNavigate();
	const ui = useResearchUI({ data, view, actions });

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			{/* Hero */}
			<div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-800 dark:from-emerald-900 dark:via-emerald-950 dark:to-teal-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Research & Publications</h1>
								<p className="text-white/70 text-sm mt-0.5">Manage your research work and explore literature.</p>
							</div>
						</div>
						<div className="flex items-center gap-3 pb-2 md:pb-0">
							<StatSummaryCard label="Projects"     value={rawMyProjects.length.toString()}     icon={Microscope} />
							<StatSummaryCard label="Publications" value={rawMyPublications.length.toString()} icon={BookOpen}   />
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{TABS.map(({ key, label, icon: Icon }) => (
							<button key={key} onClick={() => onTabChange(key)}
								className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${viewMode === key ? "bg-gray-50 dark:bg-[#0f1117] text-emerald-700 dark:text-emerald-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
								<Icon className="w-4 h-4" /> {label}
							</button>
						))}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-6 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6"><AlertTriangle className="size-10 text-red-600" /></div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-emerald-600" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Research Data</p>
						<p className="text-sm">Please wait while we fetch your research works...</p>
					</div>
				) : selectedUser ? (
					<>
						<BackButton onClick={onClearUser} />
						<UserProfileView user={data.selectedUser} projects={data.userProjects} publications={data.userPublications}
							onSelectItem={setSelectedItem} onStar={onStar} onEditProfile={() => ui.setIsEditProfileModalOpen(true)} onBack={onClearUser} />
					</>
				) : selectedItem ? (
					<>
						<BackButton onClick={() => setSelectedItem(null)} />
						<ResearchDetailsView
							type={selectedItem.type} data={selectedItem.data} timeline={timelineEvents}
							onApply={() => ui.setIsApplyModalOpen(true)} onStar={onStar} onViewUser={onViewUser}
							onEdit={() => ui.handleOpenEditModal(selectedItem.data, selectedItem.type === "project" ? "Project" : "Publication")}
							onCreateRole={(id) => ui.handleOpenRoleModal(id)}
							onUpdateRole={(id, roleId) => { const role = selectedItem.data.openRoles?.find((r) => r.id === roleId); ui.handleOpenRoleModal(id, role); }}
							onDeleteRole={onDeleteRole}
							onAddTimeline={() => ui.handleOpenTimelineModal()}
							onEditTimeline={(event) => ui.handleOpenTimelineModal(event)}
							onDeleteTimeline={onDeleteTimelineEvent}
						/>
					</>
				) : (
					<div className="transition-all duration-300">
						{viewMode === "my-projects"     && <MyProjectsView     myProjects={myProjects}         onSelectItem={setSelectedItem} searchQuery={personalSearchQuery} onSearchChange={onPersonalSearchChange} onPostNew={() => ui.handleOpenCreateModal("Project")}     onOpenFilters={() => ui.setIsFilterSidebarOpen(true)} />}
						{viewMode === "my-publications" && <MyPublicationsView myPublications={myPublications} onSelectItem={setSelectedItem} searchQuery={personalSearchQuery} onSearchChange={onPersonalSearchChange} onPostNew={() => ui.handleOpenCreateModal("Publication")} onOpenFilters={() => ui.setIsFilterSidebarOpen(true)} />}
						{viewMode === "explore"         && <ExploreResearchView availableProjects={availableProjects} allPublications={availablePublications} allUsers={allUsers} onSelectItem={setSelectedItem} onViewUser={onViewUser} searchQuery={exploreSearchQuery} onSearchChange={onExploreSearchChange} filters={filters} onOpenFilters={() => ui.setIsFilterSidebarOpen(true)} onStar={onStar} />}
						{viewMode === "my-applications" && <ApplicationsView   applications={myApplications}   searchQuery={personalSearchQuery} onSearchChange={onPersonalSearchChange} onApplicationAction={onApplicationAction} onViewUser={onViewUser} />}
					</div>
				)}
			</main>

			{/* Modals */}
			<ApplicationModal isOpen={ui.isApplyModalOpen} type={selectedItem?.type === "project" ? "Project" : "Publication"} data={selectedItem?.data}
				onClose={() => ui.setIsApplyModalOpen(false)}
				onSubmit={(fd) => onApply(selectedItem?.data?.id, fd, selectedItem?.type === "project" ? "Project" : "Publication")} />

			<PostResearchModal isOpen={ui.isCreateModalOpen} type={ui.createType} initialData={ui.editData} allUsers={allUsers}
				onClose={() => ui.setIsCreateModalOpen(false)}
				onSubmit={ui.editData ? onUpdateSubmit : onCreateSubmit} />

			<RoleManagementModal isOpen={ui.isRoleModalOpen} initialData={ui.editingRole}
				onClose={() => { ui.setIsRoleModalOpen(false); ui.setEditingRole(null); }}
				onSubmit={ui.handleRoleSubmit} />

			<TimelineManagementModal isOpen={ui.isTimelineModalOpen} initialData={ui.editingEvent}
				onClose={() => { ui.setIsTimelineModalOpen(false); ui.setEditingEvent(null); }}
				onSubmit={ui.handleTimelineSubmit} availableParticipants={availableParticipants} availableContributors={ui.getPotentialContributors()} />

			<EditProfileModal isOpen={ui.isEditProfileModalOpen} user={selectedUser}
				onClose={() => ui.setIsEditProfileModalOpen(false)} onSubmit={onUpdateUser} />

			<ResearchFilterSidebar filters={filters} setFilters={setFilters} showTypeFilters={viewMode === "explore"}
				counts={{ projects: availableProjects.length, publications: availablePublications.length }}
				availableCategories={ui.availableCategories} availableYears={ui.availableYears}
				isOpen={ui.isFilterSidebarOpen} onClose={() => ui.setIsFilterSidebarOpen(false)} />

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default ResearchUI;