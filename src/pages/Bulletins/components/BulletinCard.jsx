// src/pages/Bulletins/components/BulletinCard.jsx

import React, { useState } from "react";
import {
	FileText,
	ChevronDown,
	ChevronUp,
	Calendar,
	Megaphone,
	BookOpen,
	Pin,
} from "lucide-react";

/**
 * BulletinCard Component
 * Displays individual announcement snippets with an interactive 'Expand' behavior.
 */
const BulletinCard = ({ bullet }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const getPriorityStyles = (priority) => {
		switch (priority?.toLowerCase()) {
			case "urgent":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			case "high":
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
			default:
				return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
		}
	};

	const formattedDate = new Date(
	  bullet.createdAt || bullet.created_at || bullet.date,
	).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-cyan-500/10 hover:border-cyan-500/30 ${
				bullet.is_pinned
					? "border-cyan-500/50 bg-cyan-50/30 dark:bg-cyan-900/10"
					: "border-gray-200/60 dark:border-gray-800"
			} ${
				isExpanded
					? "ring-cyan-500/10 border-cyan-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
					<div className="flex flex-col gap-1 flex-1">
						<div className="flex flex-wrap items-center gap-3 mb-1">
							{/* Pinned Indicator */}
							{bullet.is_pinned && (
								<Pin className="size-4 text-cyan-600 dark:text-cyan-400 rotate-45" />
							)}
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-cyan-600">
								{bullet.title}
							</h3>
							<span
								className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-gray-200/50 dark:border-gray-700 ${getPriorityStyles(bullet.priority)}`}
							>
								{bullet.priority || "Normal"}
							</span>
						</div>

						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<div className="flex items-center gap-1.5">
								{bullet.level === "course" ? (
									<BookOpen className="size-3.5 text-cyan-600 dark:text-cyan-400" />
								) : (
									<Megaphone className="size-3.5 text-cyan-600 dark:text-cyan-400" />
								)}
								{bullet.level === "course"
									? `Course: ${bullet.courseName}`
									: bullet.level}
							</div>
							<div className="flex items-center gap-1.5">
								<Calendar className="size-3.5 text-cyan-500" />
								{formattedDate}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-cyan-500 transition-colors">
						{isExpanded ? (
							<>
								Collapse <ChevronUp className="size-3" />
							</>
						) : (
							<>
								Read More <ChevronDown className="size-3" />
							</>
						)}
					</div>
				</div>

				{isExpanded && (
					<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="space-y-2">
							<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
								Announcement Details
							</h4>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
								{bullet.content}
							</p>
						</div>

						{bullet.attachments?.length > 0 && (
							<div className="space-y-3">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Attachments ({bullet.attachments.length})
								</h4>
								<div className="flex flex-wrap gap-2">
									{bullet.attachments.map((file, idx) => (
										<a
											key={idx}
											href={file.url}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="flex flex-wrap items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 hover:border-cyan-500 dark:hover:border-cyan-400 rounded-xl text-sm border border-gray-200 dark:border-gray-700 transition-all group/file"
										>
											<FileText className="size-4 text-gray-400 group-hover/file:text-cyan-500" />
											<span className="text-gray-700 dark:text-gray-200 font-medium">
												{file.name}
											</span>
										</a>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default BulletinCard;
