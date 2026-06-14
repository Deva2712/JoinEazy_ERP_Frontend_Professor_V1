// src/pages/Examination/components/ExamCard.jsx

import React from "react";
import { Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";

const TYPE_COLORS = {
	"Minor 1": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
	"Minor 2": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
	"End Sem": "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900",
};

const ExamCard = ({ exam }) => {
	const examDate = new Date(exam.date);
	const typeLabel = exam.type || "Exam";

	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
			{/* Header with Subject and Type */}
			<div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
							{exam.subject}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
							{exam.code}
						</p>
					</div>
					<span
						className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${
							TYPE_COLORS[typeLabel] || "bg-gray-100 text-gray-600 border-gray-200"
						}`}
					>
						{typeLabel}
					</span>
				</div>
			</div>

			{/* Info Grid - Equally Distributed */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
				{/* Date */}
				<div className="flex items-start gap-3">
					<div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
						<Calendar className="size-4 text-rose-600 dark:text-rose-400" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
							Date
						</p>
						<p className="text-sm font-bold text-gray-900 dark:text-white">
							{examDate.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{examDate.toLocaleDateString("en-US", { weekday: "long" })}
						</p>
					</div>
				</div>

				{/* Time */}
				<div className="flex items-start gap-3">
					<div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<Clock className="size-4 text-blue-600 dark:text-blue-400" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
							Time
						</p>
						<p className="text-sm font-bold text-gray-900 dark:text-white">
							{exam.time}
						</p>
					</div>
				</div>

				{/* Venue */}
				<div className="flex items-start gap-3">
					<div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
						<MapPin className="size-4 text-purple-600 dark:text-purple-400" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
							Venue
						</p>
						<p className="text-sm font-bold text-gray-900 dark:text-white truncate">
							{exam.hall}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Room {exam.room}
						</p>
					</div>
				</div>

				{/* Seat */}
				<div className="flex items-start gap-3">
					<div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
						<User className="size-4 text-green-600 dark:text-green-400" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
							Seat Number
						</p>
						<p className="text-sm font-bold text-gray-900 dark:text-white">
							{exam.seatNumber}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExamCard;