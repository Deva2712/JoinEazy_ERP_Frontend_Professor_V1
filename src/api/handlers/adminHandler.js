// src/api/handlers/adminHandler.js
// Covers: /assets/*, /maintenance/*, /leaves/*, /exams/*, /payroll/*,
//         /attendance/*, /courses/:id/attendance, /research/*, /expenses/*, /advances/*

import * as Mocks from "../mock";

export function handleAdmin(endpoint, options = {}) {
	// ── Assets ──────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/assets\/(list|requests)$/)) {
		const type = endpoint.split("/").pop();
		return {
			success: true,
			data: type === "list" ? Mocks.MOCK_ASSETS_LIST : Mocks.MOCK_ASSET_REQUESTS,
		};
	}

	// ── Maintenance ─────────────────────────────────────────────────────────
	if (endpoint.match(/^\/maintenance\/(my-requests|requests|.*\/status)$/)) {
		return _handleMaintenance(endpoint, options);
	}

	// ── Leave applications ──────────────────────────────────────────────────
	if (endpoint.match(/^\/leaves\//)) {
		return _handleLeaves(endpoint, options);
	}

	// ── Exam duties ─────────────────────────────────────────────────────────
	if (endpoint.match(/^\/exams\/(duties|duty\/status)$/)) {
		return _handleExams(endpoint, options);
	}

	// ── Payroll ─────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/payroll\/(history|breakdown)$/)) {
		const type = endpoint.split("/").pop();
		return {
			success: true,
			data:
				type === "history"
					? Mocks.MOCK_PAYROLL.history
					: Mocks.MOCK_PAYROLL.currentBreakdown,
		};
	}

	// ── Expense / advance lists ─────────────────────────────────────────────
	if (endpoint.match(/^\/expenses\/list$/)) {
		return { success: true, data: { expenses: Mocks.MOCK_EXPENSES } };
	}
	if (endpoint.match(/^\/advances\/list$/)) {
		return { success: true, data: { advances: Mocks.MOCK_ADVANCES } };
	}

	// ── Attendance: GET logs ────────────────────────────────────────────────
	if (endpoint.match(/^\/attendance\/logs\/\d+$/)) {
		const cohortId = endpoint.match(/\/attendance\/logs\/(\d+)$/)[1];
		const today = new Date().toISOString().split("T")[0];
		const rawData = Mocks.MOCK_ATTENDANCE_DATA[cohortId] || {
			students: [],
			logs: {},
			finalizedDates: [],
		};
		return {
			status: "success",
			data: { ...rawData, isFinal: rawData.finalizedDates?.includes(today) },
		};
	}

	// ── Attendance: POST save ───────────────────────────────────────────────
	if (
		endpoint.match(/^\/courses\/\d+\/attendance$/) &&
		options.method === "POST"
	) {
		try {
			if (!options.body) throw new Error("Missing request body");
			const courseId = endpoint.match(/\/courses\/(\d+)\/attendance/)[1];
			const bodyData = JSON.parse(options.body);
			const today = bodyData.date;

			if (!Mocks.MOCK_ATTENDANCE_DATA[courseId]) {
				Mocks.MOCK_ATTENDANCE_DATA[courseId] = {
					students: [],
					logs: {},
					finalizedDates: [],
				};
			}
			Mocks.MOCK_ATTENDANCE_DATA[courseId].logs[today] = bodyData.studentIds;
			if (!Mocks.MOCK_ATTENDANCE_DATA[courseId].finalizedDates.includes(today)) {
				Mocks.MOCK_ATTENDANCE_DATA[courseId].finalizedDates.push(today);
			}
			return {
				status: "success",
				data: { ...Mocks.MOCK_ATTENDANCE_DATA[courseId], isFinal: true, message: "Attendance saved" },
			};
		} catch (err) {
			return { success: false, message: "Invalid JSON or missing body: " + err.message };
		}
	}

	// ── Research ────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/research\//)) {
		return _handleResearch(endpoint, options);
	}

	return null; // not matched
}

// ─── Private helpers ────────────────────────────────────────────────────────

function _handleMaintenance(endpoint, options) {
	// GET my-requests
	if (
		endpoint.match(/^\/maintenance\/my-requests$/) &&
		(!options.method || options.method === "GET")
	) {
		return {
			success: true,
			data: {
				requests: Mocks.MOCK_MAINTENANCE_DATA.requests,
				technicians: Mocks.MOCK_MAINTENANCE_DATA.technicians || [],
				admins: Mocks.MOCK_MAINTENANCE_DATA.admins || [],
				issueTypes: Mocks.MOCK_MAINTENANCE_DATA.issueTypes || [],
			},
		};
	}

	// POST create request
	if (endpoint.match(/^\/maintenance\/requests$/) && options.method === "POST") {
		const newRequest = JSON.parse(options.body);
		const nextIdNumber = Mocks.MOCK_MAINTENANCE_DATA.requests.length + 1;
		const formattedId = `REQ${String(nextIdNumber).padStart(3, "0")}`;
		const fullRequest = {
			...newRequest,
			id: formattedId,
			status: "pending",
			createdAt: new Date().toISOString(),
			submittedBy: "Professor",
			submittedByUserId: 1,
			rejectionReason: null,
			adminRemarks: "",
			requiresAction: false,
			assignedTechnicianId: null,
		};
		Mocks.MOCK_MAINTENANCE_DATA.requests.unshift(fullRequest);
		return { success: true, data: fullRequest };
	}

	// PATCH status
	if (
		endpoint.match(/^\/maintenance\/requests\/[A-Z0-9-]+\/status$/) &&
		options.method === "PATCH"
	) {
		const requestId = endpoint.split("/")[3];
		const { status, adminRemarks } = JSON.parse(options.body);
		const req = Mocks.MOCK_MAINTENANCE_DATA.requests.find((r) => r.id === requestId);
		if (req) {
			req.status = status;
			if (adminRemarks) req.adminRemarks = adminRemarks;
			return { success: true, data: req };
		}
		return { success: false, message: "Request not found" };
	}

	return null;
}

function _handleLeaves(endpoint, options) {
	if (endpoint.match(/^\/leaves\/applications$/)) {
		return { data: Mocks.MOCK_LEAVE_APPLICATIONS };
	}

	if (endpoint.match(/^\/leaves\/apply$/)) {
		try {
			if (!options.body) throw new Error("Missing request body");
			const newLeave = JSON.parse(options.body);
			Mocks.MOCK_LEAVE_APPLICATIONS.applications.push({
				...newLeave,
				id: `LV${Date.now()}`,
				status: "Pending",
				leaveApproval: {
					HoD: { status: "Pending", remark: null },
					HR: { status: "Pending", remark: null },
				},
			});
			return { success: true };
		} catch (err) {
			return { success: false, message: "Application failed: " + err.message };
		}
	}

	if (endpoint.match(/^\/leaves\/update\/[\w-]+$/)) {
		try {
			if (!options.body) throw new Error("Missing request body");
			const leaveId = endpoint.split("/").pop();
			const updatedData = JSON.parse(options.body);
			const index = Mocks.MOCK_LEAVE_APPLICATIONS.applications.findIndex(
				(a) => a.id === leaveId,
			);
			if (index !== -1) {
				Mocks.MOCK_LEAVE_APPLICATIONS.applications[index] = {
					...Mocks.MOCK_LEAVE_APPLICATIONS.applications[index],
					...updatedData,
				};
				return { success: true, message: "Application updated successfully." };
			}
			return { success: false, message: "Application not found." };
		} catch (err) {
			return { success: false, message: "Update failed: " + err.message };
		}
	}

	if (endpoint.match(/^\/leaves\/approve\/[\w-]+$/)) {
		try {
			if (!options.body) throw new Error("Missing request body");
			const leaveId = endpoint.split("/").pop();
			const { role, action, remark } = JSON.parse(options.body);
			const app = Mocks.MOCK_LEAVE_APPLICATIONS.applications.find(
				(a) => a.id === leaveId,
			);
			if (app && app.leaveApproval[role]) {
				app.leaveApproval[role].status = action;
				app.leaveApproval[role].remark = remark || null;

				// Dono ki status check karke overall leave status update karo
				const hod = app.leaveApproval.HoD.status;
				const hr  = app.leaveApproval.HR.status;

				if (hod === "Approved" && hr === "Approved") {
					app.status = "Approved";
					app.isArchived = false;
				} else if (hod === "Rejected" || hr === "Rejected") {
					app.status = "Rejected";
					app.isArchived = false;
				}
				// Agar ek Pending hai toh overall status change nahi hoga

				return { success: true, message: `${role} status updated to ${action}.` };
			}
			return { success: false, message: "Application or role not found." };
		} catch (err) {
			return { success: false, message: "Error: " + err.message };
		}
	}

	if (endpoint.match(/^\/leaves\/substitutions\/[\w-]+$/)) {
		try {
			if (!options.body) throw new Error("Missing request body");
			const subId = endpoint.split("/").pop();
			const { action } = JSON.parse(options.body);
			const subReq = Mocks.MOCK_LEAVE_APPLICATIONS.substitutionRequests.find(
				(s) => s.id === subId,
			);
			if (subReq) {
				subReq.status = action;
				subReq.leaveApproval.HoD.status = action;
				return { success: true, message: `Substitution ${action.toLowerCase()} successfully.` };
			}
			return { success: false, message: "Substitution request not found." };
		} catch (err) {
			return { success: false, message: "Processing error: " + err.message };
		}
	}

	return null;
}

function _handleExams(endpoint, options) {
	if (endpoint.match(/^\/exams\/duties$/)) {
		return { success: true, data: Mocks.MOCK_EXAM_DATA || [] };
	}

	if (endpoint.match(/^\/exams\/duty\/status$/)) {
		const { id, status, isCheckedIn, reason, rejectionApproval } = options.body;
		const duty = Mocks.MOCK_EXAM_DATA.find((d) => d.id === id);
		if (duty) {
			duty.status = status;
			duty.isCheckedIn = isCheckedIn;
			if (reason) duty.rejectionReason = reason;
			if (rejectionApproval) duty.rejectionApproval = rejectionApproval;
			else if (status === "ASSIGNED") duty.rejectionApproval = null;
			return { success: true, message: `Duty ${id} updated` };
		}
		return { success: false, message: "Duty not found" };
	}

	return null;
}

function _handleResearch(endpoint, options) {
	// GET dashboard sync
	if (endpoint.match(/^\/research\/dashboard-sync$/)) {
		return {
			success: true,
			data: {
				availableProjects: Mocks.MOCK_RESEARCH_PROJECTS.filter((p) => !p.isOwner && !p.isMember),
				myProjects: Mocks.MOCK_RESEARCH_PROJECTS.filter((p) => p.isOwner || p.isMember),
				myApplications: Mocks.MOCK_USER_RESEARCH_APPLICATIONS,
				otherPublications: Mocks.MOCK_PUBLICATIONS.filter((p) => !p.isOwner && !p.isMember),
				myPublications: Mocks.MOCK_PUBLICATIONS.filter((p) => p.isOwner || p.isMember),
			},
		};
	}

	// POST apply
	if (endpoint.match(/^\/research\/apply\/[\w-]+$/)) {
		const id = endpoint.split("/").pop();
		const body = JSON.parse(options.body);
		const target =
			body.itemType === "Project"
				? Mocks.MOCK_RESEARCH_PROJECTS.find((i) => i.id === id)
				: Mocks.MOCK_PUBLICATIONS.find((i) => i.id === id);
		if (target) {
			if (!target.applicants) target.applicants = [];
			target.applicants.push({
				id: `app-${Math.random().toString(36).substr(2, 9)}`,
				...body,
				status: "Pending",
			});
		}
		return { success: true, message: "Application submitted successfully" };
	}

	// POST application action
	if (endpoint.match(/^\/research\/applications\/[\w-]+\/[\w\s]+$/)) {
		const parts = endpoint.split("/");
		const action = decodeURIComponent(parts.pop());
		const appId = parts.pop();
		let details = {};
		try { details = options?.body ? JSON.parse(options.body) : {}; } catch {}

		[...Mocks.MOCK_RESEARCH_PROJECTS, ...Mocks.MOCK_PUBLICATIONS].forEach((item) => {
			const applicant = item.applicants?.find((a) => a.id === appId);
			if (!applicant) return;

			if (action === "Accepted") {
				item.applicants.forEach((other) => {
					if (other.id !== appId && other.roleId === applicant.roleId && other.status === "Pending") {
						other.status = "Rejected";
						other.professorNotes = "Position has been filled by another applicant.";
					}
				});
				[...Mocks.MOCK_RESEARCH_PROJECTS, ...Mocks.MOCK_PUBLICATIONS].forEach((otherItem) => {
					if (otherItem.id !== item.id && otherItem.applicants) {
						otherItem.applicants = otherItem.applicants.filter(
							(a) => !(a.userId === applicant.userId && a.roleId === applicant.roleId && a.status === "Pending"),
						);
					}
				});
				applicant.approvalDate = details.approvalDate || new Date().toISOString();
				applicant.professorNotes = details.feedback;
				if (item.type === "publication") {
					if (!item.coAuthors) item.coAuthors = [];
					if (!item.coAuthors.includes(applicant.name)) item.coAuthors.push(applicant.name);
				} else {
					if (!item.collaborators) item.collaborators = [];
					if (!item.collaborators.includes(applicant.name)) item.collaborators.push(applicant.name);
				}
				item.currentMemberCount = (item.currentMemberCount || 0) + 1;
				if (item.openRoles) {
					item.openRoles = item.openRoles.filter((r) => r.id !== applicant.roleId);
					item.openRolesCount = item.openRoles.length;
				}
			}

			applicant.status = action;
			if (action === "Meeting Scheduled") applicant.meetingDetails = details;
			else if (action === "Rejected") applicant.professorNotes = details.feedback;
		});

		return { success: true, message: `Application ${action} updated.` };
	}

	// POST create
	if (endpoint.match(/^\/research\/create$/)) {
		const body = JSON.parse(options.body);
		const newEntry = {
			id: `res-${Math.random().toString(36).substr(2, 9)}`,
			...body,
			isOwner: true,
			isMember: true,
			status: body.status || (body.type === "Project" ? "Open" : "Published"),
			date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
			applicants: [],
		};
		if (body.type === "Project") Mocks.MOCK_RESEARCH_PROJECTS.unshift(newEntry);
		else Mocks.MOCK_PUBLICATIONS.unshift(newEntry);
		return { success: true, message: `${body.type} created successfully`, data: newEntry };
	}

	// Roles CRUD
	if (endpoint.match(/^\/research\/[\w-]+\/roles(\/create|\/update\/[\d]+|\/delete\/[\d]+)?$/)) {
		return _handleResearchRoles(endpoint, options);
	}

	// Timeline CRUD
	if (endpoint.match(/^\/research\/timeline\/[\w-]+\/?[\w-]*$/)) {
		return _handleResearchTimeline(endpoint, options);
	}

	// Users
	if (endpoint.match(/^\/research\/users$/)) {
		return { success: true, data: Mocks.MOCK_USERS };
	}
	if (endpoint.match(/^\/research\/users\/profile\/update\/[\w-]+$/)) {
		try {
			if (!options.body) throw new Error("Body required");
			const userId = endpoint.split("/").pop();
			const body = JSON.parse(options.body);
			const userIndex = Mocks.MOCK_USERS.findIndex((u) => u.id === userId);
			if (userIndex !== -1) {
				Mocks.MOCK_USERS[userIndex] = {
					...Mocks.MOCK_USERS[userIndex],
					...body,
					updatedAt: new Date().toISOString(),
				};
				return { success: true, data: Mocks.MOCK_USERS[userIndex] };
			}
			return { success: false, message: "User not found" };
		} catch (err) {
			return { success: false, message: "Update failed: " + err.message };
		}
	}
	if (endpoint.match(/^\/research\/users\/profile\/[\w-]+$/)) {
		const userId = endpoint.split("/").pop();
		const user = Mocks.MOCK_USERS.find((u) => u.id === userId);
		if (user) {
			const hydratedAssociations = user.associations.map((assoc) => {
				const source =
					assoc.type === "Project" ? Mocks.MOCK_RESEARCH_PROJECTS : Mocks.MOCK_PUBLICATIONS;
				const details = source.find((item) => item.id === assoc.id);
				return { ...assoc, details };
			});
			return { success: true, data: { ...user, associations: hydratedAssociations } };
		}
		return { success: false, message: "Profile not found" };
	}
	if (endpoint.match(/^\/research\/users\/[\w-]+$/)) {
		const userId = endpoint.split("/").pop();
		const user = Mocks.MOCK_USERS.find((u) => u.id === userId);
		return user
			? { success: true, data: user }
			: { success: false, message: "User not found" };
	}

	return null;
}

function _handleResearchRoles(endpoint, options) {
	const parts = endpoint.split("/");
	const researchId = parts[2];
	const action = parts[4];
	const roleId = parseInt(parts[parts.length - 1]);
	const target = [...Mocks.MOCK_RESEARCH_PROJECTS, ...Mocks.MOCK_PUBLICATIONS].find(
		(item) => item.id === researchId,
	);
	if (!target) return { success: false, message: "Research item not found" };
	if (!target.openRoles) target.openRoles = [];

	if (options.method === "DELETE" && action === "delete") {
		target.openRoles = target.openRoles.filter((r) => r.id !== roleId);
		return { success: true, message: "Role deleted successfully" };
	}
	if (options.method === "PUT" && action === "update") {
		const body = JSON.parse(options.body);
		const idx = target.openRoles.findIndex((r) => r.id === roleId);
		if (idx !== -1) {
			target.openRoles[idx] = { ...target.openRoles[idx], ...body };
			return { success: true, message: "Role updated successfully", data: target.openRoles[idx] };
		}
		return { success: false, message: "Role not found" };
	}
	if (options.method === "POST" && action === "create") {
		const body = JSON.parse(options.body);
		const newId =
			target.openRoles.length > 0
				? Math.max(...target.openRoles.map((r) => r.id || 0)) + 1
				: 1;
		target.openRoles.push({ id: newId, roleName: body.roleName, description: body.description });
		return { success: true, message: "Role created successfully", data: target.openRoles };
	}
	return { success: false, message: "Invalid role operation" };
}

function _handleResearchTimeline(endpoint, options) {
	const parts = endpoint.split("/");
	const researchId = parts[3];
	const eventId = parts[4];
	const target = [...Mocks.MOCK_RESEARCH_PROJECTS, ...Mocks.MOCK_PUBLICATIONS].find(
		(i) => i.id === researchId,
	);
	if (!target) return { success: false, message: "Research item not found" };
	if (!target.timeline) target.timeline = [];

	if (options.method === "DELETE" && eventId) {
		target.timeline = target.timeline.filter((e) => e.id !== eventId);
		return { success: true, message: "Timeline event deleted" };
	}
	if (options.method === "PUT" && eventId) {
		const body = JSON.parse(options.body);
		const idx = target.timeline.findIndex((e) => e.id === eventId);
		if (idx !== -1) {
			target.timeline[idx] = { ...target.timeline[idx], ...body, updatedAt: new Date().toISOString() };
			return { success: true, data: target.timeline[idx] };
		}
		return { success: false, message: "Event not found" };
	}
	if (options.method === "POST") {
		const body = JSON.parse(options.body);
		const newEvent = { id: `time-${Math.random().toString(36).substr(2, 9)}`, ...body };
		target.timeline.push(newEvent);
		return { success: true, data: newEvent };
	}
	const events = [...target.timeline].sort((a, b) => new Date(b.date) - new Date(a.date));
	return { success: true, data: events };
}