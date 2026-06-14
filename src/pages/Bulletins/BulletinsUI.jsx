// src/pages/Bulletins/BulletinsUI.jsx

import React, { useState } from "react";
import { AlertCircle, AlertTriangle, ArrowLeft, Calendar, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AnnouncementModal from "./components/AnnouncementModal";
import BulletinFilterSidebar from "./components/BulletinFilterSidebar";
import BulletinsFeed from "./components/Bulletinsfeed";

const BulletinsUI = ({ bulletins = [], cohorts = [], loading, error, stats, filters, setFilters, onRefresh, onSubmit }) => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [showCourseList, setShowCourseList] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			{/* Header */}
			<div className="bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 dark:from-cyan-900 dark:via-cyan-950 dark:to-cyan-950 text-white">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Bulletins</h1>
								<p className="text-white/70 text-sm mt-0.5">Stay updated with institution, department and course announcements.</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<StatSummaryCard label="Today" value={stats.todayCount.toString()} icon={Calendar} />
							<StatSummaryCard label="Weekly Priority" value={stats.priorityThisWeek.toString()} icon={AlertCircle} />
						</div>
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-4 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-cyan-600" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Bulletins Data</p>
						<p className="text-sm">Please wait while we fetch your announcements...</p>
					</div>
				) : (
					<BulletinsFeed
						bulletins={bulletins} cohorts={cohorts} filters={filters} setFilters={setFilters}
						loading={loading} showCourseList={showCourseList} onRefresh={onRefresh}
						onOpenModal={() => setIsModalOpen(true)} onOpenFilter={() => setIsFilterOpen(true)}
					/>
				)}
			</main>

			<AnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} cohorts={cohorts} />

			<div className="lg:hidden">
				<BulletinFilterSidebar filters={filters} setFilters={setFilters} cohorts={cohorts} isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
			</div>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default BulletinsUI;