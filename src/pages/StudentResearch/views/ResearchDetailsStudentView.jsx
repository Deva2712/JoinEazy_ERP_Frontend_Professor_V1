// src/pages/StudentResearch/views/ResearchDetailsStudentView.jsx

import React from "react";
import {
	Star,
	Calendar,
	Users,
	Briefcase,
	ExternalLink,
	Hash,
	BookOpen,
} from "lucide-react";

const ResearchDetailsStudentView = ({
	type = "project",
	data = {},
	onApply = () => {},
	onStar = () => {},
}) => {
	if (!data.id) return null;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Header Section */}
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
				<div className="flex items-start justify-between gap-4 mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-3">
							<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg">
								{data.category || "General"}
							</span>
							<span
								className={`px-3 py-1 rounded-lg font-bold text-xs ${
									data.status?.toLowerCase() === "open"
										? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
										: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
								}`}
							>
								{data.status?.toLowerCase() === "open"
									? `${data.openRolesCount || 0} Openings`
									: "Closed"}
							</span>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							{data.title}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
							Led by <span className="font-semibold">{data.professorName}</span>
						</p>
					</div>
					<button
						onClick={() => onStar(data.id)}
						className={`p-3 rounded-xl transition-all ${
							data.isStarred
								? "bg-amber-100 dark:bg-amber-900/40"
								: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
						}`}
					>
						<Star
							className={`size-6 ${
								data.isStarred
									? "fill-amber-500 text-amber-500"
									: "text-gray-600 dark:text-gray-400"
							}`}
						/>
					</button>
				</div>

				{/* Key Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div>
						<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
							Posted Date
						</p>
						<p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
							<Calendar className="size-4 text-blue-600" />
							{new Date(data.createdAt || data.publishedDate).toLocaleDateString(
								"en-US",
								{ year: "numeric", month: "short", day: "numeric" },
							)}
						</p>
					</div>
					<div>
						<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
							Team Size
						</p>
						<p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
    <Users className="size-4 text-blue-600" />
    {data.currentMemberCount || 0} of{" "}
    {(data.currentMemberCount || 0) +
        (data.openRolesCount || data.openRoles?.length || 0)}{" "}
    filled
</p>
					</div>
					<div>
						<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
							Collaboration
						</p>
						<p className="text-sm font-semibold text-gray-900 dark:text-white">
							{data.collaborationType || "Hybrid"}
						</p>
					</div>
				</div>
			</div>

			{/* Abstract/Description */}
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
					{type === "project" ? "Project Overview" : "Publication Overview"}
				</h2>
				<p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
					{data.abstract || data.description || "No description provided."}
				</p>
			</div>

			{/* Open Roles/Requirements */}
			{data.openRoles && data.openRoles.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<Briefcase className="size-5 text-blue-600" />
						Open Positions
					</h2>
					<div className="space-y-3">
						{data.openRoles.map((role) => (
							<div
								key={role.roleName}
								className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700"
							>
								<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
									{role.roleName || role.title}
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{role.description || "No description provided."}
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Team Members */}
			{(data.collaborators?.length > 0 || data.coAuthors?.length > 0) && (
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<Users className="size-5 text-blue-600" />
						{type === "project"
							? "Team Members"
							: "Co-Authors"}
					</h2>
					<div className="flex flex-wrap gap-2">
						{(type === "project"
							? data.collaborators || []
							: data.coAuthors || []
						).map((member, idx) => (
							<span
								key={member}
								className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-semibold text-sm"
							>
								{member}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Keywords */}
			{data.keywords && data.keywords.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
						Keywords
					</h2>
					<div className="flex flex-wrap gap-2">
						{data.keywords.map((keyword, idx) => (
							<span
								key={keyword}
								className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
							>
								{keyword}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Publication Details */}
			{type === "publication" && (
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<BookOpen className="size-5 text-blue-600" />
						Publication Details
					</h2>
					<div className="space-y-3">
						{data.journalDetails && (
							<div>
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
									Journal/Conference
								</p>
								<p className="text-sm text-gray-900 dark:text-white font-semibold">
									{data.journalDetails}
								</p>
							</div>
						)}
						{data.doi && (
							<div>
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
									<Hash className="size-3" /> DOI
								</p>
								<a
									href={`https://doi.org/${data.doi}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
								>
									{data.doi}
									<ExternalLink className="size-3" />
								</a>
							</div>
						)}
						{data.link && (
							<div>
								<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
									Link
								</p>
								<a
									href={data.link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
								>
									View Publication
									<ExternalLink className="size-3" />
								</a>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Action Button */}
			{data.status?.toLowerCase() === "open" && (data.openRolesCount > 0 || data.openRoles?.length > 0) && (
				<div className="flex gap-3">
					<button
						onClick={() => onApply()}
						className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
					>
						Apply Now
					</button>
				</div>
			)}
		</div>
	);
};

export default ResearchDetailsStudentView;