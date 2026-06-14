// src/pages/Examination/components/ExamScheduleTab.jsx

import React from "react";
import { BookOpen, Calendar, Clock, MapPin, User } from "lucide-react";
import ExamCard from "./ExamCard";

const ExamScheduleTab = ({ examSchedule = [] }) => {
	const sortedExams = [...examSchedule].sort((a, b) => new Date(a.date) - new Date(b.date));

	if (sortedExams.length === 0) {
		return (
			<div className="text-center py-20">
				<BookOpen className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
				<p className="text-gray-400">No exams scheduled.</p>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-300 space-y-4">
			{sortedExams.map((exam) => (
				<ExamCard key={exam.id} exam={exam} />
			))}
		</div>
	);
};

export default ExamScheduleTab;