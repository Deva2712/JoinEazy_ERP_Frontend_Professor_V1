// src/pages/StudentResearch/components/ResearchCard.jsx

import React from "react";
import {
	Tag,
	ChevronRight,
	Briefcase,
	Microscope,
	BookOpen,
} from "lucide-react";

/**
 * Unified Card for both Research Projects and Publications for students.
 */
const ResearchCard = ({ item, onClick, type = "project" }) => {
	const memberCount = item.currentMemberCount || 0;
	const totalCapacity =
		(item.currentMemberCount || 0) + (item.openRolesCount || 0) || 1;
	const capacityPercentage = Math.min(
		(memberCount / totalCapacity) * 100,
		100,
	);

	return (
		<div
			onClick={() => onClick(item)}
			className="group bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-blue-500/10"
		>
			<div className="flex items-center justify-between mb-4">
				<span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider">
					<Tag className="size-3" />
					{item.category || "General"}
				</span>

				<span
					className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${
						item.status?.toLowerCase() === "open"
							? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
							: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
					}`}
				>
					{item.status?.toLowerCase() === "open"
						? `${item.openRolesCount || item.openRoles?.length || 0} Openings`
						: "Closed"}
				</span>
			</div>

			<div className="flex-1 space-y-3">
				<h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
					{item.title}
				</h4>
				<p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
					{item.abstract || item.description}
				</p>
			</div>

			<div className="mt-4 space-y-2">
				<div className="flex items-center gap-4">
					<div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							className="h-full bg-blue-500 transition-all duration-300 ease-out"
							style={{ width: `${capacityPercentage}%` }}
						/>
					</div>
					<div className="text-gray-400 font-bold text-xs uppercase whitespace-nowrap">
						{memberCount} / {totalCapacity} filled
					</div>
				</div>

				<div className="pt-2 flex justify-end">
					<span className="flex items-center gap-1 text-gray-900 dark:text-white text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
						View Details <ChevronRight className="size-4" />
					</span>
				</div>
			</div>
		</div>
	);
};

export default ResearchCard;