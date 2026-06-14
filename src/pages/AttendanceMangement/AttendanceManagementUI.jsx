import React from "react";
import { useNavigate } from "react-router-dom";
import { History, ArrowLeft, RefreshCw, LayoutDashboard, BookOpen, AlertTriangle } from "lucide-react";

import { useAttendance } from "./context/Attendancecontext";
import { formatDate, getDeadlineString } from "./utils/attendanceUtils";
import useAttendanceUI from "./context/Useattendanceui";

import QRView from "./views/QRView";
import ProfessorLogsView from "./views/ProfessorLogsView";
import StudentMarkingView from "./views/StudentMarkingView";
import CourseGrid from "./views/CourseGrid";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import { SaveSuccessModal, QRSettingsModal, ConfirmSubmitModal } from "./components/AttendanceModals";

const TABS = [
	{ key: "management", label: "Overview", icon: LayoutDashboard },
	{ key: "prof-attendance", label: "My Attendance", icon: History },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────

const PageHeader = ({ courses, viewMode, onNavigateBack, switchToManagement, switchToLogs }) => (
	<div className="bg-gradient-to-br from-purple-700 via-purple-800 to-violet-900 dark:from-purple-900 dark:via-purple-950 dark:to-violet-950 text-white">
		<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
				<div className="flex items-center gap-4">
					<button onClick={onNavigateBack} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
						<ArrowLeft className="size-5" />
					</button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
						<p className="text-purple-100 text-sm mt-0.5">Manage your personal and course attendance logs.</p>
					</div>
				</div>
				<div className="flex items-center gap-3 pb-2 md:pb-0">
					<StatSummaryCard label="Active Courses" value={courses.length.toString()} icon={BookOpen} />
				</div>
			</div>
			<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
				{TABS.map(({ key, label, icon: Icon }) => {
					const action = key === "management" ? switchToManagement : switchToLogs;
					return (
						<button key={key} onClick={action}
							className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
								viewMode === key
									? "bg-gray-50 dark:bg-[#0f1117] text-purple-700 dark:text-purple-400"
									: "text-white/70 hover:text-white hover:bg-white/10"
							}`}
						>
							<Icon className="w-4 h-4" /> {label}
						</button>
					);
				})}
			</div>
		</div>
	</div>
);

// ─── Main Component ─────────────────────────────────────────────────────────────

const AttendanceManagementUI = () => {
	const navigate = useNavigate();
	const {
		courses, students, presentIds, absentIds, profLogs, leaveApplications,
		qr, loading, error, markingLoading, submitLoading, hasSubmitted,
		viewMode, selectedCourse, departmentMapping,
		isConfirmModalOpen, isSaveSuccessOpen,
		actions,
	} = useAttendance();

	const { onRefresh, setQrTimeout, setSaveSuccessModal, setConfirmModal, onConfirmSave, switchToLogs, switchToManagement, closeQRView } = actions;

	const ui = useAttendanceUI({ students, profLogs, presentIds, absentIds });

	if (viewMode === "qr-view") {
		return <QRView qrToken={qr.token} timeLeft={qr.timeLeft} onGenerateQR={actions.onGenerateQR} onClose={closeQRView} hasSubmitted={hasSubmitted} />;
	}

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans transition-colors duration-300">
			<HeaderController />

			<PageHeader courses={courses} viewMode={viewMode} onNavigateBack={() => navigate("/dashboard")}
				switchToManagement={switchToManagement} switchToLogs={switchToLogs} />

			<main className="px-4 py-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-purple-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Attendance Data</p>
						<p className="text-sm">Please wait while we fetch your courses and logs...</p>
					</div>
				) : viewMode === "prof-attendance" ? (
					<ProfessorLogsView logs={ui.sortedFilteredLogs} formatDate={formatDate}
						activeMonth={ui.activeMonth} onMonthChange={ui.setActiveMonth}
						profLogs={profLogs} leaveApplications={leaveApplications} />
				) : !selectedCourse ? (
					<CourseGrid courses={courses} onSelectCourse={actions.onSelectCourse} />
				) : (
					<StudentMarkingView
						selectedCourse={selectedCourse} hasSubmitted={hasSubmitted}
						presentIds={presentIds} absentIds={absentIds} students={students}
						searchQuery={ui.searchQuery} setSearchQuery={ui.setSearchQuery}
						setIsSettingsOpen={ui.setIsSettingsOpen} openQRView={actions.openQRView}
						onMarkAll={actions.onMarkAll} filteredStudents={ui.filteredStudents}
						onMarkPresent={actions.onMarkPresent} onMarkAbsent={actions.onMarkAbsent}
						markingLoading={markingLoading} submitLoading={submitLoading}
						onSaveDraft={actions.onSaveDraft} onSaveClick={actions.onSaveClick}
						allMarked={ui.allMarked} onBack={switchToManagement}
						departmentQuery={ui.departmentQuery} setDepartmentQuery={ui.setDepartmentQuery}
						departments={ui.departments} departmentMapping={departmentMapping}
					/>
				)}
			</main>

			<SaveSuccessModal isOpen={isSaveSuccessOpen} onClose={() => setSaveSuccessModal(false)} deadline={getDeadlineString()} />
			<QRSettingsModal isOpen={ui.isSettingsOpen} onClose={() => ui.setIsSettingsOpen(false)} timeout={qr.qrTimeout} setTimeout={setQrTimeout} />
			<ConfirmSubmitModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModal(false)} studentCount={students.length} onConfirm={onConfirmSave} />

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default AttendanceManagementUI;