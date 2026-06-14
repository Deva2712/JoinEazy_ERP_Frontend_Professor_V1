// src/pages/Schedule/ScheduleController.jsx
import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { scheduleService } from "@/api/services/schedule.service";
import { useScheduleData } from "./hook/Usescheduledata";
import ScheduleUI from "./ScheduleUI";

const ScheduleController = () => {
	const { tab } = useParams();
	const navigate = useNavigate();

	const {
		userRole, loading, error, schedule, setSchedule,
		meetingRequests, setMeetingRequests,
		outgoingRequests, setOutgoingRequests,
		acceptedMeetings, setAcceptedMeetings,
		selectedDateFilter, setSelectedDateFilter,
		allDisplayMeetings, filteredMeetings, filteredTimetable,
		availableCourses, preFillData, fetchUserData, refreshNotifications,
	} = useScheduleData();

	const activeTab = tab || "schedule";

	const handleAcceptRequest = async (requestId, details) => {
		const request = meetingRequests.find((r) => r.id === requestId);
		const response = await scheduleService.acceptMeetingRequest(requestId, details);
		if (response.success) {
			if (request) setAcceptedMeetings((prev) => [...prev, { ...request, status: "accepted", acceptanceDetails: details }]);
			await Promise.all([fetchUserData(), refreshNotifications()]);
		}
	};

	const handleRejectRequest = async (requestId, reason) => {
		const response = await scheduleService.rejectMeetingRequest(requestId, reason);
		if (response.success) await Promise.all([fetchUserData(), refreshNotifications()]);
	};

	const handleRescheduleRequest = async (requestId, newDateTime) => {
		const response = await scheduleService.rescheduleMeetingRequest(requestId, newDateTime);
		if (response.success) await Promise.all([fetchUserData(), refreshNotifications()]);
	};

	const handleUpdateSchedule = async (newScheduleData) => {
		const updatedFullSchedule = {
			...schedule, ...newScheduleData,
			timetable: [...(schedule?.timetable || []), ...(newScheduleData.timetable || [])],
		};
		const response = await scheduleService.updateSchedule(updatedFullSchedule);
		if (response.success) setSchedule(updatedFullSchedule);
	};

	const handleDeleteOfficeHour = async (courseId) => {
		if (!schedule?.officeHours) return;
		const updatedOfficeHours = schedule.officeHours.filter((oh) => oh.id !== courseId);
		await handleUpdateSchedule({ officeHours: updatedOfficeHours });
	};

	const handleNewOutgoingRequest = (requestData) => {
		setOutgoingRequests((prev) => [...prev, { ...requestData, status: "pending" }]);
		scheduleService.createOutgoingRequest(requestData);
		refreshNotifications();
	};

	const handleAddTimetableEvent = useCallback(async (eventData) => {
		if (!schedule) return;
		const newTimetableEntry = { ...eventData, id: `evt-${Date.now()}` };
		const updatedSchedule = { ...schedule, timetable: [...(schedule.timetable || []), newTimetableEntry] };
		const response = await scheduleService.updateSchedule(updatedSchedule);
		if (response.success) setSchedule(updatedSchedule);
	}, [schedule]);

	return (
		<ScheduleUI
			userRole={userRole} loading={loading} error={error}
			activeTab={activeTab} onTabChange={(newTab) => navigate(`/schedule/${newTab}`)}
			onRefresh={fetchUserData} meetingRequests={meetingRequests} schedule={schedule}
			onAcceptRequest={handleAcceptRequest} onRejectRequest={handleRejectRequest}
			onRescheduleRequest={handleRescheduleRequest} onUpdateSchedule={handleUpdateSchedule}
			onDeleteOfficeHour={handleDeleteOfficeHour} outgoingRequests={outgoingRequests}
			onNewOutgoingRequest={handleNewOutgoingRequest} preFillMeeting={preFillData}
			allDisplayMeetings={allDisplayMeetings} filteredMeetings={filteredMeetings}
			filteredTimetable={filteredTimetable} availableCourses={availableCourses}
			selectedDateFilter={selectedDateFilter} setSelectedDateFilter={setSelectedDateFilter}
			onAddEvent={handleAddTimetableEvent}
		/>
	);
};

export default ScheduleController;