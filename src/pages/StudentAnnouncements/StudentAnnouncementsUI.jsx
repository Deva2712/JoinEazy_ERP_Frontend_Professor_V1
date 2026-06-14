// src/pages/StudentAnnouncements/StudentAnnouncementsUI.jsx

import React, { useState } from "react";
import {
	Megaphone,
	RefreshCw,
	ArrowLeft,
	Search,
	Calendar,
	AlertCircle,
	SlidersHorizontal,
	AlertTriangle,
	Pin,
	BookOpen,
	Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import StudentAnnouncementCard from "./components/StudentAnnouncementCard";
import StudentAnnouncementFilterSidebar from "./components/StudentAnnouncementFilterSidebar";

/**
 * UI Component for Student Announcements Page.
 * Displays institution, department, and course announcements in a read-only feed.
 * Students can filter and search but cannot create announcements.
 */
const StudentAnnouncementsUI = ({
	announcements = [],
	cohorts = [],
	loading = false,
	error = null,
	stats = {},
	filters = {},
	setFilters = () => {},
	onRefresh = () => {},
}) => {
	const navigate = useNavigate();
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			{/* Header / Stats Section */}
			<div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Announcements
								</h1>
								<p className="text-blue-100 dark:text-blue-200 text-sm mt-0.5">
									Stay informed with institution, department, and course updates.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<StatSummaryCard
								label="Today"
								value={stats.todayCount?.toString() || "0"}
								icon={Calendar}
							/>
							<StatSummaryCard
								label="Priority"
								value={stats.priorityCount?.toString() || "0"}
								icon={AlertCircle}
							/>
						</div>
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-6 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Failed to load announcements
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-blue-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Announcements
						</p>
						<p className="text-sm">
							Please wait while we fetch your announcements...
						</p>
					</div>
				) : (
					<>
						{/* Search Bar */}
						<div className="mb-6">
							<div className="flex gap-3">
								<div className="relative flex-grow group">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
									<input
										type="text"
										placeholder="Search announcements..."
										className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-blue-500 transition-all"
										value={filters.search || ""}
										onChange={(e) =>
											setFilters({
												...filters,
												search: e.target.value,
											})
										}
									/>
								</div>
								{/* Mobile Filter Toggle */}
								<button
									onClick={() => setIsFilterOpen(true)}
									className="lg:hidden px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-blue-500/50 active:scale-95"
								>
									<SlidersHorizontal className="size-5 text-blue-600" />
								</button>
							</div>
						</div>

						<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
							{/* Main Feed */}
							<div className="flex-grow">
								{/* Feed Header */}
								<div className="flex items-center justify-between mb-6">
									<div>
										<h3 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
											Latest Announcements
										</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
											{announcements.length} announcement
											{announcements.length !== 1 ? "s" : ""}
										</p>
									</div>
									<button
										onClick={onRefresh}
										className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
									>
										<RefreshCw
											className={`size-5 ${loading ? "animate-spin" : ""}`}
										/>
									</button>
								</div>

								{/* Main Feed Content */}
								<div className="space-y-4">
									{announcements.length > 0 ? (
										<div className="grid grid-cols-1 gap-4">
											{announcements.map((announcement) => (
												<StudentAnnouncementCard
													key={announcement.id}
													announcement={announcement}
												/>
											))}
										</div>
									) : (
										<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
											<Megaphone className="size-12 text-gray-200 dark:text-gray-700 mb-4" />
											<h2 className="text-lg font-bold text-gray-900 dark:text-white">
												No Announcements Found
											</h2>
											<p className="text-gray-500 text-sm mt-1">
												Check back soon for updates
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Desktop Sidebar */}
							<div className="hidden lg:block w-80 shrink-0">
								<StudentAnnouncementFilterSidebar
									filters={filters}
									setFilters={setFilters}
									cohorts={cohorts}
									isOpen={false}
									onClose={() => setIsFilterOpen(false)}
								/>
							</div>
						</div>
					</>
				)}
			</main>

			{/* Mobile Filter Overlay */}
			<div className="lg:hidden">
				<StudentAnnouncementFilterSidebar
					filters={filters}
					setFilters={setFilters}
					cohorts={cohorts}
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
				/>
			</div>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default StudentAnnouncementsUI;