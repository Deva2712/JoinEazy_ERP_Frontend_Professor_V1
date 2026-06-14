// src/pages/StudentResearch/views/MyProjectsStudentView.jsx

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import ResearchCard from "../components/ResearchCard";

const MyProjectsStudentView = ({
	myProjects = [],
	onSelectItem = () => {},
	searchQuery = "",
	onSearchChange = () => {},
	onOpenFilters = () => {},
}) => {
	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Search Bar */}
			<div className="flex gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
					<input
						type="text"
						placeholder="Search your projects..."
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
				<button
					onClick={onOpenFilters}
					className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-600 transition-all"
				>
					<SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
				</button>
			</div>

			{/* Projects Grid */}
			{myProjects.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
						<Search className="size-8 text-blue-600 dark:text-blue-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						No projects yet
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						Explore available research projects to join one.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{myProjects.map((project) => (
						<ResearchCard
							key={project.id}
							item={project}
							type="project"
							onClick={(item) =>
								onSelectItem({
									type: "project",
									data: item,
								})
							}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default MyProjectsStudentView;