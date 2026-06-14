// src/pages/Schedule/ScheduleUI.jsx
import React from "react";
import { ArrowLeft, Calendar, Clock, Presentation, RefreshCw, AlertTriangle, Send } from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import TodayScheduleView from "./views/TodayScheduleView";
import OfficeHoursView from "./views/OfficeHoursView";
import MyMeetingsView from "./views/MyMeetingsView";
import RequestsView from "./views/RequestsView";
import OfficeHoursModal from "./components/OfficeHoursModal";
import ImportScheduleModal from "./components/ImportScheduleModal";
import RequestMeetingModal from "./components/RequestMeetingModal";
import MeetingActionModal from "./components/MeetingActionModal";
import useScheduleUI from "./hook/useScheduleUI";

const TABS = [
	{ key: "schedule",     label: "Schedule",     icon: Calendar },
	{ key: "office-hours", label: "Office Hours",  icon: Clock },
	{ key: "meetings",     label: "My Meetings",   icon: Presentation },
	{ key: "requests",     label: "Requests",      icon: Send },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const PageHeader = ({ userRole, allDisplayMeetings, meetingsThisWeekCount, activeTab, handleTabChange, onNavigateBack }) => (
	<div className="bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 dark:from-rose-900 dark:via-rose-950 dark:to-pink-950 text-white">
		<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
				<div className="flex items-center gap-4">
					<button onClick={onNavigateBack} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
						<ArrowLeft className="size-5" />
					</button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Schedule & Meetings</h1>
						<p className="text-rose-50 text-sm mt-0.5">Manage your timetable, office hours & meeting requests.</p>
					</div>
				</div>
				{(userRole === "professor" || userRole === "hod" ||userRole === "hr") && (
					<div className="flex items-center gap-3 pb-2 md:pb-0">
						<StatSummaryCard label="Meetings Today" icon={Presentation}
							value={allDisplayMeetings.filter((m) => new Date(m.startTime || m.dateTime).toDateString() === new Date().toDateString()).length.toString()}
						/>
						<StatSummaryCard label="Meetings This Week" value={meetingsThisWeekCount.toString()} icon={Calendar} />
					</div>
				)}
			</div>
			{(userRole === "professor" || userRole === "hod" || userRole === "hr") && (
				<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
					{TABS.map((tab) => {
						const Icon = tab.icon;
						const active = activeTab === tab.key;
						const badge = tab.key === "meetings" ? allDisplayMeetings.length : 0;
						return (
							<button key={tab.key} onClick={() => handleTabChange(tab.key)}
								className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${active ? "bg-gray-50 dark:bg-[#0f1117] text-rose-700 dark:text-rose-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}
							>
								<Icon className="w-4 h-4" />
								{tab.label}
								{badge > 0 && (
									<span className={`inline-flex items-center justify-center text-[10px] font-bold w-[18px] h-[18px] rounded-full ml-1.5 ${active ? "bg-rose-600 text-white" : "bg-white text-rose-700"}`}>
										{badge}
									</span>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	</div>
);

const AllModals = ({ s, p, onUpdateSchedule, onNewOutgoingRequest, schedule, availableCourses }) => (
	<>
		<MeetingActionModal isOpen={s.showActionModal} request={s.selectedRequest} initialView={s.modalInitialView}
			onConfirm={s.handleModalConfirm} onClose={() => s.setShowActionModal(false)} />
		<OfficeHoursModal isOpen={s.showOfficeHoursModal} editingHour={s.editingOfficeHour}
			existingHours={schedule?.officeHours || []} schedule={schedule} courses={availableCourses}
			onSave={s.handleOfficeHoursSave} onClose={() => s.setShowOfficeHoursModal(false)} />
		<ImportScheduleModal isOpen={s.showImportModal}
			onImport={(t) => onUpdateSchedule({ timetable: t })} onClose={() => s.setShowImportModal(false)} />
		<RequestMeetingModal isOpen={s.showRequestModal} onConfirm={onNewOutgoingRequest} initialData={s.preFillData}
			onClose={() => { s.setShowRequestModal(false); s.setPreFillData(null); }} />
	</>
);

// ─── Main Component ─────────────────────────────────────────────────────────────

const ScheduleUI = (props) => {
	const {
		userRole, loading, error, activeTab, onTabChange, onRefresh,
		meetingRequests = [], schedule, onAcceptRequest, onRejectRequest,
		onRescheduleRequest, onUpdateSchedule, onDeleteOfficeHour,
		outgoingRequests = [], onNewOutgoingRequest, allDisplayMeetings = [],
		filteredMeetings = [], filteredTimetable = [], availableCourses = [],
		selectedDateFilter, setSelectedDateFilter, onAddEvent,
	} = props;

	const s = useScheduleUI({ onAcceptRequest, onRejectRequest, onRescheduleRequest, onUpdateSchedule, onTabChange, allDisplayMeetings, meetingRequests });
	const openAddOfficeHours = () => { s.setEditingOfficeHour(null); s.setShowOfficeHoursModal(true); };
	const openEditOfficeHour = (hour) => { s.setEditingOfficeHour(hour); s.setShowOfficeHoursModal(true); };

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans transition-colors duration-300">
			<HeaderController />

			<PageHeader userRole={userRole} allDisplayMeetings={allDisplayMeetings}
				meetingsThisWeekCount={s.meetingsThisWeekCount} activeTab={activeTab}
				handleTabChange={s.handleTabChange} onNavigateBack={() => s.navigate("/dashboard")} />

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load schedule</h2>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-rose-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Schedule Data</p>
						<p className="text-sm">Please wait while we fetch your schedules...</p>
					</div>
				) : userRole === "professor" || userRole === "hod" || userRole === "hr" ? (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "schedule" && (
							<TodayScheduleView schedule={schedule} allDisplayMeetings={allDisplayMeetings}
								selectedDateFilter={selectedDateFilter} setSelectedDateFilter={setSelectedDateFilter}
								filteredTimetable={filteredTimetable} filteredMeetings={filteredMeetings}
								handleOpenAddOfficeHours={openAddOfficeHours} handleOpenEditOfficeHour={openEditOfficeHour}
								handleDateClick={setSelectedDateFilter} setShowImportModal={s.setShowImportModal}
								onDeleteOfficeHour={onDeleteOfficeHour} onAddEvent={onAddEvent} />
						)}
						{activeTab === "office-hours" && (
							<OfficeHoursView schedule={schedule} handleOpenAddOfficeHours={openAddOfficeHours}
								handleOpenEditOfficeHour={openEditOfficeHour} onDeleteOfficeHour={onDeleteOfficeHour} />
						)}
						{activeTab === "requests" && (
							<RequestsView meetingRequests={meetingRequests} outgoingRequests={outgoingRequests}
								expandedReasons={s.expandedReasons} setExpandedReasons={s.setExpandedReasons}
								handleAccept={(r) => s.handleOpenModal(r, "accept")} handleReject={(r) => s.handleOpenModal(r, "reject")}
								onNewRequest={onNewOutgoingRequest} setShowRequestModal={s.setShowRequestModal} />
						)}
						{activeTab === "meetings" && (
							<MyMeetingsView processedMeetings={s.processedMeetings} selectedMeetingId={s.selectedMeetingId}
								setSelectedMeetingId={s.setSelectedMeetingId} searchQuery={s.searchQuery}
								setSearchQuery={s.setSearchQuery} selectedMeeting={s.selectedMeeting}
								handleReschedule={(r) => s.handleOpenModal(r, "reschedule")} />
						)}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
						<div className="text-6xl">📅</div>
						<h2 className="text-2xl font-semibold dark:text-gray-200">Student Schedule View</h2>
						<p className="text-gray-600 dark:text-gray-400">Coming soon!</p>
					</div>
				)}
			</main>

			<AllModals s={s} onUpdateSchedule={onUpdateSchedule} onNewOutgoingRequest={onNewOutgoingRequest}
				schedule={schedule} availableCourses={availableCourses} />

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default ScheduleUI;