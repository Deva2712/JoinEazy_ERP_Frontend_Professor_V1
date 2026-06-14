// src/api/handlers/userHandler.js
// Covers: /user/*, /bulletins

import * as Mocks from "../mock";

/**
 * Handles all /user/* and /bulletins mock API endpoints.
 */

// Helper — role ke hisaab se sahi mock data do
function getMockDataByRole(userRole) {
	if (userRole === "hod" || userRole === "hr") {
		return Mocks.MOCK_HOD_DASHBOARD_DATA;
	}
	if (userRole === "professor") {
		return Mocks.MOCK_PROFESSOR_DASHBOARD_DATA;
	}
	return Mocks.MOCK_STUDENT_DASHBOARD_DATA;
}

export function handleUser(endpoint, options = {}) {
	// ── GET /user/dashboard-overview ────────────────────────────────────────
	if (endpoint.match(/^\/user\/dashboard-overview$/)) {
		const userRole = localStorage.getItem("userRole") || "professor";
		return {
			success: true,
			data: getMockDataByRole(userRole),
		};
	}

	// ── PUT /user/check-username ─────────────────────────────────────────────
	if (
		endpoint.match(/^\/user\/check-username(?:\?username=(.+))?$/) &&
		options.method === "PUT"
	) {
		const body = JSON.parse(options.body);
		const userRole = localStorage.getItem("userRole") || "professor";
		const targetData = getMockDataByRole(userRole);
		Object.assign(targetData.user, body);
		return { success: true, data: targetData.user };
	}

	// ── GET /user/settings ───────────────────────────────────────────────────
	if (endpoint.match(/^\/user\/settings$/)) {
		const username =
			new URLSearchParams(endpoint.split("?")[1]).get("username") || "";

		const isTaken =
			Mocks.MOCK_PROFESSOR_DASHBOARD_DATA.user.fullName?.toLowerCase() ===
				username.toLowerCase() ||
			Mocks.MOCK_STUDENT_DASHBOARD_DATA.user.name?.toLowerCase() ===
				username.toLowerCase();

		return { success: true, data: { available: !isTaken } };
	}

	// ── POST /user/bug-report ────────────────────────────────────────────────
	if (
		endpoint.match(/^\/user\/bug-report$/) &&
		options.method === "POST"
	) {
		return { success: true, message: "Bug report received successfully." };
	}

	// ── GET /bulletins ───────────────────────────────────────────────────────
	if (endpoint.match(/^\/bulletins(\?.*)?$/)) {
		if (options.method === "GET" || !options.method) {
			const url = new URL(endpoint, "http://localhost");
			const level = url.searchParams.get("level");
			const courseId = url.searchParams.get("courseId");
			const priority = url.searchParams.get("priority");

			let filtered = [...Mocks.MOCK_BULLETINS];
			if (level) filtered = filtered.filter((b) => b.level === level);
			if (courseId)
				filtered = filtered.filter(
					(b) => b.courseId === parseInt(courseId),
				);
			if (priority)
				filtered = filtered.filter(
					(b) => b.priority.toLowerCase() === priority.toLowerCase(),
				);

			return { success: true, data: filtered };
		}

		if (options.method === "POST") {
			try {
				const body = JSON.parse(options.body || "{}");
				const newBulletin = {
					id: Date.now(),
					...body,
					createdAt: new Date().toISOString(),
					priority: body.priority || "Normal",
					attachments: body.attachments || [],
				};
				Mocks.MOCK_BULLETINS.unshift(newBulletin);
				return { success: true, data: newBulletin };
			} catch {
				return { success: false, message: "Bulletin creation failed" };
			}
		}
	}

	// ── Professor logs ───────────────────────────────────────────────────────
	if (endpoint.match(/^\/professor\/logs$/)) {
		return { success: true, data: Mocks.MOCK_PROFESSOR_LOGS || [] };
	}

	return null; // not matched
}