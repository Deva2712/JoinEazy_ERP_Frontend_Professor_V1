// src/pages/StudentResearch/components/ApplicationStudentCard.jsx

import React from "react";
import {
	CheckCircle2,
	Calendar,
	Clock,
	XCircle,
	Briefcase,
	ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplicationStudentCard = ({ application = {} }) => {
	const navigate = useNavigate();

	const handleViewDetails = () => {
		if (application.projectId) {
			navigate(`/student-research/explore/project/${application.projectId}`);
		}
	};

	const getStatusStyles = (status) => {
		switch (status) {
			case "accepted":
			case "Accepted":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "rejected":
			case "Rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
		}
	};

	const status = application.status || "pending";

	return (
		<div
			onClick={handleViewDetails}
			className="group bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/60 dark:border-gray-800 p-5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
		>
			<div className="flex items-start justify-between gap-4 mb-4">
				<div className="flex-1">
					<h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
						{application.title || application.projectTitle}
					</h3>
					<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
						{application.role && `Role: ${application.role}`}
					</p>
				</div>
				<span
					className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(status)}`}
				>
					{status}
				</span>
			</div>

			{/* Application Info */}
			<div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-4">
				<div className="flex items-center gap-1.5">
					<Calendar className="size-3 text-blue-500" />
					{new Date(application.appliedAt || application.appliedDate).toLocaleDateString(
						"en-US",
						{ month: "short", day: "numeric", year: "numeric" },
					)}
				</div>
				{application.professorName && (
					<div className="flex items-center gap-1.5">
						<Briefcase className="size-3 text-blue-500" />
						{application.professorName}
					</div>
				)}
			</div>

			{/* Status Details */}
			{(status === "accepted" || status === "Accepted") && (
				<div className="p-3 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-700/50 mb-4">
					<h4 className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest flex items-center gap-2 mb-1.5">
						<CheckCircle2 className="size-4" />
						Congratulations!
					</h4>
					<p className="text-sm text-emerald-800 dark:text-emerald-200 italic">
						Your application was accepted. Prepare to join the team!
					</p>
				</div>
			)}

			{(status === "rejected" || status === "Rejected") && (
				<div className="p-3 rounded-xl bg-red-50/30 dark:bg-red-900/10 border border-red-100 dark:border-red-700/50 mb-4">
					<h4 className="text-xs font-black text-red-700 dark:text-red-300 uppercase tracking-widest flex items-center gap-2 mb-1.5">
						<XCircle className="size-4" />
						Application Rejected
					</h4>
					{application.professorNotes && (
						<p className="text-sm text-red-800 dark:text-red-200 italic">
							{application.professorNotes}
						</p>
					)}
				</div>
			)}

			{(status === "pending" || status === "Pending") && (
				<div className="p-3 rounded-xl bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-700/50 mb-4">
					<h4 className="text-xs font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest flex items-center gap-2 mb-1.5">
						<Clock className="size-4" />
						Under Review
					</h4>
					<p className="text-sm text-amber-800 dark:text-amber-200">
						Your application is being reviewed. You'll hear back soon!
					</p>
				</div>
			)}

			{/* Statement */}
			{(application.justification || application.coverNote) && (
				<div className="mb-4">
					<p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
						Your Statement:
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-blue-500/20 pl-3">
						"{application.justification || application.coverNote}"
					</p>
				</div>
			)}

			<div className="flex justify-end pt-2">
				<span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors flex items-center gap-1">
					View Details <ChevronRight className="size-3" />
				</span>
			</div>
		</div>
	);
};

export default ApplicationStudentCard;