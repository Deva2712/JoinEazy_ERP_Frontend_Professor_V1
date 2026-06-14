// src/pages/SessionPlanning/components/CourseScheduleCard.jsx

import React from "react";
import { GraduationCap, MapPin, Pen, Users } from "lucide-react";

const TodayClassCard = ({ cls, onReflection }) => {
	return (
		<div className="group bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 ring-1 ring-transparent hover:ring-indigo-500/10">
			<div className="flex flex-col gap-5 h-full">
				{/* Course Identity Header */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800">
							{cls.courseCode}
						</span>
						<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
							{cls.courseType}
						</span>
					</div>

					<h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
						{cls.courseName}
					</h3>
				</div>

				{/* Timings & Room Number */}
				<div className="bg-gray-50/50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
					<div className="flex flex-col gap-1.5">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
								{/* <Clock className="size-3.5 text-indigo-500" /> */}
								<span>
									{cls.startTime} - {cls.endTime}
								</span>
							</div>
							<span className="flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-800/50">
								<MapPin className="size-3" />
								{cls.roomNumber}
							</span>
						</div>

						<div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase">
							<div className="flex items-center gap-1">
								<GraduationCap className="size-3" />
								<span>
									{cls.batchSection} (Sem {cls.semester})
								</span>
							</div>
							<span className="ml-auto text-gray-400">
								{cls.buildingName}
							</span>
						</div>
					</div>
				</div>

				{/* Action Button */}
				<button
					onClick={() => onReflection(cls)}
					className="mt-auto w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-95"
				>
					<Pen className="size-3.5" />
					Update Reflection
				</button>
			</div>
		</div>
	);
};

export default TodayClassCard;
