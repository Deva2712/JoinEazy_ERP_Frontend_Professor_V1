import React, { useState } from "react";
import { BookOpen, Calendar, Clock, GraduationCap, Award, MapPin } from "lucide-react";

const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SessionCard = ({ session }) => {
	const [expanded, setExpanded] = useState(false);

	// Calculate days per week
	const daysPerWeek = session.schedule ? session.schedule.length : 0;

	// Sort schedule by day order
	const sortedSchedule = session.schedule
		? [...session.schedule].sort((a, b) => 
			DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
		)
		: [];

	const isActive = session.status === "Ongoing";

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 transition-all hover:shadow-lg ${
				isActive
					? "border-indigo-200 dark:border-indigo-800"
					: "border-gray-200 dark:border-gray-700 opacity-75"
			}`}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-3 mb-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
							{session.courseCode}
						</span>
						<span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
							isActive
								? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
								: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
						}`}>
							{session.status}
						</span>
					</div>
					<h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
						{session.courseName}
					</h3>
				</div>
			</div>

			{/* Quick Info */}
			<div className="grid grid-cols-2 gap-3 mb-4">
				<div className="flex items-center gap-2 text-xs">
					<div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
						<Award className="size-3.5 text-indigo-600 dark:text-indigo-400" />
					</div>
					<div>
						<p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Credits</p>
						<p className="font-bold text-gray-900 dark:text-white">{session.credits}</p>
					</div>
				</div>
				<div className="flex items-center gap-2 text-xs">
					<div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
						<Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />
					</div>
					<div>
						<p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Days/Week</p>
						<p className="font-bold text-gray-900 dark:text-white">{daysPerWeek}</p>
					</div>
				</div>
			</div>

			{/* Professor */}
			<div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
				<GraduationCap className="size-4 text-indigo-400 flex-shrink-0" />
				<div className="min-w-0 flex-1">
					<p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Instructor</p>
					<p className="text-sm font-bold text-gray-900 dark:text-white truncate">
						{session.professor}
					</p>
				</div>
			</div>

			{/* Schedule Preview */}
			{sortedSchedule.length > 0 && (
				<div className="space-y-2">
					<button
						onClick={() => setExpanded(!expanded)}
						className="w-full flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
					>
						<div className="flex items-center gap-2">
							<Clock className="size-4 text-indigo-600 dark:text-indigo-400" />
							<span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
								Class Schedule
							</span>
						</div>
						<span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
							{expanded ? "Hide" : "Show"}
						</span>
					</button>

					{expanded && (
						<div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
							{sortedSchedule.map((slot, idx) => (
								<div
									key={idx}
									className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
								>
									<div className="flex items-center gap-3">
										<div className="flex flex-col items-center justify-center w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
											<span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">
												{slot.day.substring(0, 3)}
											</span>
										</div>
										<div>
											<p className="text-xs font-bold text-gray-900 dark:text-white">
												{slot.startTime} - {slot.endTime}
											</p>
											<div className="flex items-center gap-1 mt-0.5">
												<MapPin className="size-3 text-amber-500" />
												<p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
													{slot.roomNumber}, {slot.buildingName}
												</p>
											</div>
										</div>
									</div>
									<span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
										{slot.courseType}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* Date Range */}
			{session.startDate && session.endDate && (
				<div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
					<div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
						<span>Start: {new Date(session.startDate).toLocaleDateString()}</span>
						<span>End: {new Date(session.endDate).toLocaleDateString()}</span>
					</div>
				</div>
			)}
		</div>
	);
};

const SessionsView = ({ sessions = [], todayName }) => {
	const [filterStatus, setFilterStatus] = useState("all");

	const filteredSessions = sessions.filter((session) => {
		if (filterStatus === "all") return true;
		if (filterStatus === "active") return session.status === "Ongoing";
		if (filterStatus === "completed") return session.status === "Completed";
		return true;
	});

	const activeSessions = sessions.filter((s) => s.status === "Ongoing").length;
	const completedSessions = sessions.filter((s) => s.status === "Completed").length;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">Course Sessions</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
						{activeSessions} active · {completedSessions} completed · {sessions.length} total sessions
					</p>
				</div>

				{/* Filter Buttons */}
				<div className="flex items-center gap-2">
					{[
						{ key: "all", label: "All Sessions" },
						{ key: "active", label: "Active" },
						{ key: "completed", label: "Completed" },
					].map((filter) => (
						<button
							key={filter.key}
							onClick={() => setFilterStatus(filter.key)}
							className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
								filterStatus === filter.key
									? "bg-indigo-600 text-white shadow-sm"
									: "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
							}`}
						>
							{filter.label}
						</button>
					))}
				</div>
			</div>

			{/* Sessions Grid */}
			{filteredSessions.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
					<BookOpen className="size-10 text-gray-200 dark:text-gray-700 mb-3" />
					<p className="text-sm font-bold text-gray-400">
						{filterStatus === "all" 
							? "No sessions assigned yet"
							: `No ${filterStatus} sessions found`
						}
					</p>
					<p className="text-xs text-gray-400 mt-1">
						Sessions will appear here once assigned by your instructor
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{filteredSessions.map((session) => (
						<SessionCard key={session.id} session={session} />
					))}
				</div>
			)}
		</div>
	);
};

export default SessionsView;