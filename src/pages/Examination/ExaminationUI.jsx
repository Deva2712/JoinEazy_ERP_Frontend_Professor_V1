// src/pages/Examination/ExaminationUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft, RefreshCw, AlertTriangle, BarChart3, BookOpen, Award,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import ExamScheduleTab from "./components/ExamScheduleTab";
import ResultsTab from "./components/ResultsTab";
import GradeHistoryTab from "./components/GradeHistoryTab";
import RevaluationModal from "./components/RevaluationModal";

const TABS = [
	{ key: "schedule", label: "Exam Schedule", icon: BookOpen },
	{ key: "results", label: "Results", icon: BarChart3 },
	{ key: "grades", label: "Grade History", icon: Award },
];

export default function ExaminationUI({
	loading = false,
	error = null,
	onRetry = () => {},
	examSchedule = [],
	results = [],
	gradeHistory = [],
	revaluationRequests = [],
	onSubmitRevaluation = () => {},
}) {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("schedule");
	const [filterSem, setFilterSem] = useState("All");
	const [gradeSem, setGradeSem] = useState("All");
	const [revalModal, setRevalModal] = useState(null);

	const cgpa = gradeHistory.length > 0 ? gradeHistory[gradeHistory.length - 1].cgpa : null;

	const getExistingReval = (subject) =>
		revaluationRequests.find((r) => r.subjectCode === (subject.code || subject.subjectCode));

	// ── Loading / Error States ──
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
				<HeaderController />
				<div className="flex justify-center py-32">
					<RefreshCw className="size-10 animate-spin text-rose-600" />
				</div>
				<BottomNavController />
				<FooterController />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
				<HeaderController />
				<div className="flex flex-col items-center justify-center py-32 text-center px-4">
					<AlertTriangle className="size-10 text-red-600 mb-4" />
					<h2 className="text-xl font-bold dark:text-white mb-2">Failed to load</h2>
					<button
						onClick={onRetry}
						className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
					>
						Try Again
					</button>
				</div>
				<BottomNavController />
				<FooterController />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			{/* Hero Banner */}
			<div className="bg-gradient-to-br from-rose-600 via-pink-600 to-red-700 dark:from-rose-900 dark:via-pink-900 dark:to-red-900 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Examinations</h1>
								<p className="text-white/70 text-sm mt-0.5">Schedule, results & grade history.</p>
							</div>
						</div>
						{cgpa && (
							<div className="pb-2 md:pb-0">
								<StatSummaryCard label="CGPA" value={cgpa.toString()} icon={BarChart3} />
							</div>
						)}
					</div>

					{/* Tabs */}
					<div className="flex items-center gap-1 overflow-x-auto">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									onClick={() => setActiveTab(tab.key)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										activeTab === tab.key
											? "bg-gray-50 dark:bg-[#0f1117] text-rose-600 dark:text-rose-400"
											: "text-white/70 hover:bg-white/10"
									}`}
								>
									<Icon className="size-4" />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{activeTab === "schedule" && <ExamScheduleTab examSchedule={examSchedule} />}

				{activeTab === "results" && (
					<ResultsTab
						results={results}
						filterSem={filterSem}
						setFilterSem={setFilterSem}
						onRequestRevaluation={setRevalModal}
						getExistingReval={getExistingReval}
					/>
				)}

				{activeTab === "grades" && (
					<GradeHistoryTab
						gradeHistory={gradeHistory}
						gradeSem={gradeSem}
						setGradeSem={setGradeSem}
					/>
				)}
			</main>

			{/* Revaluation Modal */}
			{revalModal && (
				<RevaluationModal
					subject={revalModal}
					existingRequest={getExistingReval(revalModal)}
					onClose={() => setRevalModal(null)}
					onSubmit={(data) => {
						onSubmitRevaluation(data);
						setRevalModal(null);
					}}
				/>
			)}

			<BottomNavController />
			<FooterController />
		</div>
	);
}