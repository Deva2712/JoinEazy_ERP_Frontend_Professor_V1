// src/pages/Bulletins/components/BulletinsFeed.jsx

import React from "react";
import { Megaphone, Plus, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulletinCard from "./BulletinCard";
import BulletinFilterSidebar from "./BulletinFilterSidebar";

const BulletinsFeed = ({
	bulletins,
	cohorts,
	filters,
	setFilters,
	loading,
	showCourseList,
	onRefresh,
	onOpenModal,
	onOpenFilter,
}) => {
	const navigate = useNavigate();

	return (
		<>
			{/* Search Bar */}
			<div className="mb-6">
				<div className="flex gap-3">
					<div className="relative flex-grow group">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
						<input
							type="text"
							placeholder="Search announcements..."
							className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-cyan-500 transition-all"
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
						/>
					</div>
					<button
						onClick={onOpenFilter}
						className="lg:hidden px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-cyan-500/50 active:scale-95"
					>
						<SlidersHorizontal className="size-5 text-cyan-600" />
					</button>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
				<div className="flex-grow space-y-6">
					{/* Feed Header */}
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">Announcements</h3>
						<div className="flex gap-2">
							<button onClick={onRefresh} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
								<RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
							</button>
							<button onClick={onOpenModal} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95">
								<Plus className="size-4" /> New Post
							</button>
						</div>
					</div>

					{/* Cohort List */}
					{showCourseList && (
						<div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
							{cohorts.map((cohort) => (
								<button key={cohort.id} onClick={() => navigate(`/c/${cohort.id}/announcements`)}
									className="flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 rounded-lg hover:bg-cyan-100 transition-all whitespace-nowrap text-xs font-bold shadow-sm"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
									{cohort.name}
								</button>
							))}
						</div>
					)}

					{/* Cards */}
					<div className="space-y-4">
						{bulletins.length > 0 ? (
							<div className="grid grid-cols-1 gap-4">
								{bulletins.map((bullet) => <BulletinCard key={bullet.id} bullet={bullet} />)}
							</div>
						) : (
							<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
								<Megaphone className="size-12 text-gray-200 dark:text-gray-700 mb-4" />
								<h2 className="text-lg font-bold text-gray-900 dark:text-white">Empty Feed</h2>
								<p className="text-gray-500 text-sm">No announcements match these filters.</p>
							</div>
						)}
					</div>
				</div>

				{/* Desktop Sidebar */}
				<div className="hidden lg:block w-80 shrink-0">
					<BulletinFilterSidebar filters={filters} setFilters={setFilters} cohorts={cohorts} isOpen={false} onClose={() => {}} />
				</div>
			</div>
		</>
	);
};

export default BulletinsFeed;