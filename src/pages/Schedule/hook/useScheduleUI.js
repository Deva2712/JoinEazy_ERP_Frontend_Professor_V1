// src/pages/Schedule/useScheduleUI.js

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useScheduleUI = ({
	onAcceptRequest,
	onRejectRequest,
	onRescheduleRequest,
	onUpdateSchedule,
	onTabChange,
	allDisplayMeetings = [],
	meetingRequests = [],
}) => {
	const [selectedRequestId, setSelectedRequestId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMeetingId, setSelectedMeetingId] = useState(null);
	const [showActionModal, setShowActionModal] = useState(false);
	const [modalInitialView, setModalInitialView] = useState("accept");
	const [showOfficeHoursModal, setShowOfficeHoursModal] = useState(false);
	const [showImportModal, setShowImportModal] = useState(false);
	const [expandedReasons, setExpandedReasons] = useState({});
	const [editingOfficeHour, setEditingOfficeHour] = useState(null);
	const [showRequestModal, setShowRequestModal] = useState(false);
	const [preFillData, setPreFillData] = useState(null);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => { window.scrollTo(0, 0); }, []);

	useEffect(() => {
		if (location.state?.openRequestModal) {
			setPreFillData(location.state.preFill);
			setShowRequestModal(true);
			window.history.replaceState({}, document.title);
		}
	}, [location]);

	const processedMeetings = useMemo(() => {
		return allDisplayMeetings
			.filter((m) =>
				!searchQuery ||
				m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.sort((a, b) =>
				new Date(b.startTime || b.dateTime) - new Date(a.startTime || a.dateTime)
			);
	}, [allDisplayMeetings, searchQuery]);

	const selectedMeeting = useMemo(
		() => processedMeetings.find((m) => (m.id || m.idx) === selectedMeetingId),
		[processedMeetings, selectedMeetingId],
	);

	const meetingsThisWeekCount = useMemo(() => {
		const today = new Date();
		const firstDay = today.getDate() - today.getDay();
		const startOfWeek = new Date(new Date().setDate(firstDay)).setHours(0, 0, 0, 0);
		const endOfWeek = new Date(new Date().setDate(firstDay + 6)).setHours(23, 59, 59, 999);
		return allDisplayMeetings.filter((m) => {
			const d = new Date(m.startTime || m.dateTime);
			return d >= startOfWeek && d <= endOfWeek;
		}).length;
	}, [allDisplayMeetings]);

	const selectedRequest =
		meetingRequests.find((r) => r.id === selectedRequestId) ||
		allDisplayMeetings.find((m) => (m.id || m.idx) === selectedRequestId);

	const handleOfficeHoursSave = (data) => {
		onUpdateSchedule(data);
		setEditingOfficeHour(null);
		setShowOfficeHoursModal(false);
	};

	const handleOpenModal = (request, view) => {
		setSelectedRequestId(request.id);
		setModalInitialView(view);
		setShowActionModal(true);
	};

	const handleModalConfirm = (type, requestId, data) => {
		if (type === "accept") onAcceptRequest(requestId, data);
		if (type === "reschedule") onRescheduleRequest(requestId, data);
		if (type === "reject") onRejectRequest(requestId, data);
		setShowActionModal(false);
	};

	const handleTabChange = (tabKey) => {
		onTabChange(tabKey);
		setSelectedMeetingId(null);
	};

	return {
		searchQuery, setSearchQuery,
		selectedMeetingId, setSelectedMeetingId,
		showActionModal, setShowActionModal,
		modalInitialView,
		showOfficeHoursModal, setShowOfficeHoursModal,
		showImportModal, setShowImportModal,
		expandedReasons, setExpandedReasons,
		editingOfficeHour, setEditingOfficeHour,
		showRequestModal, setShowRequestModal,
		preFillData, setPreFillData,
		processedMeetings, selectedMeeting, meetingsThisWeekCount, selectedRequest,
		handleOfficeHoursSave, handleOpenModal, handleModalConfirm, handleTabChange,
		navigate,
	};
};

export default useScheduleUI;