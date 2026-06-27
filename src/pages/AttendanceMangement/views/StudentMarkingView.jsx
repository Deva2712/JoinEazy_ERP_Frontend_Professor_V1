// src/pages/AttendanceMangement/views/StudentMarkingView.jsx

import React, { useMemo } from "react";
import {
	Search,
	Lock,
	Settings,
	QrCodeIcon,
	RefreshCw,
	Bookmark,
	ArrowLeft,
	User,
	Check,
	X,
	Archive,
	CalendarDays,
} from "lucide-react";

const StudentMarkingView = ({
	selectedCourse,
	hasSubmitted,
	presentIds,
	absentIds,
	students,
	searchQuery,
	setSearchQuery,
	setIsSettingsOpen,
	openQRView,
	onMarkAll,
	filteredStudents,
	onMarkPresent,
	onMarkAbsent,
	markingLoading,
	submitLoading,
	onSaveDraft,
	onSaveClick,
	allMarked,
	onBack,
	departmentQuery,
	setDepartmentQuery,
	departments,
	departmentMapping,
	selectedDate,
	setSelectedDate,
	allowedDates,
}) => {
	const todayStr = new Date().toISOString().split("T")[0];

	const { showFilters, filterOptions } = useMemo(() => {
		const codes = selectedCourse?.course_codes || [];
		const options = departments
			.map((dept) => {
				const abbr = departmentMapping?.[dept] || "";
				const matchingCodes = codes.filter((code) =>
					code.toUpperCase().includes(abbr.toUpperCase()),
				);
				return { dept, abbr, codes: matchingCodes };
			})
			.filter((opt) => opt.codes.length > 0);

		return {
			showFilters: codes.length > 1,
			filterOptions: options,
		};
	}, [selectedCourse, departments, departmentMapping]);

	const formatDateLabel = (d) => {
		if (d === todayStr) return "Today";
		const date = new Date(d);
		return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
	};

	return (
		<div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex flex-col gap-4 px-4 md:px-0">
				{/* Header: Title and Primary Actions */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<button
							onClick={onBack}
							className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
						>
							<ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
						</button>
						<div>
							<div className="flex items-center gap-2">
								<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
									{selectedCourse?.cohort_name || "Course Attendance"}
								</h3>
								{hasSubmitted && (
									<Lock className="size-4 text-emerald-500" />
								)}
							</div>
							<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
								Mark Attendance
							</p>

							{/* Date picker — aaj ya pichhle 2 working days */}
							<div className="flex items-center gap-2 mt-2">
								<CalendarDays className="size-3.5 text-purple-500" />
								<select
									value={selectedDate}
									onChange={(e) => {
										setSelectedDate(e.target.value);
									}}
									disabled={hasSubmitted}
									className="text-xs font-bold px-2.5 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 cursor-pointer"
								>
									{(allowedDates || [todayStr]).map((d) => (
										<option key={d} value={d}>
											{formatDateLabel(d)} — {d}
										</option>
									))}
								</select>
								{selectedDate !== todayStr && (
									<span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full uppercase tracking-wide">
										Backdate
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
						{!hasSubmitted && (
							<button
								onClick={onSaveDraft}
								disabled={markingLoading || submitLoading}
								className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-all"
							>
								<Bookmark className="size-4" />
								Save
							</button>
						)}
						<button
							onClick={onSaveClick}
							disabled={!allMarked || markingLoading || submitLoading || hasSubmitted}
							className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
								allMarked && !hasSubmitted
									? "bg-purple-600 text-white hover:bg-purple-700"
									: "bg-gray-100 text-gray-400 cursor-not-allowed"
							}`}
						>
							{submitLoading ? (
								<RefreshCw className="size-4 animate-spin" />
							) : (
								<>
									<Archive className="size-4" />
									{hasSubmitted ? "Submitted" : "Submit"}
								</>
							)}
						</button>
					</div>
				</div>

				{/* Responsive Filters: Mobile Dropdown / Desktop Buttons */}
				{showFilters && (
					<div className="">
						<select
							className="md:hidden w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-purple-500/20"
							value={departmentQuery}
							onChange={(e) => setDepartmentQuery(e.target.value)}
						>
							<option value="All">All Departments</option>
							{filterOptions.map((opt) => (
								<option key={opt.dept} value={opt.dept}>
									{opt.dept} - {opt.codes.join(", ")}
								</option>
							))}
						</select>

						<div className="hidden md:flex flex-wrap gap-2">
							<button
								onClick={() => setDepartmentQuery("All")}
								className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
									departmentQuery === "All"
										? "bg-purple-600 text-white border-purple-600"
										: "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-purple-300"
								}`}
							>
								All Departments
							</button>
							{filterOptions.map((opt) => (
								<button
									key={opt.dept}
									onClick={() => setDepartmentQuery(opt.dept)}
									className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
										departmentQuery === opt.dept
											? "bg-purple-600 text-white border-purple-600"
											: "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-purple-300"
									}`}
								>
									{opt.dept} - {opt.codes.join(", ")}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mx-2 md:mx-0">
				{/* Search and Settings Toolbar */}
				<div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700">
					<div className="flex flex-col md:flex-row items-center gap-3">
						<div className="relative flex-1 w-full">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search name or roll number..."
								className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								disabled={hasSubmitted}
							/>
						</div>
						<div className="flex items-center gap-2 w-full md:w-auto">
							<button
								onClick={openQRView}
								className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-5 py-3 rounded-xl font-bold text-sm transition-all"
							>
								<QrCodeIcon className="size-4" />
								<span>Generate QR</span>
							</button>
							<button
								onClick={() => setIsSettingsOpen(true)}
								className="p-3 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors border border-gray-100 dark:border-gray-700"
							>
								<Settings className="size-5" />
							</button>
						</div>
					</div>
				</div>

				{/* Status Counters and Bulk Actions */}
				<div className="px-5 py-4 bg-gray-50/30 dark:bg-gray-900/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
					<div className="flex items-center justify-around md:justify-start md:gap-8">
						<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
							<span className="text-lg md:text-sm font-black text-emerald-600 dark:text-emerald-500">
								{presentIds.length}
							</span>
							<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
								Present
							</span>
						</div>
						<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
							<span className="text-lg md:text-sm font-black text-rose-600 dark:text-rose-500">
								{absentIds.length}
							</span>
							<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
								Absent
							</span>
						</div>
						<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
							<span className="text-lg md:text-sm font-black text-gray-500">
								{students.length - (presentIds.length + absentIds.length)}
							</span>
							<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
								Pending
							</span>
						</div>
					</div>

					{!hasSubmitted && (
						<div className="flex items-center justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-gray-700">
							<label className="flex items-center gap-2 cursor-pointer group">
								<input
									type="radio"
									name="markAll"
									className="size-4 border-gray-300 accent-green-600 focus:ring-green-500"
									checked={students.length > 0 && presentIds.length === students.length}
									onChange={() => onMarkAll("present")}
								/>
								<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-green-600 transition-colors">
									Mark All Present
								</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer group">
								<input
									type="radio"
									name="markAll"
									className="size-4 border-gray-300 accent-red-600 focus:ring-red-500"
									checked={students.length > 0 && absentIds.length === students.length}
									onChange={() => onMarkAll("absent")}
								/>
								<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-rose-600 transition-colors">
									Mark All Absent
								</span>
							</label>
						</div>
					)}
				</div>

				{/* Student List: Mobile Cards */}
				<div className="grid grid-cols-1 md:hidden divide-y divide-gray-50 dark:divide-gray-700/50">
					{filteredStudents.map((student) => {
						const isPresent = presentIds.includes(student.id);
						const isAbsent = absentIds.includes(student.id);
						return (
							<div key={student.id} className="p-4 bg-white dark:bg-gray-800 flex items-center justify-between gap-4">
								<div className="flex items-center gap-3 min-w-0">
									<div className="size-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-300">
										<User className="size-5" />
									</div>
									<div className="truncate">
										<div className="font-bold text-gray-900 dark:text-white text-sm truncate leading-snug">
											{student.name}
										</div>
										<div className="text-[10px] font-mono font-medium text-gray-400 uppercase">
											{student.rollNumber}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2 flex-shrink-0">
									<button
										onClick={() => onMarkPresent(student.id)}
										disabled={hasSubmitted || markingLoading || submitLoading}
										className={`size-11 flex items-center justify-center rounded-xl transition-all border ${
											isPresent
												? "bg-emerald-500 text-white border-emerald-500 shadow-lg"
												: "bg-white dark:bg-gray-900 text-gray-300 border-gray-100 dark:border-gray-700"
										} disabled:opacity-50 active:scale-90`}
									>
										<Check className="size-5" />
									</button>
									<button
										onClick={() => onMarkAbsent(student.id)}
										disabled={hasSubmitted || markingLoading || submitLoading}
										className={`size-11 flex items-center justify-center rounded-xl transition-all border ${
											isAbsent
												? "bg-rose-500 text-white border-rose-500 shadow-lg"
												: "bg-white dark:bg-gray-900 text-gray-300 border-gray-100 dark:border-gray-700"
										} disabled:opacity-50 active:scale-90`}
									>
										<X className="size-5" />
									</button>
								</div>
							</div>
						);
					})}
				</div>

				{/* Student List: Desktop Table */}
				<div className="hidden md:block overflow-x-auto">
					<table className="w-full text-left">
						<thead className="bg-gray-50/50 dark:bg-gray-900/50">
							<tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
								<th className="px-8 py-5">Roll Number</th>
								<th className="px-8 py-5">Student Name</th>
								<th className="px-8 py-5 text-right">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
							{filteredStudents.map((student) => {
								const isPresent = presentIds.includes(student.id);
								const isAbsent = absentIds.includes(student.id);
								return (
									<tr key={student.id} className="group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
										<td className="px-8 py-4 text-xs font-mono font-bold text-gray-400">
											{student.rollNumber}
										</td>
										<td className="px-8 py-4">
											<p className="font-bold text-gray-900 dark:text-white">{student.name}</p>
										</td>
										<td className="px-8 py-4 text-right">
											<div className="flex items-center justify-end gap-3">
												<button
													onClick={() => onMarkPresent(student.id)}
													disabled={hasSubmitted || markingLoading || submitLoading}
													className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
														isPresent
															? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
															: "bg-white dark:bg-gray-800 text-emerald-600 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-50"
													} disabled:opacity-50`}
												>
													Present
												</button>
												<button
													onClick={() => onMarkAbsent(student.id)}
													disabled={hasSubmitted || markingLoading || submitLoading}
													className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
														isAbsent
															? "bg-rose-500 text-white border-rose-500 shadow-sm"
															: "bg-white dark:bg-gray-800 text-rose-600 border-rose-100 dark:border-rose-900/50 hover:bg-rose-50"
													} disabled:opacity-50`}
												>
													Absent
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				{filteredStudents.length === 0 && (
					<div className="p-16 text-center text-gray-400 text-sm font-medium italic">
						No students found matching your search.
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentMarkingView;