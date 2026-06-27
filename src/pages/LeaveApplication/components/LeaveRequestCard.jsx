// src/pages/LeaveApplication/components/LeaveRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	RotateCcw,
	History,
	Clock,
	AlertCircle,
	User,
	XCircle,
	CheckCircle2,
	ExternalLink,
	UserX,
} from "lucide-react";

const LeaveRequestCard = ({ app, onEdit }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const isRejected = app.status === "Rejected";
	const isResubmissionRequired = isRejected && !app.isArchived;
	const isResubmitted = app.status === "Resubmitted";
	const previousAttempt = app.previousVersion;

	// NEW: substitution declined check
	const isSubstitutionDeclined =
		app.replacementFaculty &&
		app.substitutionStatus === "Rejected" &&
		(app.status === "Pending" || app.status === "Resubmitted");

	const areApprovalsPending =
		app.leaveApproval?.HoD?.status === "Pending" &&
		app.leaveApproval?.HR?.status === "Pending";

	const getStatusStyles = (status) => {
		if (isResubmissionRequired)
			return "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300";
		if (isResubmitted)
			return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";

		switch (status) {
			case "Approved":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "Rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
		}
	};

	const formattedDate = (dateStr) =>
		dateStr
			? new Date(dateStr).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "N/A";

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-orange-500/10 hover:border-orange-500/30 ${
				isExpanded
					? "ring-orange-500/10 border-orange-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-4 sm:p-6">
				{/* NEW: Substitution Declined Banner */}
				{isSubstitutionDeclined && (
					<div
						className="flex items-start gap-3 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
						onClick={(e) => e.stopPropagation()}
					>
						<UserX className="size-4 text-red-600 shrink-0 mt-0.5" />
						<div className="flex-1 min-w-0">
							<p className="text-sm font-bold text-red-700 dark:text-red-400">
								Substitution Declined
							</p>
							<p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
								<span className="font-semibold">{app.replacementFaculty}</span> has declined your substitution request. Please select another faculty member.
							</p>
						</div>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onEdit({ ...app, substitutionDeclined: true });
							}}
							className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 whitespace-nowrap shrink-0"
						>
							<RotateCcw className="size-3" />
							Change Faculty
						</button>
					</div>
				)}

				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
					<div className="flex flex-col gap-2 flex-1">
						<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-orange-600">
							{app.leaveType}
						</h3>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<span className="flex items-center gap-1.5">
								<Calendar className="size-3.5 text-orange-500" />{" "}
								{app.fromDate === app.toDate
									? formattedDate(app.fromDate)
									: `${formattedDate(app.fromDate)} - ${formattedDate(app.toDate)}`}
							</span>
							<span className="flex items-center gap-1.5">
								<Clock className="size-3.5 text-orange-500" />{" "}
								Applied: {formattedDate(app.appliedAt)}
							</span>
							{/* NEW: Replacement faculty name now visible even when collapsed */}
							{app.replacementFaculty && (
								<span
									className={`flex items-center gap-1.5 ${
										isSubstitutionDeclined ? "text-red-500" : ""
									}`}
								>
									{isSubstitutionDeclined ? (
										<UserX className="size-3.5 text-red-500" />
									) : (
										<User className="size-3.5 text-orange-500" />
									)}{" "}
									Covering: {app.replacementFaculty}
									{isSubstitutionDeclined && " (Declined)"}
								</span>
							)}
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(
								app.status,
							)}`}
						>
							{isResubmissionRequired
								? "Action Required"
								: app.status}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-orange-500 transition-colors">
							{isExpanded ? (
								<>
									Collapse <ChevronUp className="size-3" />
								</>
							) : (
								<>
									View Details{" "}
									<ChevronDown className="size-3" />
								</>
							)}
						</div>
					</div>
				</div>

				{isExpanded && (
					<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						{/* Reason, Replacement & Documents Section */}
						<div className="space-y-4">
							{/* Reason */}
							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Reason
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
									{app.reason}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 flex-grow gap-6">
								{/* Replacement Faculty (Conditionally Rendered) */}
								{app.replacementFaculty && (
									<div className="flex-1 space-y-2">
										<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
											Replacement Faculty
										</h4>
										<div
											className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
												isSubstitutionDeclined
													? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
													: "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700"
											}`}
										>
											<div
												className={`p-2 rounded-full flex items-center justify-center ${
													isSubstitutionDeclined
														? "bg-red-100 dark:bg-red-900/30"
														: "bg-orange-100 dark:bg-orange-900/30"
												}`}
											>
												{isSubstitutionDeclined ? (
													<UserX className="size-4 text-red-600" />
												) : (
													<User className="size-4 text-orange-600" />
												)}
											</div>
											<div>
												<span
													className={`text-sm font-bold ${
														isSubstitutionDeclined
															? "text-red-700 dark:text-red-400 line-through"
															: "text-gray-700 dark:text-gray-300"
													}`}
												>
													{app.replacementFaculty}
												</span>
												{isSubstitutionDeclined && (
													<p className="text-[10px] text-red-500 font-bold uppercase tracking-wide mt-0.5">
														Declined
													</p>
												)}
											</div>
										</div>
									</div>
								)}

								{/* Class Being Covered (Course / Room / Timings) */}
								{app.replacementFaculty && (app.courseName || app.roomNumber || app.timings?.startTime) && (
									<div className="flex-1 space-y-2">
										<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
											Class Being Covered
										</h4>
										<div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl space-y-1.5">
											{app.courseName && (
												<div className="text-sm text-gray-700 dark:text-gray-300">
													<span className="font-bold">Course:</span> {app.courseName}
												</div>
											)}
											{app.roomNumber && (
												<div className="text-sm text-gray-700 dark:text-gray-300">
													<span className="font-bold">Room:</span> {app.roomNumber}
												</div>
											)}
											{(app.timings?.startTime || app.timings?.endTime) && (
												<div className="text-sm text-gray-700 dark:text-gray-300">
													<span className="font-bold">Time:</span>{" "}
													{app.timings?.startTime || "—"}
													{app.timings?.endTime ? ` - ${app.timings.endTime}` : ""}
												</div>
											)}
										</div>
									</div>
								)}

								{/* Supporting Documents Section */}
								{(app.supporting_doc_link ||
									app.supporting_doc_file) && (
									<div className="flex-1 space-y-2">
										<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
											Supporting Documents
										</h4>
										<div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl space-y-3">
											{app.supporting_doc_link && (
												<a
													href={app.supporting_doc_link}
													target="_blank"
													rel="noopener noreferrer"
													onClick={(e) => e.stopPropagation()}
													className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold truncate max-w-full hover:underline"
												>
													<ExternalLink className="size-4 flex-shrink-0" />
													<span className="truncate">
														{app.supporting_doc_link}
													</span>
												</a>
											)}
											{app.supporting_doc_file && (
												<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
													<span className="truncate">
														{app.supporting_doc_file.name || "Attached File"}
													</span>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Approval Decisions */}
						{!areApprovalsPending && (
							<div
								className={`p-4 sm:p-6 rounded-2xl border transition-colors ${
									app.status === "Approved"
										? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-800"
										: isResubmissionRequired
											? "bg-orange-50/30 border-orange-100 dark:bg-orange-900/5 dark:border-orange-800"
											: "bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800"
								}`}
							>
								<div className="flex items-center justify-between gap-4 mb-4">
									<h4
										className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
											app.status === "Approved"
												? "text-emerald-600"
												: isResubmissionRequired
													? "text-orange-600"
													: "text-red-600"
										}`}
									>
										{app.status === "Approved" ? (
											<CheckCircle2 className="size-4 sm:size-5" />
										) : isResubmissionRequired ? (
											<AlertCircle className="size-4 sm:size-5" />
										) : (
											<XCircle className="size-4 sm:size-5" />
										)}
										{isResubmissionRequired
											? "Action Required"
											: "Approval Decision"}
									</h4>

									{isResubmissionRequired && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												onEdit(app);
											}}
											className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-sm active:scale-95"
										>
											<RotateCcw className="size-3" />
											Resubmit
										</button>
									)}
								</div>

								{/* Remarks Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{["HoD", "HR"].map((role) => {
										const data = app.leaveApproval?.[role];
										return (
											<div
												key={role}
												className="bg-white/50 dark:bg-black/10 p-4 rounded-xl border border-black/5 dark:border-white/5"
											>
												<div className="flex items-center justify-between mb-2">
													<span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
														{role} Remarks
													</span>
													<span
														className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
															data?.status === "Approved"
																? "bg-emerald-100 text-emerald-700"
																: data?.status === "Rejected"
																	? "bg-red-100 text-red-700"
																	: "bg-amber-100 text-amber-700"
														}`}
													>
														{data?.status || "Pending"}
													</span>
												</div>
												<p className="text-sm text-gray-700 dark:text-gray-300 italic">
													{data?.remark || "No remarks provided."}
												</p>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Previous Submission Details */}
						{previousAttempt && (
							<div className="relative pl-6 py-1 border-l-2 border-gray-200 dark:border-gray-800 ml-2 space-y-3">
								<div className="flex items-center gap-3 -ml-[38px] mb-2">
									<div className="size-6 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center z-10">
										<History className="size-3 text-blue-600" />
									</div>
									<h4 className="text-sm font-black text-blue-600 uppercase tracking-widest">
										Previous Submission Details
									</h4>
								</div>
								<div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
									<div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
										<div>
											<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
												Leave Type
											</span>
											<div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
												{previousAttempt.leaveType}
											</div>
										</div>
										<div>
											<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
												Applied On
											</span>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{formattedDate(previousAttempt.appliedAt)}
											</div>
										</div>
									</div>
									<div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-800">
										<div>
											<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
												Previous Reason
											</span>
											<p className="text-sm text-gray-500 dark:text-gray-400 italic">
												{previousAttempt.reason}
											</p>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200/50 dark:border-gray-800">
											{["HoD", "HR"].map((role) => (
												<div key={role}>
													<span className="text-[10px] font-black text-orange-600/80 uppercase tracking-widest">
														{role} Remarks
													</span>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														{previousAttempt.leaveApproval?.[role]?.remark ||
															"No remarks provided."}
													</p>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaveRequestCard;