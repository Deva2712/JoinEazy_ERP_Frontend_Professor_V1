// src/pages/StudentResearch/views/ApplicationsStudentView.jsx

import React from "react";
import { Search, X } from "lucide-react";
import ApplicationStudentCard from "../components/ApplicationStudentCard";

const ApplicationsStudentView = ({
	applications = [],
	searchQuery = "",
	onSearchChange = () => {},
}) => {
	const filteredApplications = applications.filter((app) => {
		const matchesSearch =
			!searchQuery ||
			app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.professorName?.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesSearch;
	});

	const stats = {
		total: applications.length,
		pending: applications.filter((a) => a.status === "Pending").length,
		accepted: applications.filter((a) => a.status === "Accepted").length,
		rejected: applications.filter((a) => a.status === "Rejected").length,
	};

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Search Bar */}
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
				<input
					type="text"
					placeholder="Search applications..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600 transition-all"
				/>
				{searchQuery && (
					<button
						onClick={() => onSearchChange("")}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
					<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
						Total
					</p>
					<p className="text-2xl font-bold text-gray-900 dark:text-white">
						{stats.total}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
					<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
						Pending
					</p>
					<p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
						{stats.pending}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
					<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
						Accepted
					</p>
					<p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
						{stats.accepted}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
					<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
						Rejected
					</p>
					<p className="text-2xl font-bold text-red-600 dark:text-red-400">
						{stats.rejected}
					</p>
				</div>
			</div>

			{/* Applications List */}
			{filteredApplications.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
						<Search className="size-8 text-blue-600 dark:text-blue-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						No applications yet
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						Apply to research projects to see them here.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredApplications.map((application) => (
						<ApplicationStudentCard
							key={application.id}
							application={application}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ApplicationsStudentView;