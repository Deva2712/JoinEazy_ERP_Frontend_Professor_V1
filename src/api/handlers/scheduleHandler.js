// src/api/handlers/scheduleHandler.js
// Covers: /professor/schedule, /professor/meetings/:id/(accept|reject|reschedule),
//         /sessions/*, /calendar/events

import * as Mocks from "../mock";

export function handleSchedule(endpoint, options = {}) {
	// ── GET /professor/schedule ─────────────────────────────────────────────
	if (endpoint === "/professor/schedule") {
		return {
			success: true,
			data: {
				scheduledMeetings: Mocks.MOCK_SCHEDULED_MEETINGS,
				meetingRequests: Mocks.MOCK_MEETING_REQUESTS.incoming.filter(
					(r) => r.status === "pending",
				),
				outgoingRequests: Mocks.MOCK_MEETING_REQUESTS.outgoing,
				schedule: {
					officeHours: Mocks.MOCK_OFFICE_HOURS,
					timetable: Mocks.MOCK_COURSE_SCHEDULE.flatMap((course) =>
						course.schedule.map((session) => ({
							...session,
							courseName: course.courseName,
							courseId: course.id,
							courseType: course.courseType,
							startDate: course.startDate,
							endDate: course.endDate,
						})),
					),
				},
			},
		};
	}

	// ── POST /professor/meetings/:id/(accept|reject|reschedule) ─────────────
	if (
		endpoint.match(/^\/professor\/meetings\/\d+\/(accept|reject|reschedule)$/)
	) {
		const parts = endpoint.split("/");
		const requestId = parseInt(parts[3]);
		const action = parts[4];
		const body = options.body ? JSON.parse(options.body) : {};

		const request = Mocks.MOCK_MEETING_REQUESTS.incoming.find(
			(r) => r.id === requestId,
		);
		if (request) {
			if (action === "accept") {
				request.status = "accepted";
				request.location = body.location || "Office/Online";
			} else if (action === "reject") {
				request.status = "rejected";
			}
		}
		return { success: true, data: { message: `Meeting ${action}ed successfully` } };
	}

	// ── Sessions ────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/sessions\/.+/)) {
		return _handleSessions(endpoint, options);
	}

	// ── Calendar ────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/calendar\/events/)) {
		return _handleCalendar(endpoint, options);
	}

	return null; // not matched
}

// ─── Private helpers ────────────────────────────────────────────────────────

function _handleSessions(endpoint, options) {
	const method = options?.method || "GET";

	// GET schedules
	if (endpoint.match(/^\/sessions\/schedules$/) && method === "GET") {
		return { success: true, data: Mocks.MOCK_COURSE_SCHEDULE };
	}

	// GET today's classes
	if (endpoint.match(/^\/sessions\/today$/) && method === "GET") {
		const todays = Mocks.MOCK_COURSE_SCHEDULE.filter(
			(s) => s.status === "Ongoing",
		).map((s, i) => ({ ...s, id: `${s.id}_today_${i}` }));
		return { success: true, data: todays };
	}

	// POST archive
	if (endpoint.match(/^\/sessions\/[^/]+\/archive$/) && method === "POST") {
		const id = endpoint.split("/")[2];
		const section = Mocks.MOCK_COURSE_SCHEDULE.find((s) => s.id === id);
		if (section) section.status = "Completed";
		return { success: true, data: section };
	}

	// GET reflections
	if (endpoint.match(/^\/sessions\/reflections/) && method === "GET") {
		return { success: true, data: Mocks.MOCK_REFLECTIONS };
	}

	// POST reflection
	if (endpoint.match(/^\/sessions\/reflections$/) && method === "POST") {
		const data = JSON.parse(options.body);
		const newRef = {
			id: `ref_${Date.now()}`,
			...data,
			date: data.date || new Date().toISOString(),
			status: "Submitted",
		};
		Mocks.MOCK_REFLECTIONS.unshift(newRef);
		return { success: true, data: newRef };
	}

	// Documents
	if (endpoint.match(/^\/sessions\/documents\/.+/)) {
		const parts = endpoint.split("/");
		const isBulk = parts.includes("bulk");
		const courseId = isBulk ? parts[parts.length - 2] : parts[parts.length - 1];

		if (method === "GET") {
			return { success: true, data: Mocks.MOCK_COURSE_DOCUMENTS[courseId] || {} };
		}

		if (method === "POST") {
			if (!Mocks.MOCK_COURSE_DOCUMENTS[courseId]) {
				Mocks.MOCK_COURSE_DOCUMENTS[courseId] = {};
			}
			const body = JSON.parse(options.body);
			const uploadedKeys = isBulk ? body.docs : [body.docType];

			uploadedKeys.forEach((docType) => {
				const currentDoc = Mocks.MOCK_COURSE_DOCUMENTS[courseId][docType] || {};
				Mocks.MOCK_COURSE_DOCUMENTS[courseId][docType] = {
					fileName: body.fileNames?.[docType] || `updated_${docType}.pdf`,
					fileLink: "#",
					version: (currentDoc.version || 0) + 1,
					uploadDate: new Date().toISOString(),
					hodApproved: null,
					hodComments: null,
				};
			});
			return { success: true, data: Mocks.MOCK_COURSE_DOCUMENTS[courseId] };
		}
	}

	return null;
}

function _handleCalendar(endpoint, options) {
	// GET events
	if (
		endpoint.match(/^\/calendar\/events(\?.*)?$/) &&
		(!options.method || options.method === "GET")
	) {
		const params = new URL(endpoint, "http://localhost").searchParams;
		const type = params.get("type");
		const filtered =
			type && type !== "all"
				? Mocks.MOCK_CALENDAR_EVENTS.filter((e) => e.type === type)
				: Mocks.MOCK_CALENDAR_EVENTS;
		return { success: true, data: filtered };
	}

	// POST create event
	if (
		endpoint.match(/^\/calendar\/events$/) &&
		options.method === "POST"
	) {
		const body = JSON.parse(options.body);
		const newEvent = { ...body, id: `PE${Date.now()}` };
		Mocks.MOCK_CALENDAR_EVENTS.push(newEvent);
		return { success: true, data: newEvent };
	}

	// DELETE event
	if (
		endpoint.match(/^\/calendar\/events\/[^/]+$/) &&
		options.method === "DELETE"
	) {
		const eventId = endpoint.split("/").pop();
		const index = Mocks.MOCK_CALENDAR_EVENTS.findIndex((e) => e.id === eventId);
		if (index !== -1) {
			Mocks.MOCK_CALENDAR_EVENTS.splice(index, 1);
			return { success: true, message: "Event deleted" };
		}
		return { success: false, error: "Event not found" };
	}

	return null;
}