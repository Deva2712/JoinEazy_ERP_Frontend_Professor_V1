// src/api/handlers/notificationsHandler.js
// Covers: /notifications, /student/notifications, /job-tray, /student/job-tray

import * as Mocks from "../mock";

export function handleNotifications(endpoint, options = {}) {
	if (endpoint.match(/^\/job-tray$/)) return _buildProfessorJobTray();
	if (endpoint.match(/^\/student\/job-tray$/)) return _buildStudentJobTray();
	if (endpoint.match(/^\/notifications$/)) return _buildProfessorNotifications();
	if (endpoint.match(/^\/student\/notifications$/)) return _buildStudentNotifications();
	return null;
}

// ─── Shared formatters ───────────────────────────────────────────────────────

function _formatDate(dateStr) {
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function _formatTime(timeStr) {
	const [hours, minutes] = timeStr.split(":");
	const date = new Date();
	date.setHours(hours, minutes);
	return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ─── Professor job tray ──────────────────────────────────────────────────────

function _buildProfessorJobTray() {
	const jobs = [];

	// 1. Assets — rejected requests
	(Mocks.MOCK_ASSET_REQUESTS?.requests || []).forEach((req) => {
		if (req.status === "Rejected" && !req.isArchived) {
			jobs.push({
				id: `asset-${req.id}`,
				title: `Asset request for ${req.assetName} requires your action.`,
				type: "ASSET_REQUEST",
				status: "Action Required",
				link: "/asset-requests",
				statusNote: req.adminComments,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 2. Finance — rejected expenses
	(Mocks.MOCK_EXPENSES?.expenses || []).forEach((item) => {
		if (item.status === "Rejected" && !item.isArchived) {
			jobs.push({
				id: `exp-${item.id}`,
				title: `Expense claim for ${item.title} requires your action.`,
				type: "FINANCE_EXPENSE",
				status: "Action Required",
				link: "/finance-management/expenses",
				statusNote: item.adminComments,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 3. Finance — rejected advances
	(Mocks.MOCK_ADVANCES?.advances || []).forEach((item) => {
		if (item.status === "Rejected" && !item.isArchived) {
			jobs.push({
				id: `adv-${item.id}`,
				title: `Advance request for ${item.title} requires your action.`,
				type: "FINANCE_ADVANCE",
				status: "Action Required",
				link: "/finance-management/advances",
				statusNote: item.adminComments,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 4. Leave — rejected applications
	(Mocks.MOCK_LEAVE_APPLICATIONS.applications || []).forEach((app) => {
		if (app.status === "Rejected" && !app.isArchived) {
			const remarks = [];
			if (app.leaveApproval.HoD.status === "Rejected")
				remarks.push(`HoD: ${app.leaveApproval.HoD.remark}`);
			if (app.leaveApproval.HR.status === "Rejected")
				remarks.push(`HR: ${app.leaveApproval.HR.remark}`);
			jobs.push({
				id: `leave-app-${app.id}`,
				title: `Leave application for ${app.leaveType} requires your action.`,
				type: "LEAVE_APPLICATION",
				status: "Action Required",
				link: "/leave-applications/my-leaves",
				statusNote: remarks.join(" | ") || "Application rejected.",
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 5. Leave — pending substitutions
	(Mocks.MOCK_LEAVE_APPLICATIONS.substitutionRequests || []).forEach((sub) => {
		if (sub.status === "Pending") {
			const dateDisplay =
				sub.fromDate === sub.toDate
					? `on ${_formatDate(sub.fromDate)}`
					: `from ${_formatDate(sub.fromDate)} to ${_formatDate(sub.toDate)}`;
			jobs.push({
				id: `sub-req-${sub.id}`,
				title: `Substitution request from ${sub.requesterName} ${dateDisplay}.`,
				type: "SUBSTITUTION_REQUEST",
				status: "Action Required",
				link: "/leave-applications/substitutions",
				statusNote: `${sub.course} | ${_formatTime(sub.timings.startTime)} - ${_formatTime(sub.timings.endTime)}`,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 6. Exam duties — rejection revoked
	(Mocks.MOCK_EXAM_DATA || []).forEach((exam) => {
		if (exam.status === "REJECTION_REVOKED") {
			const remarks = [];
			if (exam.rejectionApproval?.exam_department?.remark)
				remarks.push(`Exam Dept.: ${exam.rejectionApproval.exam_department.remark}`);
			if (exam.rejectionApproval?.hod?.remark)
				remarks.push(`HoD: ${exam.rejectionApproval.hod.remark}`);
			jobs.push({
				id: `exam-${exam.id}`,
				title: `Exam duty for ${exam.courseName} (${exam.courseCode}) is reinstated & your rejection was revoked.`,
				type: "EXAM_DUTY",
				status: "Action Required",
				link: "/exam-duties",
				statusNote: remarks.join(" | ") || "Please check your schedule.",
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 7. Library — overdue books
	(Mocks.MOCK_LIBRARY_DATA.borrowed || []).forEach((book) => {
		if (new Date() > new Date(book.dueDate)) {
			jobs.push({
				id: `lib-overdue-${book.id}`,
				title: `Return Overdue: ${book.bookTitle} by ${book.author}`,
				type: "LIBRARY_OVERDUE",
				status: "Action Required",
				link: "/library/borrowed",
				statusNote: `Book was due on ${_formatDate(book.dueDate)}`,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 8. Maintenance — action required
	(Mocks.MOCK_MAINTENANCE_DATA?.requests || []).forEach((req) => {
		if (req.requiresAction) {
			jobs.push({
				id: `maint-${req.id}`,
				title: `Maintenance request for ${req.issueType} at ${req.location} requires your action.`,
				type: "MAINTENANCE_REQUEST",
				status: "Action Required",
				link: `/maintenance/${req.category || "university"}`,
				statusNote: req.adminRemarks || "Contact the maintenance team.",
				createdAt: req.updatedAt || new Date().toISOString(),
			});
		}
	});

	// 9. Session planning — rejected documents
	const internalDocTypes = [
		{ key: "courseOutline", label: "Course Outline" },
		{ key: "timeline", label: "Timeline" },
		{ key: "assessmentPlan", label: "Assessment Plan" },
		{ key: "previousYearAnalysis", label: "Previous Year Analysis" },
	];
	Object.entries(Mocks.MOCK_COURSE_DOCUMENTS || {}).forEach(([courseId, docs]) => {
		const courseInfo = (Mocks.MOCK_COURSE_SCHEDULE || []).find((c) => c.id === courseId);
		const courseDisplayName = courseInfo ? courseInfo.courseName : courseId;
		internalDocTypes.forEach((dt) => {
			if (docs[dt.key]?.status === "Rejected") {
				jobs.push({
					id: `doc-rej-${courseId}-${dt.key}`,
					title: `${dt.label} document for ${courseDisplayName} requires your action.`,
					type: "SESSION_PLANNING",
					status: "Action Required",
					link: "/session-planning/documents",
					statusNote: docs[dt.key].hodComments || "Document rejected. Please review and re-upload.",
					createdAt: new Date().toISOString(),
				});
			}
		});
	});

	jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	return { success: true, data: jobs };
}

// ─── Student job tray ────────────────────────────────────────────────────────

function _buildStudentJobTray() {
	const jobs = [];
	const now = new Date();

	// 1. Library — overdue
	(Mocks.MOCK_LIBRARY_DATA.borrowed || []).forEach((book) => {
		if (now > new Date(book.dueDate)) {
			jobs.push({
				id: `student-lib-overdue-${book.id}`,
				title: `Return Overdue: ${book.bookTitle} by ${book.author}`,
				type: "LIBRARY_OVERDUE",
				status: "Action Required",
				link: "/library/borrowed",
				statusNote: `Book was due on ${_formatDate(book.dueDate)}`,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 2. Registrar — rejected document requests
	(Mocks.MOCK_REGISTRAR_DATA?.documentRequests || []).forEach((req) => {
		if (req.status === "Rejected") {
			jobs.push({
				id: `student-doc-${req.id}`,
				title: `Document request for "${req.type}" requires your action.`,
				type: "DOCUMENT_SUBMISSION",
				status: "Action Required",
				link: "/registrar",
				statusNote: req.remarks || "Request was rejected. Please reapply.",
				createdAt: req.requestedAt || new Date().toISOString(),
			});
		}
	});

	// 3. Finance — overdue / pending fees
	(Mocks.MOCK_FINANCE_DATA?.fees || []).forEach((fee) => {
		if (fee.status === "Overdue") {
			jobs.push({
				id: `student-fee-overdue-${fee.id}`,
				title: `${fee.label} is overdue. Please pay immediately.`,
				type: "FEE_SUBMISSION",
				status: "Action Required",
				link: "/finance",
				statusNote: `Amount due: ₹${fee.due.toLocaleString()} | Due date: ${fee.dueDate}`,
				createdAt: new Date().toISOString(),
			});
		} else if (fee.status === "Pending" || fee.status === "Partial") {
			jobs.push({
				id: `student-fee-pending-${fee.id}`,
				title: `${fee.label} payment is pending.`,
				type: "FEE_SUBMISSION",
				status: "Action Required",
				link: "/finance",
				statusNote: `Amount due: ₹${fee.due.toLocaleString()} | Due date: ${fee.dueDate}`,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 4. Assignments — pending / overdue
	Object.entries(Mocks.MOCK_COURSE_ASSIGNMENTS).forEach(([cohortId, assignments]) => {
		assignments.forEach((assignment) => {
			const isPending = assignment.status === "pending" && !assignment.submittedAt;
			const isOverdue = isPending && new Date(assignment.dueDate) < now;
			if (isPending) {
				const course = Mocks.SHARED_COHORTS.find((c) => c.id === parseInt(cohortId));
				const courseName = course?.cohort_name ?? `Course ${cohortId}`;
				jobs.push({
					id: `student-assign-${assignment.id}`,
					title: `${isOverdue ? "Overdue" : "Pending"}: ${assignment.title}`,
					type: "ASSIGNMENT_SUBMISSION",
					status: "Action Required",
					link: `/c/${cohortId}/assignments`,
					statusNote: `${courseName} | Due: ${_formatDate(assignment.dueDate)}`,
					createdAt: assignment.createdAt || new Date().toISOString(),
				});
			}
		});
	});

	// 5. Placements — upcoming interviews
	(Mocks._placementApplications || []).forEach((app) => {
		if (app.status === "Shortlisted" && app.interviewDate) {
			const interviewDateObj = new Date(app.interviewDate);
			if (interviewDateObj >= now) {
				jobs.push({
					id: `student-interview-${app.id}`,
					title: `Upcoming interview: ${app.role} at ${app.company}`,
					type: "UPCOMING_INTERVIEW",
					status: "Action Required",
					link: "/placement/applications",
					statusNote: [
						`Date: ${_formatDate(app.interviewDate)}`,
						app.interviewTime ? `Time: ${app.interviewTime}` : null,
						app.interviewMode ? `Mode: ${app.interviewMode}` : null,
					].filter(Boolean).join(" | "),
					createdAt: app.appliedAt || new Date().toISOString(),
				});
			}
		}
	});

	jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	return { success: true, data: jobs };
}

// ─── Professor notifications ─────────────────────────────────────────────────

function _buildProfessorNotifications() {
	const notifications = [];

	// 1. Assets — approved
	(Mocks.MOCK_ASSET_REQUESTS?.requests || []).forEach((req) => {
		if (req.status === "Approved") {
			notifications.push({
				id: `notif-asset-${req.id}`,
				title: "Asset Request Update",
				message: `Your request for ${req.assetName} has been ${req.status.toLowerCase()}.`,
				type: "ASSET_REQUEST",
				link: "/asset-requests",
				createdAt: req.approvalTime || new Date().toISOString(),
			});
		}
	});

	// 2. Finance
	(Mocks.MOCK_EXPENSES?.expenses || []).forEach((item) => {
		if (item.status === "Reimbursed") {
			notifications.push({
				id: `notif-exp-${item.id}`,
				title: "Expense Approved",
				message: `Expense claim for ${item.title} has been processed.`,
				type: "FINANCE_EXPENSE",
				link: "/finance-management/expenses",
				createdAt: item.approvalTime || new Date().toISOString(),
			});
		}
	});
	(Mocks.MOCK_ADVANCES?.advances || []).forEach((item) => {
		if (item.status === "Approved") {
			notifications.push({
				id: `notif-adv-${item.id}`,
				title: "Advance Approved",
				message: `Advance request for ${item.title} has been processed.`,
				type: "FINANCE_ADVANCE",
				link: "/finance-management/advances",
				createdAt: item.approvalTime || new Date().toISOString(),
			});
		}
	});

	// 3. Leave — approved
	(Mocks.MOCK_LEAVE_APPLICATIONS.applications || []).forEach((app) => {
		if (app.status === "Approved") {
			notifications.push({
				id: `notif-leave-${app.id}`,
				title: "Leave Approved",
				message: `Your ${app.leaveType} application has been approved by HoD & HR.`,
				type: "LEAVE_APPLICATION",
				link: "/leave-applications/my-leaves",
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 4. Exam duties — assigned
	(Mocks.MOCK_EXAM_DATA || []).forEach((exam) => {
		if (exam.status === "ASSIGNED") {
			notifications.push({
				id: `notif-exam-${exam.id}`,
				title: "New Exam Duty",
				message: `You have been assigned as an invigilator for ${exam.courseName}.`,
				type: "EXAM_DUTY",
				link: "/exam-duties",
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 5. Maintenance — solved
	(Mocks.MOCK_MAINTENANCE_DATA?.requests || []).forEach((req) => {
		if (req.status === "solved") {
			notifications.push({
				id: `notif-maint-${req.id}`,
				title: "Maintenance Resolved",
				message: `The ${req.issueType} issue at ${req.location} is now marked as resolved.`,
				type: "MAINTENANCE_REQUEST",
				link: `/maintenance/${req.category || "university"}`,
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 6. Library — request status changes
	(Mocks.MOCK_LIBRARY_DATA?.requests || []).forEach((req) => {
		if (req.status === "approved" || req.status === "rejected") {
			const isApproved = req.status === "approved";
			notifications.push({
				id: `notif-lib-${req.id}`,
				title: isApproved ? "Library Request Approved" : "Library Request Rejected",
				message: isApproved
					? `Your request for "${req.bookTitle}" has been approved. Due date: ${req.dueDate}.`
					: `Your request for "${req.bookTitle}" was rejected. Reason: ${req.rejectionReason || "No reason provided."}`,
				type: "LIBRARY_REQUEST",
				link: "/library/requests",
				createdAt: req.approvedDate || req.requestDate || new Date().toISOString(),
			});
		}
	});

	// 7. Meetings — status changes
	[
		...(Mocks.MOCK_MEETING_REQUESTS?.incoming || []),
		...(Mocks.MOCK_MEETING_REQUESTS?.outgoing || []),
	].forEach((req) => {
		if (req.status === "accepted" || req.status === "rejected") {
			const isAccepted = req.status === "accepted";
			notifications.push({
				id: `notif-meet-${req.id}`,
				title: isAccepted ? "Meeting Confirmed" : "Meeting Declined",
				message: isAccepted
					? `Your meeting regarding "${req.subject}" with ${req.participantName} is confirmed.`
					: `The meeting request for "${req.subject}" was declined.${req.rejectionReason ? " Reason: " + req.rejectionReason : ""}`,
				type: "MEETING_REQUEST",
				link: isAccepted ? "/schedule/schedule" : "/schedule/requests",
				createdAt: req.createdAt || req.submittedAt || new Date().toISOString(),
			});
		}
	});

	// 8. Research — application status
	(Mocks.MOCK_USER_RESEARCH_APPLICATIONS || []).forEach((app) => {
		if (["Accepted", "Rejected", "Meeting Scheduled"].includes(app.status)) {
			notifications.push({
				id: `notif-res-app-${app.id}`,
				title:
					app.status === "Meeting Scheduled"
						? "Interview Scheduled"
						: `Application ${app.status}`,
				message:
					app.status === "Meeting Scheduled"
						? `A meeting is scheduled for "${app.title}" on ${new Date(app.meetingDetails?.date).toLocaleDateString()}.`
						: `Your application for "${app.title}" was ${app.status.toLowerCase()}.`,
				type: "RESEARCH_APPLICATION",
				link: "/research-publications/my-applications",
				createdAt: app.approvalDate || app.appliedDate,
			});
		}
	});

	// 9. Research — new applicants for owned projects
	[...Mocks.MOCK_RESEARCH_PROJECTS, ...Mocks.MOCK_PUBLICATIONS]
		.filter((p) => p.isOwner)
		.forEach((project) => {
			project.applicants
				?.filter((a) => a.status === "Pending")
				.forEach((applicant) => {
					notifications.push({
						id: `notif-res-new-app-${applicant.id}`,
						title: "New Project Applicant",
						message: `${applicant.name} applied for the ${applicant.role} role in "${project.title}".`,
						type: "RESEARCH_OWNER",
						link: "/research-publications/my-applications",
						createdAt: applicant.appliedDate,
					});
				});
		});

	notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	return { success: true, data: notifications };
}

// ─── Student notifications ───────────────────────────────────────────────────

function _buildStudentNotifications() {
	const notifications = [];
	const now = new Date();

	// 1. New assignments
	Object.entries(Mocks.MOCK_COURSE_ASSIGNMENTS).forEach(([cohortId, assignments]) => {
		assignments.forEach((assignment) => {
			const course = Mocks.SHARED_COHORTS.find((c) => c.id === parseInt(cohortId));
			const courseName = course?.cohort_name ?? `Course ${cohortId}`;
			notifications.push({
				id: `sn-course-assign-${assignment.id}`,
				title: "New Assignment Posted",
				message: `"${assignment.title}" has been posted in ${courseName}. Due: ${new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
				type: "COURSE_ASSIGNMENT",
				link: `/c/${cohortId}/assignments`,
				createdAt: assignment.createdAt || new Date().toISOString(),
			});
		});
	});

	// 2. Library requests
	(Mocks.MOCK_LIBRARY_DATA?.requests || []).forEach((req) => {
		if (req.status === "approved" || req.status === "rejected") {
			const isApproved = req.status === "approved";
			notifications.push({
				id: `sn-lib-${req.id}`,
				title: isApproved ? "Library Request Approved" : "Library Request Rejected",
				message: isApproved
					? `"${req.bookTitle}" has been approved. Collect from the library. Due: ${req.dueDate}.`
					: `"${req.bookTitle}" request was rejected. Reason: ${req.rejectionReason || "No reason provided."}`,
				type: isApproved ? "LIBRARY_REQUEST" : "LIBRARY_REJECTED",
				link: "/library",
				createdAt: req.approvedDate || req.requestDate || new Date().toISOString(),
			});
		}
	});

	// 3. Library overdue
	(Mocks.MOCK_LIBRARY_DATA?.borrowed || []).forEach((book) => {
		if (now > new Date(book.dueDate)) {
			notifications.push({
				id: `sn-lib-overdue-${book.id}`,
				title: "Book Overdue",
				message: `"${book.bookTitle}" was due on ${new Date(book.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}. Please return it immediately.`,
				type: "LIBRARY_DUE",
				link: "/library",
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 4. Finance
	(Mocks.MOCK_FINANCE_DATA?.fees || []).forEach((fee) => {
		if (fee.status === "Overdue") {
			notifications.push({
				id: `sn-finance-overdue-${fee.id}`,
				title: "Fee Payment Overdue",
				message: `${fee.label} (₹${fee.due.toLocaleString()}) is overdue since ${fee.dueDate}. Please pay immediately.`,
				type: "FINANCE_OVERDUE",
				link: "/finance",
				createdAt: new Date().toISOString(),
			});
		} else if (fee.status === "Pending" || fee.status === "Partial") {
			notifications.push({
				id: `sn-finance-due-${fee.id}`,
				title: "Fee Payment Due",
				message: `${fee.label} (₹${fee.due.toLocaleString()}) is due on ${fee.dueDate}.`,
				type: "FINANCE_DUE",
				link: "/finance",
				createdAt: new Date().toISOString(),
			});
		}
	});

	// 5. Registrar
	(Mocks.MOCK_REGISTRAR_DATA?.documentRequests || []).forEach((req) => {
		if (req.status === "Ready") {
			notifications.push({
				id: `sn-reg-ready-${req.id}`,
				title: "Document Ready for Collection",
				message: `Your ${req.type} is ready. ${req.remarks || "Collect from the Registrar's Office."}`,
				type: "REGISTRAR_DOCUMENT",
				link: "/registrar",
				createdAt: req.requestedAt || new Date().toISOString(),
			});
		} else if (req.status === "Rejected") {
			notifications.push({
				id: `sn-reg-rejected-${req.id}`,
				title: "Document Request Rejected",
				message: `Your ${req.type} request was rejected. ${req.remarks || ""}`,
				type: "REGISTRAR_REJECTED",
				link: "/registrar",
				createdAt: req.requestedAt || new Date().toISOString(),
			});
		}
	});

	// 6. Placement
	(Mocks._placementApplications || []).forEach((app) => {
		if (app.status === "Shortlisted" && app.interviewDate && new Date(app.interviewDate) >= now) {
			notifications.push({
				id: `sn-placement-interview-${app.id}`,
				title: "Interview Scheduled",
				message: `You are shortlisted for ${app.role} at ${app.company}. Interview on ${new Date(app.interviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${app.interviewTime ? " at " + app.interviewTime : ""}.`,
				type: "PLACEMENT_INTERVIEW",
				link: "/placement",
				createdAt: app.appliedAt || new Date().toISOString(),
			});
		}
		if (app.status === "Selected") {
			notifications.push({
				id: `sn-placement-selected-${app.id}`,
				title: "Placement Offer Received",
				message: `Congratulations! You have been selected for ${app.role} at ${app.company}. Check the Placement Cell for next steps.`,
				type: "PLACEMENT_STATUS",
				link: "/placement",
				createdAt: app.appliedAt || new Date().toISOString(),
			});
		}
		if (app.status === "Rejected") {
			notifications.push({
				id: `sn-placement-rejected-${app.id}`,
				title: "Placement Application Update",
				message: `Your application for ${app.role} at ${app.company} was not selected this time.`,
				type: "PLACEMENT_STATUS",
				link: "/placement",
				createdAt: app.appliedAt || new Date().toISOString(),
			});
		}
	});

	// 7. Research
	(Mocks.MOCK_USER_RESEARCH_APPLICATIONS || []).forEach((app) => {
		if (["Accepted", "Rejected", "Meeting Scheduled"].includes(app.status)) {
			notifications.push({
				id: `sn-research-${app.id}`,
				title:
					app.status === "Meeting Scheduled"
						? "Research Interview Scheduled"
						: `Research Application ${app.status}`,
				message:
					app.status === "Meeting Scheduled"
						? `A meeting is scheduled for "${app.title}" on ${new Date(app.meetingDetails?.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`
						: `Your application for "${app.title}" (${app.role}) was ${app.status.toLowerCase()}.`,
				type:
					app.status === "Accepted"
						? "RESEARCH_ACCEPTED"
						: app.status === "Meeting Scheduled"
						? "RESEARCH_MEETING"
						: "RESEARCH_REJECTED",
				link: "/student-research",
				createdAt: app.approvalDate || app.appliedDate,
			});
		}
	});

	// 8. Mentor meetings
	(Mocks.MOCK_MENTOR_DATA?.meetings || []).forEach((meeting) => {
		if (meeting.status === "Upcoming") {
			notifications.push({
				id: `sn-mentor-${meeting.id}`,
				title: "Upcoming Mentor Meeting",
				message: `Mentor meeting with ${Mocks.MOCK_MENTOR_DATA.mentor.name} on ${new Date(meeting.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${new Date(meeting.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
				type: "MENTOR_MEETING",
				link: "/mentor",
				createdAt: meeting.date,
			});
		}
	});

	// 9. Announcements
	(Mocks.MOCK_BULLETINS || []).forEach((bulletin) => {
		notifications.push({
			id: `sn-announcement-${bulletin.id}`,
			title:
				bulletin.priority === "Urgent"
					? `Urgent: ${bulletin.title}`
					: `New Announcement: ${bulletin.title}`,
			message:
				bulletin.content.length > 120
					? bulletin.content.slice(0, 120) + "…"
					: bulletin.content,
			type:
				bulletin.priority === "Urgent"
					? "ANNOUNCEMENT_URGENT"
					: bulletin.level === "department"
					? "ANNOUNCEMENT_DEPARTMENT"
					: "ANNOUNCEMENT_GENERAL",
			link: "/announcements",
			createdAt: bulletin.createdAt,
		});
	});

	notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	return { success: true, data: notifications };
}