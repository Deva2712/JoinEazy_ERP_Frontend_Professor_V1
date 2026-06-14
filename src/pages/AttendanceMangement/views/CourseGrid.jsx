// src/pages/AttendanceManagement/views/CourseGrid.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, ChevronRight } from "lucide-react";

/**
 * Renders the dashboard grid of course cards.
 * Shown when no course is selected (viewMode === "management" and !selectedCourse).
 *
 * Props:
 *  - courses       {Array}    List of active courses from the controller.
 *  - onSelectCourse {Function} Navigates to the marking view for a course.
 */
const CourseGrid = ({ courses, onSelectCourse }) => {
	const navigate = useNavigate();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{courses.map((course) => (
				<div
					key={course.id}
					className="group bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col h-full hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
				>
					{/* Course meta */}
					<div className="flex flex-col gap-2 mb-3">
						<div className="flex items-center gap-1">
							{course.course_codes?.slice(0, 1).map((code) => (
								<span
									key={code}
									className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-100 dark:border-purple-800"
								>
									{code}
								</span>
							))}
							{course.course_codes?.length > 1 && (
								<span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
									+{course.course_codes.length - 1}
								</span>
							)}
							<span className="ml-auto px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
								{course.member_count || 0} Students
							</span>
						</div>
						<h3 className="font-bold text-xl text-gray-900 dark:text-white truncate">
							{course.cohort_name}
						</h3>
					</div>

					{/* Actions */}
					<div className="space-y-3 mt-auto">
						<button
							onClick={() =>
								navigate(`/c/${course.id}/attendance`)
							}
							className="w-full flex items-center justify-between p-4 text-xs bg-gray-50 dark:bg-[#0f1117] hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-2xl font-black uppercase tracking-widest transition-colors"
						>
							<span>View Logs</span>
							<CalendarClock className="size-4" />
						</button>
						<button
							onClick={() => onSelectCourse(course)}
							className="w-full flex items-center justify-between p-4 text-xs bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-2xl font-black uppercase tracking-widest transition-colors"
						>
							<span>Mark Attendance</span>
							<ChevronRight className="size-4" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default CourseGrid;