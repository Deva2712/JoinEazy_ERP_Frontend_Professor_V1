// src/pages/StudentAnnouncements/components/StudentAnnouncementCard.jsx

import React, { useState } from "react";
import {
	FileText,
	ChevronDown,
	ChevronUp,
	Calendar,
	Megaphone,
	BookOpen,
	Pin,
	Clock,
} from "lucide-react";

/**
 * StudentAnnouncementCard Component
 * Displays individual announcements with expandable content.
 * Read-only, showing only content from institution/department/course sources.
 */
const StudentAnnouncementCard = ({ announcement }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const getPriorityStyles = (priority) => {
		switch (priority?.toLowerCase()) {
			case "urgent":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-300/50 dark:border-red-700/30";
			case "high":
				return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300/50 dark:border-amber-700/30";
			default:
				return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-300/50 dark:border-blue-700/30";
		}
	};

	const getCategoryIcon = () => {
		switch (announcement.level?.toLowerCase()) {
			case "course":
				return <BookOpen className="size-3.5 text-blue-600 dark:text-blue-400" />;
			case "department":
				return <Megaphone className="size-3.5 text-indigo-600 dark:text-indigo-400" />;
			case "institution":
				return <Megaphone className="size-3.5 text-blue-600 dark:text-blue-400" />;
			default:
				return <Megaphone className="size-3.5 text-blue-600 dark:text-blue-400" />;
		}
	};

	const getCategoryLabel = () => {
		if (announcement.level === "course") {
			return `Course: ${announcement.courseName || "Course"}`;
		}
		return announcement.level?.charAt(0).toUpperCase() + announcement.level?.slice(1) || "General";
	};

	const formattedDate = new Date(
		announcement.createdAt || announcement.date,
	).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	const formattedTime = new Date(
		announcement.createdAt || announcement.date,
	).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const daysDiff = Math.floor(
		(new Date() - new Date(announcement.createdAt || announcement.date)) /
			(1000 * 60 * 60 * 24),
	);

	const timeAgo =
		daysDiff === 0
			? "Today"
			: daysDiff === 1
				? "Yesterday"
				: daysDiff < 7
					? `${daysDiff} days ago`
					: formattedDate;

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-blue-500/10 hover:border-blue-500/30 ${
				announcement.is_pinned
					? "border-blue-500/50 bg-blue-50/30 dark:bg-blue-900/10 ring-1 ring-blue-500/10"
					: "border-gray-200/60 dark:border-gray-800"
			} ${
				isExpanded
					? "ring-blue-500/10 border-blue-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
					{/* Content Area */}
					<div className="flex flex-col gap-2 flex-1">
						{/* Title & Pinned Indicator */}
						<div className="flex flex-wrap items-center gap-3 mb-1">
							{announcement.is_pinned && (
								<div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
									<Pin className="size-3 text-blue-600 dark:text-blue-400 rotate-45" />
									<span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
										Pinned
									</span>
								</div>
							)}
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
								{announcement.title}
							</h3>
						</div>

						{/* Category and Priority Badges */}
						<div className="flex flex-wrap items-center gap-3 mb-3">
							{/* Category Badge */}
							<div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
								{getCategoryIcon()}
								<span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
									{getCategoryLabel()}
								</span>
							</div>

							{/* Priority Badge */}
							<span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(announcement.priority)}`}>
								{announcement.priority || "Normal"}
							</span>
						</div>

						{/* Metadata */}
						<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
							<div className="flex items-center gap-1.5">
								<Calendar className="size-3.5" />
								{timeAgo}
							</div>
							{announcement.author && (
								<div className="flex items-center gap-1.5">
									<span>By</span>
									<span className="text-gray-600 dark:text-gray-300">
										{announcement.author}
									</span>
								</div>
							)}
						</div>

						{/* Content Preview */}
						<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
							{announcement.content}
						</p>
					</div>

					{/* Expand/Collapse Button */}
					<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] group-hover:text-blue-500 transition-colors flex-shrink-0">
						{isExpanded ? (
							<>
								<ChevronUp className="size-4" />
								<span>Collapse</span>
							</>
						) : (
							<>
								<ChevronDown className="size-4" />
								<span>Read More</span>
							</>
						)}
					</div>
				</div>

				{/* Expanded Content */}
				{isExpanded && (
					<div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
						{/* Full Content */}
						<div className="space-y-2">
							<h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								Full Announcement
							</h4>
							<div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
								<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
									{announcement.content}
								</p>
							</div>
						</div>

						{/* Detailed Metadata */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
								<span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
									Posted On
								</span>
								<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
									{formattedDate}
								</span>
							</div>
							<div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
								<span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
									Time
								</span>
								<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
									{formattedTime}
								</span>
							</div>
							{announcement.author && (
								<div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
									<span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
										Posted By
									</span>
									<span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
										{announcement.author}
									</span>
								</div>
							)}
						</div>

						{/* Attachments */}
						{announcement.attachments && announcement.attachments.length > 0 && (
							<div className="space-y-3">
								<h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Attachments ({announcement.attachments.length})
								</h4>
								<div className="flex flex-wrap gap-2">
									{announcement.attachments.map((file, idx) => (
										<a
											key={idx}
											href={file.url}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl text-sm border border-gray-200 dark:border-gray-700 transition-all group/file"
										>
											<FileText className="size-4 text-gray-400 group-hover/file:text-blue-500 dark:group-hover/file:text-blue-400" />
											<span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-xs">
												{file.name || `Attachment ${idx + 1}`}
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

export default StudentAnnouncementCard;