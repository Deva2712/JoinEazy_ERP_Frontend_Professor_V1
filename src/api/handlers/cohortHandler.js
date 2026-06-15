// src/api/handlers/cohortHandler.js
// Covers: /cohort/archived, /cohort/check-expired, /cohort/:id/archive,
//         /cohort/:id/details, /cohort/:id/members, /cohort/:id/assignments (CRUD),
//         /cohort/:id/group/:id/details, /cohort/group/:id/details (legacy),
//         /cohort/:id/resources (CRUD), /cohort/:id/student/meetings,
//         /cohort/:id/student/meeting-requests

import * as Mocks from "../mock";

export function handleCohort(endpoint, options = {}) {
	// ── GET /cohort/archived ────────────────────────────────────────────────
	if (endpoint === "/cohort/archived") {
		return { success: true, data: Mocks.MOCK_ARCHIVED_COURSES };
	}

	// ── POST /cohort/check-expired ──────────────────────────────────────────
	if (endpoint === "/cohort/check-expired" && options.method === "POST") {
		const now = new Date();
		const userRole = localStorage.getItem("userRole");
		const dashboardData =
			userRole === "professor"
				? Mocks.MOCK_PROFESSOR_DASHBOARD_DATA
				: Mocks.MOCK_STUDENT_DASHBOARD_DATA;

		// Check SHARED_COHORTS
		Mocks.SHARED_COHORTS.forEach((cohort) => {
			if (cohort.end_date && cohort.status !== "Archived") {
				if (new Date(cohort.end_date) < now) {
					cohort.status = "Archived";
					cohort.visibility = "Archived";
					Mocks.MOCK_ARCHIVED_COURSES.push({ ...cohort });
				}
			}
		});

		const archiveList = (list) => {
			const toArchive = list.filter(
				(c) => c.end_date && c.status !== "Archived" && new Date(c.end_date) < now,
			);
			toArchive.forEach((c) => {
				c.status = "Archived";
				c.visibility = "Archived";
				Mocks.MOCK_ARCHIVED_COURSES.push({ ...c });
			});
			return toArchive;
		};

		const createdArchived = archiveList(dashboardData.createdCohorts);
		dashboardData.createdCohorts = dashboardData.createdCohorts.filter(
			(c) => !createdArchived.includes(c),
		);

		const joinedArchived = archiveList(dashboardData.joinedCohorts);
		dashboardData.joinedCohorts = dashboardData.joinedCohorts.filter(
			(c) => !joinedArchived.includes(c),
		);

		const totalArchived = createdArchived.length + joinedArchived.length;
		return {
			success: true,
			data: { archivedCount: totalArchived, message: `${totalArchived} course(s) auto-archived` },
		};
	}

	// ── POST /cohort/:id/archive ────────────────────────────────────────────
	if (
		endpoint.match(/^\/cohort\/(\d+)\/archive$/) &&
		options.method === "POST"
	) {
		const courseId = parseInt(endpoint.match(/^\/cohort\/(\d+)\/archive$/)[1]);
		const userRole = localStorage.getItem("userRole");
		const dashboardData =
			userRole === "professor"
				? Mocks.MOCK_PROFESSOR_DASHBOARD_DATA
				: Mocks.MOCK_STUDENT_DASHBOARD_DATA;

		const courseInShared = Mocks.SHARED_COHORTS.find((c) => c.id === courseId);
		if (courseInShared) {
			courseInShared.status = "Archived";
			courseInShared.visibility = "Archived";
		}

		const createdIndex = dashboardData.createdCohorts.findIndex((c) => c.id === courseId);
		if (createdIndex !== -1) {
			const [archived] = dashboardData.createdCohorts.splice(createdIndex, 1);
			archived.status = "Archived";
			archived.visibility = "Archived";
			Mocks.MOCK_ARCHIVED_COURSES.push(archived);
			return { success: true, message: "Course archived successfully" };
		}

		const joinedIndex = dashboardData.joinedCohorts.findIndex((c) => c.id === courseId);
		if (joinedIndex !== -1) {
			const [archived] = dashboardData.joinedCohorts.splice(joinedIndex, 1);
			archived.status = "Archived";
			archived.visibility = "Archived";
			Mocks.MOCK_ARCHIVED_COURSES.push(archived);
			return { success: true, message: "Course archived successfully" };
		}

		return { success: false, error: "Course not found" };
	}

	// ── GET /cohort/:id/details ─────────────────────────────────────────────
	if (endpoint.match(/^\/cohort\/(\d+)\/details$/)) {
		return _handleCourseDetails(endpoint, options);
	}

	// ── GET /cohort/:id/members ─────────────────────────────────────────────
	if (endpoint.match(/^\/cohort\/(\d+)\/members/)) {
		return _handleCourseMembers(endpoint);
	}

	// ── Assignments CRUD (/cohort/:id/assignments[/:id]) ───────────────────
	if (endpoint.match(/^\/cohort\/([^/]+)\/assignments(\/[^/]+)?$/)) {
		return _handleAssignments(endpoint, options);
	}

	// ── GET /cohort/:cohortId/group/:groupId/details ────────────────────────
	if (endpoint.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)) {
		return _handleGroupDetails(endpoint);
	}

	// ── GET /cohort/group/:id/details  (legacy, no cohortId) ───────────────
	if (endpoint.match(/^\/cohort\/group\/(\d+)\/details$/)) {
		return _handleGroupDetailsLegacy(endpoint);
	}

	// ── Resources CRUD ─────────────────────────────────────────────────────
	if (endpoint.match(/^\/cohort\/\d+\/resources/)) {
		return _handleResources(endpoint, options);
	}

	// ── Student meetings ────────────────────────────────────────────────────
	if (
		endpoint.match(/^\/cohort\/\d+\/student\/meetings$/) &&
		(!options.method || options.method === "GET")
	) {
		return { success: true, data: Mocks.MOCK_SCHEDULED_MEETINGS };
	}

	// ── Student meeting requests ────────────────────────────────────────────
	if (endpoint.match(/^\/cohort\/\d+\/student\/meeting-requests/)) {
		const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
		const userId = authUser.id || 1;

		if (options.method === "POST") {
			const body = JSON.parse(options.body);
			const newRequest = {
				id: Date.now(),
				...body,
				status: "pending",
				studentId: userId,
				submittedAt: new Date().toISOString(),
			};
			if (!Mocks.MOCK_MEETING_REQUESTS.incoming) {
				Mocks.MOCK_MEETING_REQUESTS.incoming = [];
			}
			Mocks.MOCK_MEETING_REQUESTS.incoming.unshift(newRequest);
			return { success: true, data: newRequest };
		}

		return {
			success: true,
			data: (Mocks.MOCK_MEETING_REQUESTS.incoming || []).filter(
				(r) => r.studentId === userId,
			),
		};
	}

	return null; // not matched
}

// ─── Private helpers ────────────────────────────────────────────────────────

function _assignmentStats(courseAssignments, isAdmin, memberCount, groupCount, currentUserId, courseId) {
	let completed, pending;
	if (isAdmin) {
		completed = courseAssignments.filter((a) =>
			a.type === "group"
				? a.submissions?.length === groupCount && groupCount > 0
				: a.submissions?.length === memberCount,
		).length;
		pending = courseAssignments.filter((a) =>
			a.type === "group"
				? !a.submissions || a.submissions.length < groupCount || groupCount === 0
				: !a.submissions || a.submissions.length < memberCount,
		).length;
	} else {
		completed = courseAssignments.filter((a) => a.status === "submitted" || a.submittedAt).length;
		pending = courseAssignments.filter((a) => a.status !== "submitted" && !a.submittedAt).length;
	}
	return { completed, pending };
}

function _groupMembership(isAdmin, courseId, currentUserId) {
	let groupName = null;
	let isGroupLeader = false;
	if (!isAdmin) {
		const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[courseId];
		if (courseMemberData?.groups) {
			for (const group of courseMemberData.groups) {
				if (group.members.includes(currentUserId)) {
					groupName = group.name;
					isGroupLeader = group.members[0] === currentUserId;
					break;
				}
			}
		}
	}
	return { groupName, isGroupLeader };
}

function _handleCourseDetails(endpoint, options) {
	const courseId = parseInt(endpoint.match(/^\/cohort\/(\d+)\/details$/)[1]);
	const userRole = localStorage.getItem("userRole");
	const isAdmin = userRole === "professor";
	const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
	const currentUserId = authUser?.id || 1;

	const courseAssignments = Mocks.MOCK_COURSE_ASSIGNMENTS[courseId] || [];
	const totalAssignments = courseAssignments.length;

	// Try MOCK_COURSE_DETAILS first
	const courseDetails = Mocks.MOCK_COURSE_DETAILS?.find((c) => c.id === courseId);
	if (courseDetails) {
		const memberCount = courseDetails.memberCount || 45;
		const groupCount = courseDetails.groupCount || 0;
		const { completed, pending } = _assignmentStats(courseAssignments, isAdmin, memberCount, groupCount);
		const { groupName, isGroupLeader } = _groupMembership(isAdmin, courseId, currentUserId);
		return {
			success: true,
			data: {
				...courseDetails,
				is_admin: isAdmin,
				user_type: isAdmin ? 1 : 0,
				pending_assignments: pending,
				completed_assignments: completed,
				total_assignments: totalAssignments,
				group_name: groupName,
				is_group_leader: isGroupLeader,
			},
		};
	}

	// Try dashboard data
	const currentDashboardData =
		userRole === "professor"
			? Mocks.MOCK_PROFESSOR_DASHBOARD_DATA
			: Mocks.MOCK_STUDENT_DASHBOARD_DATA;

	const dashboardCourse = [
		...currentDashboardData.createdCohorts,
		...currentDashboardData.joinedCohorts,
	].find((c) => c.id === courseId);

	if (dashboardCourse) {
		const memberCount = dashboardCourse.member_count || 45;
		const groupCount = dashboardCourse.group_count || 0;
		const { completed, pending } = _assignmentStats(courseAssignments, isAdmin, memberCount, groupCount);
		let { groupName, isGroupLeader } = _groupMembership(isAdmin, courseId, currentUserId);
		if (!isAdmin) {
			groupName = groupName ?? dashboardCourse.group_name ?? null;
			isGroupLeader = isGroupLeader || dashboardCourse.is_group_leader || false;
		}
		return {
			success: true,
			data: {
				id: courseId,
				cohort_name: dashboardCourse.cohort_name,
				course_codes: dashboardCourse.course_codes || `CS${400 + courseId}`,
				cohort_description: dashboardCourse.cohort_description,
				status: dashboardCourse.status || "Live",
				visibility: dashboardCourse.visibility || "Active",
				organization_name: "Mahindra University",
				instructor: "Professor",
				start_date: dashboardCourse.start_date || "2026-01-20T00:00:00Z",
				end_date: dashboardCourse.end_date || "2026-05-15T00:00:00Z",
				created_at: dashboardCourse.created_at,
				member_count: memberCount,
				group_count: groupCount,
				is_admin: isAdmin,
				user_type: isAdmin ? 1 : 0,
				pending_assignments: pending,
				completed_assignments: completed,
				total_assignments: totalAssignments,
				group_name: groupName,
				is_group_leader: isGroupLeader,
				detail_sections: _defaultDetailSections(dashboardCourse.cohort_description),
			},
		};
	}

	// Fallback — generic course
	const courseMembers = Mocks.MOCK_COURSE_MEMBERS[courseId];
	const memberCount = courseMembers?.students?.length || 45;
	const groupCount = courseMembers?.groups?.length || 3;
	const { completed, pending } = _assignmentStats(courseAssignments, isAdmin, memberCount, groupCount);
	const { groupName, isGroupLeader } = _groupMembership(isAdmin, courseId, currentUserId);

	return {
		success: true,
		data: {
			id: courseId,
			cohort_name: "Course " + courseId,
			course_code: `CS${400 + courseId}`,
			cohort_description: "Course description",
			status: "Live",
			visibility: "Active",
			organization_name: "Mahindra University",
			instructor: "Professor",
			start_date: "2026-01-20T00:00:00Z",
			end_date: "2026-05-15T00:00:00Z",
			created_at: new Date().toISOString(),
			member_count: memberCount,
			group_count: groupCount,
			is_admin: isAdmin,
			user_type: isAdmin ? 1 : 0,
			pending_assignments: pending,
			completed_assignments: completed,
			total_assignments: totalAssignments,
			group_name: groupName,
			is_group_leader: isGroupLeader,
			detail_sections: _defaultDetailSections(),
		},
	};
}

function _handleCourseMembers(endpoint) {
	const courseId = parseInt(endpoint.match(/^\/cohort\/(\d+)\/members/)[1]);
	const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
	const currentUserId = authUser?.id || 1;

	const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[courseId];
	if (!courseMemberData) {
		return { success: true, data: { participants: [], groups: [], is_group: false } };
	}

	const participants = courseMemberData.students.map((student) => ({
		email: `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`,
		user_details: {
			user_id: student.id,
			display_name: student.rollNumber,
			username: student.name,
			profile_pic: null,
			is_active: true,
			created_at: "2026-01-15T00:00:00Z",
		},
	}));

	const groups = courseMemberData.groups.map((group) => ({
		id: group.id,
		group_name: group.name,
		group_description: `Group with ${group.members.length} members`,
		project_name: `${group.name} Project`,
		created_at: "2026-01-20T00:00:00Z",
		CohortGroupMembers: group.members.map((memberId) => {
			const student = courseMemberData.students.find((s) => s.id === memberId);
			return {
				user_id: memberId,
				email: student
					? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
					: `user${memberId}@example.com`,
				role: group.members[0] === memberId ? "leader" : "member",
			};
		}),
	}));

	const is_group = courseMemberData.groups.some(
		(g) => g.members.includes(currentUserId) || g.isYouInGroup,
	);

	return { success: true, data: { participants, groups, is_group } };
}

function _handleAssignments(endpoint, options) {
	// POST create
	if (endpoint.match(/^\/cohort\/([^/]+)\/assignments$/) && options.method === "POST") {
		const courseId = endpoint.match(/^\/cohort\/([^/]+)\/assignments$/)[1];
		const assignmentData = JSON.parse(options.body);
		const newAssignment = {
			id: Date.now(),
			name: assignmentData.name || assignmentData.title,
			title: assignmentData.name || assignmentData.title,
			description: assignmentData.description,
			deadline: assignmentData.deadline,
			dueDate: assignmentData.deadline,
			marks: assignmentData.marks || "10",
			type: assignmentData.type || "individual",
			status: "pending",
			submittedAt: null,
			submissions: [],
			created_at: new Date().toISOString(),
			createdAt: new Date().toISOString(),
			createdBy: "Prof. Jane Smith",
			cohort_id: courseId,
			cohortId: courseId,
			submissionLink: assignmentData.submissionLink || "",
		};
		if (!Mocks.MOCK_COURSE_ASSIGNMENTS[courseId]) {
			Mocks.MOCK_COURSE_ASSIGNMENTS[courseId] = [];
		}
		Mocks.MOCK_COURSE_ASSIGNMENTS[courseId].push(newAssignment);
		return { success: true, data: newAssignment };
	}

	// PUT update
	if (
		endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/) &&
		options.method === "PUT"
	) {
		const [, courseId, assignmentId] = endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/);
		const courseAssignments = Mocks.MOCK_COURSE_ASSIGNMENTS[courseId];
		if (courseAssignments) {
			const index = courseAssignments.findIndex((a) => a.id == assignmentId);
			if (index !== -1) {
				const updatedData = JSON.parse(options.body);
				courseAssignments[index] = {
					...courseAssignments[index],
					...updatedData,
					name: updatedData.name || updatedData.title,
					title: updatedData.name || updatedData.title,
					updated_at: new Date().toISOString(),
				};
				return { success: true, data: courseAssignments[index] };
			}
		}
		return { success: false, error: "Assignment not found" };
	}

	// DELETE
	if (
		endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/) &&
		options.method === "DELETE"
	) {
		const [, courseId, assignmentId] = endpoint.match(/^\/cohort\/([^/]+)\/assignments\/([^/]+)$/);
		const courseAssignments = Mocks.MOCK_COURSE_ASSIGNMENTS[courseId];
		if (courseAssignments) {
			const index = courseAssignments.findIndex((a) => a.id == assignmentId);
			if (index !== -1) {
				courseAssignments.splice(index, 1);
				return { success: true, message: "Assignment deleted successfully" };
			}
		}
		return { success: false, error: "Assignment not found" };
	}

	// GET list (default)
	const courseId = endpoint.match(/^\/cohort\/([^/]+)\/assignments/)?.[1];
	const courseAssignments = Mocks.MOCK_COURSE_ASSIGNMENTS[courseId];
	if (!courseAssignments) return { success: true, data: { assignments: [] } };

	const transformed = courseAssignments.map((a) => ({
		id: a.id,
		name: a.title,
		title: a.title,
		description: a.description,
		deadline: a.dueDate,
		marks: a.marks || "10",
		type: a.type,
		status: a.status,
		submittedAt: a.submittedAt,
		submissions: a.submissions || [],
		created_at: a.createdAt,
		cohort_id: courseId,
		submissionLink: a.submissionLink,
	}));

	return { success: true, data: { assignments: transformed } };
}

function _handleGroupDetails(endpoint) {
	const [, cohortId, groupId] = endpoint
		.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)
		.map(Number);

	const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[cohortId];
	if (!courseMemberData) return { success: false, error: "Group not found" };

	const group = courseMemberData.groups.find((g) => g.id === groupId);
	if (!group) return { success: false, error: "Group not found" };

	return { success: true, data: _buildGroupPayload(group, courseMemberData, cohortId) };
}

function _handleGroupDetailsLegacy(endpoint) {
	const groupId = parseInt(endpoint.match(/^\/cohort\/group\/(\d+)\/details$/)[1]);
	for (const courseId in Mocks.MOCK_COURSE_MEMBERS) {
		const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[courseId];
		const group = courseMemberData.groups.find((g) => g.id === groupId);
		if (group) {
			return { success: true, data: _buildGroupPayload(group, courseMemberData, parseInt(courseId)) };
		}
	}
	return { success: false, error: "Group not found" };
}

function _buildGroupPayload(group, courseMemberData, cohortId) {
	const members = group.members.map((memberId) => {
		const student = courseMemberData.students.find((s) => s.id === memberId);
		const isLeader = group.members[0] === memberId;
		return {
			user: {
				user_id: memberId,
				email: student
					? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
					: `user${memberId}@example.com`,
				display_name: student ? student.rollNumber : `USER${memberId}`,
				username: student ? student.name : `User ${memberId}`,
				profile_pic: null,
				is_active: true,
			},
			is_admin: isLeader,
			joined_at: "2026-01-15T00:00:00Z",
		};
	});
	return {
		group: {
			id: group.id,
			group_name: group.name,
			group_description: `Group with ${group.members.length} members`,
			project_name: `${group.name} Project`,
			created_at: "2026-01-20T00:00:00Z",
			max_members: 4,
			cohort_id: cohortId,
		},
		members,
		leader: members.find((m) => m.is_admin)?.user,
	};
}

function _handleResources(endpoint, options) {
	// GET all
	if (endpoint.match(/^\/cohort\/\d+\/resources$/) && (!options.method || options.method === "GET")) {
		const cohortId = Number(endpoint.match(/^\/cohort\/(\d+)\/resources$/)[1]);
		const data = Mocks.MOCK_RESOURCES[cohortId] || { weeks: [], stats: { totalWeeks: 0, totalResources: 0 } };
		return { success: true, data };
	}

	// POST week
	if (endpoint.match(/^\/cohort\/\d+\/resources\/week$/) && options.method === "POST") {
		const cohortId = Number(endpoint.match(/^\/cohort\/(\d+)\/resources\/week$/)[1]);
		const newWeek = { id: Date.now(), ...JSON.parse(options.body), totalResources: 0, resources: [] };
		if (Mocks.MOCK_RESOURCES[cohortId]) {
			Mocks.MOCK_RESOURCES[cohortId].weeks.push(newWeek);
			Mocks.MOCK_RESOURCES[cohortId].stats.totalWeeks++;
		} else {
			Mocks.MOCK_RESOURCES[cohortId] = { weeks: [newWeek], stats: { totalWeeks: 1, totalResources: 0 } };
		}
		return { success: true, data: newWeek };
	}

	// POST resource into week
	if (endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) && options.method === "POST") {
		const [, cohortId, weekId] = endpoint.match(/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/).map(Number);
		const newResource = { id: Date.now(), ...JSON.parse(options.body), addedAt: new Date().toISOString(), addedBy: "You" };
		if (Mocks.MOCK_RESOURCES[cohortId]) {
			const week = Mocks.MOCK_RESOURCES[cohortId].weeks.find((w) => w.id === weekId);
			if (week) {
				week.resources.push(newResource);
				week.totalResources = week.resources.length;
				Mocks.MOCK_RESOURCES[cohortId].stats.totalResources++;
			}
		}
		return { success: true, data: newResource };
	}

	// PUT week
	if (endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) && options.method === "PUT") {
		const [, cohortId, weekId] = endpoint.match(/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/).map(Number);
		if (Mocks.MOCK_RESOURCES[cohortId]) {
			const weekIndex = Mocks.MOCK_RESOURCES[cohortId].weeks.findIndex((w) => w.id === weekId);
			if (weekIndex !== -1) {
				Mocks.MOCK_RESOURCES[cohortId].weeks[weekIndex] = {
					...Mocks.MOCK_RESOURCES[cohortId].weeks[weekIndex],
					...JSON.parse(options.body),
				};
			}
		}
		return { success: true, data: { message: "Week updated successfully" } };
	}

	// DELETE week
	if (endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) && options.method === "DELETE") {
		const [, cohortId, weekId] = endpoint.match(/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/).map(Number);
		if (Mocks.MOCK_RESOURCES[cohortId]) {
			const weekIndex = Mocks.MOCK_RESOURCES[cohortId].weeks.findIndex((w) => w.id === weekId);
			if (weekIndex !== -1) {
				const deleted = Mocks.MOCK_RESOURCES[cohortId].weeks.splice(weekIndex, 1)[0];
				Mocks.MOCK_RESOURCES[cohortId].stats.totalWeeks--;
				Mocks.MOCK_RESOURCES[cohortId].stats.totalResources -= deleted.totalResources || 0;
			}
		}
		return { success: true, data: { message: "Week deleted successfully" } };
	}

	// PUT resource
	if (endpoint.match(/^\/cohort\/\d+\/resources\/\d+$/) && options.method === "PUT") {
		const [, cohortId, resourceId] = endpoint.match(/^\/cohort\/(\d+)\/resources\/(\d+)$/).map(Number);
		if (Mocks.MOCK_RESOURCES[cohortId]) {
			for (const week of Mocks.MOCK_RESOURCES[cohortId].weeks) {
				const idx = week.resources.findIndex((r) => r.id === resourceId);
				if (idx !== -1) {
					week.resources[idx] = { ...week.resources[idx], ...JSON.parse(options.body) };
					break;
				}
			}
		}
		return { success: true, data: { message: "Resource updated successfully" } };
	}

	// DELETE resource
	if (endpoint.match(/^\/cohort\/\d+\/resources\/\d+$/) && options.method === "DELETE") {
		const [, cohortId, resourceId] = endpoint.match(/^\/cohort\/(\d+)\/resources\/(\d+)$/).map(Number);
		if (Mocks.MOCK_RESOURCES[cohortId]) {
			for (const week of Mocks.MOCK_RESOURCES[cohortId].weeks) {
				const idx = week.resources.findIndex((r) => r.id === resourceId);
				if (idx !== -1) {
					week.resources.splice(idx, 1);
					week.totalResources = week.resources.length;
					Mocks.MOCK_RESOURCES[cohortId].stats.totalResources--;
					break;
				}
			}
		}
		return { success: true, data: { message: "Resource deleted successfully" } };
	}

	// GET discussions — frontend expects an array
	if (endpoint.match(/^\/cohort\/[^/]+\/discussions$/) && (!options.method || options.method === "GET")) {
		return { success: true, data: [] };
	}

	// POST new discussion
	if (endpoint.match(/^\/cohort\/[^/]+\/discussions$/) && options.method === "POST") {
		const body = JSON.parse(options.body || "{}");
		return {
			success: true,
			data: {
				id: Date.now(),
				...body,
				createdAt: new Date().toISOString(),
				replies: [],
			},
		};
	}

	return null;
}

function _defaultDetailSections(description) {
	return [
		{
			id: 1,
			title: "Course Overview",
			subsec_description:
				description ||
				"Welcome to this comprehensive course! This course is designed to provide you with in-depth knowledge and practical skills in the subject area.",
		},
		{
			id: 2,
			title: "Learning Objectives",
			subsec_description:
				"By the end of this course, you will demonstrate understanding of core theoretical concepts, apply learned skills to real-world problems, and collaborate effectively in teams.",
		},
		{
			id: 3,
			title: "Course Schedule",
			subsec_description:
				"Weeks 1-2: Foundations | Weeks 3-5: Core Concepts | Weeks 6-8: Advanced Topics | Weeks 9-11: Applications | Weeks 12-15: Review & Finals",
		},
		{
			id: 4,
			title: "Prerequisites",
			subsec_description:
				"Basic programming knowledge, understanding of data structures, familiarity with version control (Git).",
		},
		{
			id: 5,
			title: "Grading Criteria",
			subsec_description:
				"Assignments: 30% | Quizzes: 15% | Mid-term Project: 20% | Final Project: 25% | Participation: 10%",
		},
	];
}