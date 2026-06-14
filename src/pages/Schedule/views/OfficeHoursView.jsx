// src/pages/Schedule/views/OfficeHoursView.jsx

import React from "react";
import {
	Plus,
	Edit,
	Clock,
	CalendarDays,
	BookOpen,
} from "lucide-react";

const OfficeHoursView = ({
	schedule,
	handleOpenAddOfficeHours,
	handleOpenEditOfficeHour,
	onDeleteOfficeHour,
}) => {
	return (
		<div className="w-full">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
						Office Hours
					</h3>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						Your availability for student consultations.
					</p>
				</div>
				<button
					onClick={handleOpenAddOfficeHours}
					className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
				>
					<Plus className="size-4" />
					Add Timings
				</button>
			</div>

			{schedule?.officeHours?.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{schedule.officeHours.map((course, index) => (
						<div
							key={course.id || index}
							className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/40 dark:hover:shadow-none transition-all duration-300 flex flex-col"
						>
							{/* Card Header */}
							<div className="p-5 pb-0 flex justify-between items-start">
								<div className="flex items-center gap-3">
									<div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600">
										<BookOpen className="size-5" />
									</div>
									<h4
										className="text-lg font-bold text-gray-900 dark:text-white truncate"
										title={course.courseName}
									>
										{course.courseName || "General"}
									</h4>
								</div>
								{/* Edit button — always visible, no hover-only */}
								<button
									onClick={() => handleOpenEditOfficeHour(course)}
									className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
									title="Edit office hours"
								>
									<Edit className="size-3.5" />
								</button>
							</div>

							<div className="p-5 space-y-3">
								<div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
									Scheduled Slots
								</div>

								{/* Slot List */}
								{course.slots?.map((slot, sIdx) => (
									<div
										key={sIdx}
										className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl"
									>
										<div className="flex items-center gap-3">
											<div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
												<Clock className="size-3.5 text-rose-500" />
											</div>
											<div className="text-sm">
												<span className="font-bold text-gray-900 dark:text-white mr-2">
													{slot.day.substring(0, 3)}
												</span>
												<span className="text-gray-500 dark:text-gray-400 font-medium">
													{slot.startTime} —{" "}
													{slot.endTime}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				/* Empty State */
				<div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem]">
					<div className="p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none mb-6">
						<CalendarDays className="size-12 text-gray-300" />
					</div>
					<h4 className="text-gray-900 dark:text-white font-bold text-lg">
						No sessions yet
					</h4>
					<p className="text-gray-500 text-sm font-medium mt-1">
						Start by adding your first availability slot.
					</p>
					<button
						onClick={handleOpenAddOfficeHours}
						className="mt-6 px-8 py-3 bg-white dark:bg-gray-800 text-rose-600 border border-rose-100 dark:border-rose-900/50 rounded-2xl text-sm font-bold hover:bg-rose-50 transition-all shadow-sm"
					>
						Set Availability
					</button>
				</div>
			)}
		</div>
	);
};

export default OfficeHoursView;