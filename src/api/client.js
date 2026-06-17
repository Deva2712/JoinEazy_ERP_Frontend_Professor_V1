// src/api/client.js
import { USE_MOCK_API, FINAL_API_BASE_URL } from "./config";

import { handleUser }          from "./handlers/userHandler";
import { handleCohort }        from "./handlers/cohortHandler";
import { handleSchedule }      from "./handlers/scheduleHandler";
import { handleAdmin }         from "./handlers/adminHandler";
import { handleLibrary }       from "./handlers/libraryHandler";
import { handleNotifications } from "./handlers/notificationsHandler";
import { handleStudent }       from "./handlers/studentHandler";
import { handleRevaluation }   from "./handlers/revaluationHandler";

let currentRole = localStorage.getItem("userRole") || "student";

export const setClientConfig = (role) => {
	currentRole = role;
	if (role) localStorage.setItem("userRole", role);
	else localStorage.removeItem("userRole");
};

const getToken = () => localStorage.getItem("token");

const MOCK_HANDLERS = [
	handleUser,
	handleCohort,
	handleSchedule,
	handleAdmin,
	handleLibrary,
	handleNotifications,
	handleStudent,
	handleRevaluation,
];

// ── Real backend endpoints ────────────────────────────────────────────────────
const REAL_ENDPOINTS = [
	// Auth
	/^\/auth\//,


	/^\/users\//,
	/^\/assets\//,
    /^\/user\//,

	// User dashboard — /user/dashboard-overview (real UUID cohort IDs ke liye)
	/^\/user\/dashboard-overview/,
	/^\/user\/details/,
	/^\/user\/settings/,

	// Cohort core
	/^\/cohort\/archived/,
	/^\/cohort\/[^/]+\/details/,
	/^\/cohort\/create/,

	// Cohort sub-modules
	/^\/cohort\/[^/]+\/announcements/,
	/^\/cohort\/[^/]+\/assignments/,
	/^\/cohort\/assignments\//,
	/^\/cohort\/[^/]+\/posts/,
	/^\/cohort\/[^/]+\/events/,
	/^\/cohort\/[^/]+\/members/,
	/^\/cohort\/[^/]+\/notes/,
	/^\/cohort\/[^/]+\/resources/,
	/^\/cohort\/[^/]+\/courses/,
	/^\/cohort\/[^/]+\/student\/meeting/,
      /^\/cohort\/[^/]+\/materials/,
     /^\/cohort\/[^/]+\/discussions/,


	// Attendance
	/^\/attendance\/logs\//,
	/^\/courses\/[^/]+\/attendance/,

	// Bulletins
	/^\/bulletins/,

	// Library
	/^\/library\//,

	// Maintenance
	/^\/maintenance\//,

	// Exams
	/^\/exams\//,

	// Leaves
	/^\/leaves\//,


	/^\/notifications\//,
	/^\/student\/notifications/,
	// Student profile (single round-trip)
	/^\/student\/profile/,

	// Finance (student)
	/^\/finance\//,

	// Finance management (professor)
	/^\/expenses\//,
	/^\/advances\//,

	// Research
	/^\/research\//,
    
	/^\/payroll\//,

	/^\/sessions\//,
    /^\/calendar\//,

	// Professor schedule & meetings
	/^\/professor\//,
    
	/^\/registrar\//,
     
	/^\/lor\//,

	 /^\/notifications$/,       
  /^\/notifications\//,         
  /^\/job-tray$/,             
  /^\/student\/job-tray$/,    
  /^\/student\/notifications$/, 
   

  /^\/revaluation\//,


];

export const apiCall = async (endpoint, options = {}) => {
	const isReal = REAL_ENDPOINTS.some((pattern) => pattern.test(endpoint));

	if (isReal) {
		console.log(` [REAL]  ${options.method || "GET"} ${endpoint}`);
		return realApiCall(endpoint, options);
	}

	console.log(` [MOCK]  ${options.method || "GET"} ${endpoint}`);
	await new Promise((resolve) => setTimeout(resolve, 300));

	for (const handler of MOCK_HANDLERS) {
		const result = handler(endpoint, options);
		if (result !== null && result !== undefined) return result;
	}

	console.warn(`[Mock API] No handler matched: ${options.method || "GET"} ${endpoint}`);
	return { success: true, data: {} };
};

const realApiCall = async (endpoint, options = {}) => {
	try {
		const fullUrl = `${FINAL_API_BASE_URL}${endpoint}`;
		const token = getToken();
		const { headers: _h, ...restOptions } = options;

		const response = await fetch(fullUrl, {
			credentials: "include",
			...restOptions,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		});
		if (!response.ok) {
			const errorText = await response.text();
			let errorData;
			try { errorData = JSON.parse(errorText); }
			catch { errorData = { message: errorText || "Unknown error" }; }

			if (response.status === 401) {
				return { success: false, error: "Authentication required. Please log in again.", statusCode: 401 };
			}
			return { success: false, error: errorData.message || `HTTP ${response.status}`, statusCode: response.status };
		}

		const data = await response.json();

		if (data.success === true) return { success: true, data: data.data ?? data };
		if (data.status === "success") return { success: true, data: data.data ?? data };
		if (data.message && data.data !== undefined) return { success: true, data: data.data };
		return { success: true, data };
	} catch (error) {
		console.error("API call - Network error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};