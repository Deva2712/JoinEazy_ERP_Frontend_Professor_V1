import React, { useState } from "react";
import { MapPin, GraduationCap, BookOpen, Upload } from "lucide-react";
import ImportTimetableModal from "../components/ImportTimetableModal";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = {
	Sunday: "Sun",
	Monday: "Mon",
	Tuesday: "Tue",
	Wednesday: "Wed",
	Thursday: "Thu",
	Friday: "Fri",
	Saturday: "Sat",
};

const TYPE_STYLES = {
	Theory: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800",
	Lab: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800",
	Tutorial: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800",
};

const WeeklyTimetableView = ({ 
	timetable = [], 
	todayName,
	showImportModal,
	onOpenImportModal,
	onCloseImportModal,
	onImportTimetable,
}) => {
	const [activeDay, setActiveDay] = useState(
		DAYS.includes(todayName) ? todayName : "Monday",
	);

	function parseTime(t) {
		if (!t) return 0;
		const [time, mod] = t.split(" ");
		let [h, m] = time.split(":").map(Number);
		if (mod === "PM" && h < 12) h += 12;
		if (mod === "AM" && h === 12) h = 0;
		return h * 60 + m;
	}

	const classesByDay = (day) =>
		timetable
			.filter((c) => c.day === day)
			.sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

	const totalClasses = timetable.length;
	const uniqueCourses = [...new Set(timetable.map((c) => c.courseCode))].length;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Timetable</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
						{uniqueCourses} courses · {totalClasses} total sessions/week
					</p>
				</div>
				<div className="flex items-center gap-3 flex-wrap">
					<button
						onClick={onOpenImportModal}
						className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
					>
						<Upload className="size-4" />
						Import Schedule
					</button>
					{Object.entries(TYPE_STYLES).map(([type, style]) => (
						<div key={type} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${style}`}>
							<BookOpen className="size-3" /> {type}
						</div>
					))}
				</div>
			</div>

			{/* Day tab strip */}
			<div className="grid grid-cols-7 gap-1.5">
				{DAYS.map((day) => {
					const count = classesByDay(day).length;
					const isToday = day === todayName;
					const isActive = day === activeDay;
					return (
						<button
							key={day}
							onClick={() => setActiveDay(day)}
							className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
								isActive
									? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
									: isToday
										? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
										: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
							}`}
						>
							{DAY_SHORT[day]}
							<span className={`text-[9px] font-black ${isActive ? "text-white/70" : "text-indigo-400"}`}>
								{count > 0 ? count : "–"}
							</span>
						</button>
					);
				})}
			</div>

			{/* Classes for selected day */}
			{classesByDay(activeDay).length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
					<BookOpen className="size-10 text-gray-200 dark:text-gray-700 mb-3" />
					<p className="text-sm font-bold text-gray-400">No classes on {activeDay}</p>
					<button
						onClick={onOpenImportModal}
						className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
					>
						<Upload className="size-4" />
						Import Schedule
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{classesByDay(activeDay).map((cls) => (
						<div key={cls.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:shadow-md">
							<div className="flex items-start justify-between gap-2 mb-2">
								<div className="flex items-center gap-2">
									<span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg border ${TYPE_STYLES[cls.courseType] || TYPE_STYLES.Theory}`}>
										{cls.courseCode}
									</span>
									<span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
										{cls.courseType}
									</span>
								</div>
								<span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
									{cls.startTime} – {cls.endTime}
								</span>
							</div>
							<h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{cls.courseName}</h4>
							<div className="flex flex-wrap gap-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
								<div className="flex items-center gap-1">
									<GraduationCap className="size-3 text-indigo-400" /> {cls.professor}
								</div>
								<div className="flex items-center gap-1">
									<MapPin className="size-3 text-amber-500" /> {cls.roomNumber}, {cls.buildingName}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<p className="text-[11px] text-gray-400 text-center font-medium">
				Select a day above to view its classes
			</p>

			{showImportModal && (
				<ImportTimetableModal
					onClose={onCloseImportModal}
					onImport={onImportTimetable}
				/>
			)}
		</div>
	);
};

export default WeeklyTimetableView;