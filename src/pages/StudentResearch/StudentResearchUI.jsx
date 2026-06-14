
// src/pages/StudentResearch/StudentResearchUI.jsx

import React from "react";
import { BookOpen, ArrowLeft, Compass, Send, Microscope, RefreshCw, AlertTriangle } from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import MyProjectsStudentView from "./views/MyProjectsStudentView";
import MyPublicationsStudentView from "./views/MyPublicationsStudentView";
import ExploreResearchStudentView from "./views/ExploreResearchStudentView";
import ApplicationsStudentView from "./views/ApplicationsStudentView";
import ResearchDetailsStudentView from "./views/ResearchDetailsStudentView";
import ApplicationModal from "./components/ApplicationModal";
import ResearchFilterSidebar from "./components/ResearchFilterSidebar";
import useStudentResearchUI from "./hooks/Usestudentresearchui";

const TABS = [
	{ key: "my-projects", label: "My Projects", icon: Microscope },
	{ key: "my-publications", label: "My Publications", icon: BookOpen },
	{ key: "explore", label: "Explore", icon: Compass },
	{ key: "my-applications", label: "My Applications", icon: Send },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────

const PageHeader = ({ statsData, viewMode, onTabChange, onNavigateBack }) => (
	<div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
		<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
				<div className="flex items-center gap-4">
					<button onClick={onNavigateBack} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
						<ArrowLeft className="size-5" />
					</button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Research Opportunities</h1>
						<p className="text-white/70 text-sm mt-0.5">Join research projects and explore publications.</p>
					</div>
				</div>
				<div className="flex items-center gap-3 pb-2 md:pb-0">
					{statsData.map((stat, i) => (
						<StatSummaryCard key={i} label={stat.label} value={stat.value} icon={stat.icon} />
					))}
				</div>
			</div>
			<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
				{TABS.map(({ key, label, icon: Icon }) => (
					<button key={key} onClick={() => onTabChange(key)}
						className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
							viewMode === key
								? "bg-gray-50 dark:bg-[#0f1117] text-blue-700 dark:text-blue-400"
								: "text-white/70 hover:text-white hover:bg-white/10"
						}`}
					>
						<Icon className="w-4 h-4" /> {label}
					</button>
				))}
			</div>
		</div>
	</div>
);

const TabViews = ({ viewMode, data, actions, setIsFilterSidebarOpen }) => {
	const { myProjects, myPublications, availableProjects, availablePublications, allUsers, myApplications } = data;
	const { setSelectedItem, personalSearchQuery, exploreSearchQuery, onPersonalSearchChange, onExploreSearchChange, filters } = actions;
	const openFilters = () => setIsFilterSidebarOpen(true);

	return (
		<div className="transition-all duration-300">
			{viewMode === "my-projects" && (
				<MyProjectsStudentView myProjects={myProjects} onSelectItem={setSelectedItem}
					searchQuery={personalSearchQuery} onSearchChange={onPersonalSearchChange} onOpenFilters={openFilters} />
			)}
			{viewMode === "my-publications" && (
				<MyPublicationsStudentView myPublications={myPublications} onSelectItem={setSelectedItem}
					searchQuery={personalSearchQuery} onSearchChange={onPersonalSearchChange} onOpenFilters={openFilters} />
			)}
			{viewMode === "explore" && (
				<ExploreResearchStudentView availableProjects={availableProjects} availablePublications={availablePublications}
					allUsers={allUsers} onSelectItem={setSelectedItem} searchQuery={exploreSearchQuery}
					onSearchChange={onExploreSearchChange} filters={filters} onOpenFilters={openFilters} />
			)}
			{viewMode === "my-applications" && (
				<ApplicationsStudentView applications={myApplications} searchQuery={personalSearchQuery} onSearchChange={onPersonalSearchChange} />
			)}
		</div>
	);
};

// ─── Main Component ─────────────────────────────────────────────────────────────

const StudentResearchUI = ({ data, view, actions }) => {
	const { rawMyProjects = [], rawMyPublications = [], rawAvailableProjects = [], rawAvailablePublications = [], availableProjects = [], availablePublications = [] } = data;
	const { loading, error, viewMode, selectedItem, filters } = view;
	const { onRefresh, onTabChange, onApply, onStar, setSelectedItem, setFilters } = actions;

	const { isApplyModalOpen, setIsApplyModalOpen, isFilterSidebarOpen, setIsFilterSidebarOpen, availableCategories, availableYears, navigate } =
		useStudentResearchUI({ rawAvailableProjects, rawAvailablePublications, selectedItem });

	const statsData = [
		{ label: "Projects Joined", value: rawMyProjects.length.toString(), icon: Microscope },
		{ label: "Publications", value: rawMyPublications.length.toString(), icon: BookOpen },
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			<PageHeader statsData={statsData} viewMode={viewMode} onTabChange={onTabChange} onNavigateBack={() => navigate("/dashboard")} />

			<main className="max-w-7xl mx-auto px-4 py-6 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-blue-600" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Research Data</p>
						<p className="text-sm">Please wait while we fetch research opportunities ...</p>
					</div>
				) : selectedItem ? (
					<>
						<button onClick={() => setSelectedItem(null)} className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-all group rounded-full">
							<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-blue-200 dark:group-hover:border-blue-800 group-hover:shadow-sm transition-all">
								<ArrowLeft className="size-4" />
							</div>
							<span className="text-xs uppercase tracking-widest">Return</span>
						</button>
						<ResearchDetailsStudentView type={selectedItem.type} data={selectedItem.data}
							onApply={() => setIsApplyModalOpen(true)} onStar={onStar} />
					</>
				) : (
					<TabViews viewMode={viewMode} data={data} actions={{ ...actions, ...view }} setIsFilterSidebarOpen={setIsFilterSidebarOpen} />
				)}
			</main>

			<ApplicationModal isOpen={isApplyModalOpen} type={selectedItem?.type === "project" ? "Project" : "Publication"}
				data={selectedItem?.data} onClose={() => setIsApplyModalOpen(false)}
				onSubmit={(formData) => onApply(selectedItem?.data?.id, formData, selectedItem?.type === "project" ? "Project" : "Publication")} />

			<ResearchFilterSidebar filters={filters} setFilters={setFilters} showTypeFilters={viewMode === "explore"}
				counts={{ projects: availableProjects.length, publications: availablePublications.length }}
				availableCategories={availableCategories} availableYears={availableYears}
				isOpen={isFilterSidebarOpen} onClose={() => setIsFilterSidebarOpen(false)} />

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default StudentResearchUI;