// src/api/handlers/studentHandler.js
// Covers: /student/timetable, /student/sessions, /student/tasks,
//         /student/attendance, /student/examination/*, /student/research/*,
//         /student/profile, /student/courses/*, /hostel/*, /mentor/*,
//         /finance/*, /registrar/*

import * as _MocksReadonly from "../mock";

// Mutable wrapper — allows us to reassign values without violating ES module immutability
const Mocks = Object.assign({}, _MocksReadonly);

export function handleStudent(endpoint, options = {}) {
	// ── Timetable ────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/student\/timetable$/) && _isGet(options)) {
		return { success: true, data: Mocks.MOCK_STUDENT_TIMETABLE };
	}

	if (endpoint.match(/^\/student\/sessions$/) && _isGet(options)) {
		return { success: true, data: Mocks.MOCK_STUDENT_SESSIONS };
	}

	// ── Tasks ────────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/student\/tasks(\?.*)?$/) && _isGet(options)) {
		const url = new URL(endpoint, "http://localhost");
		const date = url.searchParams.get("date");
		const filtered = date
			? Mocks.MOCK_STUDENT_TASKS.filter((t) => t.date === date)
			: Mocks.MOCK_STUDENT_TASKS;
		return { success: true, data: filtered };
	}

	if (endpoint.match(/^\/student\/tasks$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const newTask = { ...body, id: `task-${Date.now()}`, done: false };
		Mocks.MOCK_STUDENT_TASKS.push(newTask);
		return { success: true, data: newTask };
	}

	if (
		endpoint.match(/^\/student\/tasks\/[^/]+\/toggle$/) &&
		options.method === "PATCH"
	) {
		const taskId = endpoint.split("/")[3];
		const task = Mocks.MOCK_STUDENT_TASKS.find((t) => t.id === taskId);
		if (task) {
			task.done = !task.done;
			return { success: true, data: task };
		}
		return { success: false, error: "Task not found" };
	}

	if (
		endpoint.match(/^\/student\/tasks\/[^/]+$/) &&
		options.method === "DELETE"
	) {
		const taskId = endpoint.split("/")[3];
		const index = Mocks.MOCK_STUDENT_TASKS.findIndex((t) => t.id === taskId);
		if (index !== -1) {
			Mocks.MOCK_STUDENT_TASKS.splice(index, 1);
			return { success: true, message: "Task deleted" };
		}
		return { success: false, error: "Task not found" };
	}

	// ── Attendance ───────────────────────────────────────────────────────────
	if (endpoint.match(/^\/student\/attendance$/) && _isGet(options)) {
		return { success: true, data: Mocks.MOCK_STUDENT_ATTENDANCE };
	}

	if (endpoint.match(/^\/student\/attendance\/qr$/) && options.method === "POST") {
		const { token } = JSON.parse(options.body);
		if (!token || token.trim().length === 0) {
			return { success: false, error: "Invalid QR code." };
		}
		return {
			success: true,
			data: {
				message: "Attendance marked successfully!",
				course: "Scanned via QR",
				markedAt: new Date().toISOString(),
			},
		};
	}

	// ── Examination ──────────────────────────────────────────────────────────
	if (endpoint.match(/^\/student\/examination\//)) {
		return _handleExamination(endpoint, options);
	}

	// ── Research ─────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/student\/research\//)) {
		return _handleStudentResearch(endpoint, options);
	}

	// ── Profile ──────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/student\/profile/)) {
		return _handleStudentProfile(endpoint, options);
	}

	// ── Courses ──────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/student\/courses\//)) {
		return _handleStudentCourses(endpoint, options);
	}

	// ── Hostel ───────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/hostel\//)) {
		return _handleHostel(endpoint, options);
	}

	// ── Mentor ───────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/mentor\//)) {
		return _handleMentor(endpoint, options);
	}

	// ── Student finance ──────────────────────────────────────────────────────
	if (endpoint.match(/^\/finance/)) {
		return _handleStudentFinance(endpoint, options);
	}

	// ── Registrar ────────────────────────────────────────────────────────────
	if (endpoint.match(/^\/registrar/)) {
		return _handleRegistrar(endpoint, options);
	}

	// ── LoR (professor inbox) ────────────────────────────────────────────────
	if (endpoint.match(/^\/lor/)) {
		return _handleLor(endpoint, options);
	}

	return null; // not matched
}

// ─── Private helpers ────────────────────────────────────────────────────────

function _isGet(options) {
	return !options.method || options.method === "GET";
}

function _handleExamination(endpoint, options) {
	if (endpoint.match(/^\/student\/examination\/overview$/) && _isGet(options)) {
		return {
			success: true,
			data: {
				examSchedule: Mocks.MOCK_STUDENT_EXAM_SCHEDULE,
				results: Mocks.MOCK_STUDENT_RESULTS,
				gradeHistory: Mocks.MOCK_STUDENT_GRADE_HISTORY,
				revaluationRequests: Mocks._revaluationRequests,
			},
		};
	}

	if (endpoint.match(/^\/student\/examination\/schedule$/) && _isGet(options)) {
		return { success: true, data: Mocks.MOCK_STUDENT_EXAM_SCHEDULE };
	}

	if (endpoint.match(/^\/student\/examination\/results(\?.*)?$/) && _isGet(options)) {
		const semester = new URL(endpoint, "http://localhost").searchParams.get("semester");
		const filtered = semester
			? Mocks.MOCK_STUDENT_RESULTS.filter((r) => r.semester === semester)
			: Mocks.MOCK_STUDENT_RESULTS;
		return { success: true, data: filtered };
	}

	if (endpoint.match(/^\/student\/examination\/grades(\?.*)?$/) && _isGet(options)) {
		const semester = new URL(endpoint, "http://localhost").searchParams.get("semester");
		const filtered = semester
			? Mocks.MOCK_STUDENT_GRADE_HISTORY.filter((g) => g.semester === semester)
			: Mocks.MOCK_STUDENT_GRADE_HISTORY;
		return { success: true, data: filtered };
	}

	if (endpoint.match(/^\/student\/examination\/revaluations$/) && _isGet(options)) {
		return { success: true, data: Mocks._revaluationRequests };
	}

	if (endpoint.match(/^\/student\/examination\/revaluations$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const newRequest = {
			id: `RV${Date.now()}`,
			subjectCode: body.code || body.subjectCode,
			subjectName: body.subject || body.subjectName,
			semester: body.semester ?? null,
			reason: body.reason,
			priority: body.priority,
			status: "Pending",
			submittedAt: new Date().toISOString(),
		};
		Mocks._revaluationRequests.unshift(newRequest);
		return { success: true, data: newRequest };
	}

	if (
		endpoint.match(/^\/student\/examination\/revaluations\/[\w-]+$/) &&
		options.method === "PATCH"
	) {
		const id = endpoint.split("/").pop();
		const body = JSON.parse(options.body);
		const request = Mocks._revaluationRequests.find((r) => r.id === id);
		if (request) {
			Object.assign(request, body, { updatedAt: new Date().toISOString() });
			return { success: true, data: request };
		}
		return { success: false, error: "Revaluation request not found" };
	}

	if (
		endpoint.match(/^\/student\/examination\/revaluations\/[\w-]+$/) &&
		options.method === "DELETE"
	) {
		const id = endpoint.split("/").pop();
		const index = Mocks._revaluationRequests.findIndex((r) => r.id === id);
		if (index !== -1) {
			Mocks._revaluationRequests.splice(index, 1);
			return { success: true, message: "Revaluation request cancelled" };
		}
		return { success: false, error: "Revaluation request not found" };
	}

	return null;
}

//handles student profile-related endpoints, including fetching profile and portfolio data, updating profile information, and uploading documents to the portfolio.
function _handleStudentResearch(endpoint, options) {
	if (endpoint.match(/^\/student\/research\/dashboard$/) && _isGet(options)) {
		return {
			success: true,
			data: {
				availableProjects: Mocks._studentResearchAvailableProjects,
				myProjects: Mocks._studentResearchMyProjects,
				availablePublications: Mocks._studentResearchAvailablePublications,
				myPublications: Mocks._studentResearchMyPublications,
				myApplications: Mocks._studentResearchMyApplications,
				allUsers: Mocks.MOCK_STUDENT_RESEARCH_ALL_USERS,
			},
		};
	}

	if (endpoint.match(/^\/student\/research\/apply\/.+$/) && options.method === "POST") {
		const itemId = endpoint.split("/").pop();
		const body = JSON.parse(options.body);
		const alreadyApplied = Mocks._studentResearchMyApplications.some(
			(a) => a.projectId === itemId,
		);
		if (alreadyApplied) {
			return { success: false, error: "You have already applied to this item." };
		}
		const targetItem =
			Mocks._studentResearchAvailableProjects.find((p) => p.id === itemId) ||
			Mocks._studentResearchAvailablePublications.find((p) => p.id === itemId);
		const newApplication = {
			id: `app-${Date.now()}`,
			projectId: itemId,
			projectTitle: targetItem?.title ?? "Research Item",
			status: "pending",
			appliedAt: new Date().toISOString(),
			isSentApplication: true,
			role: body.roleId ?? null,
			coverNote: body.justification ?? null,
			itemType: body.itemType ?? "Project",
		};
		Mocks._studentResearchMyApplications.unshift(newApplication);
		return { success: true, data: newApplication };
	}

	if (endpoint.match(/^\/student\/research\/star\/.+$/) && options.method === "POST") {
		const itemId = endpoint.split("/").pop();
		const toggle = (list) =>
			list.map((item) => {
				if (item.id !== itemId) return item;
				const isNowStarred = !item.isStarred;
				return {
					...item,
					isStarred: isNowStarred,
					starsCount: isNowStarred
						? (item.starsCount || 0) + 1
						: Math.max(0, (item.starsCount || 0) - 1),
				};
			});
		Mocks._studentResearchAvailableProjects = toggle(Mocks._studentResearchAvailableProjects);
		Mocks._studentResearchMyProjects = toggle(Mocks._studentResearchMyProjects);
		Mocks._studentResearchAvailablePublications = toggle(Mocks._studentResearchAvailablePublications);
		Mocks._studentResearchMyPublications = toggle(Mocks._studentResearchMyPublications);
		return { success: true, message: "Star toggled." };
	}

	return null;
}

//handles student profile-related endpoints, including fetching profile and portfolio data, updating profile information, and uploading documents to the portfolio.
function _handleStudentProfile(endpoint, options) {
	if (endpoint.match(/^\/student\/profile$/) && _isGet(options)) {
		return {
			success: true,
			data: {
				studentData: Mocks._studentProfileData,
				portfolioData: Mocks._studentPortfolioData,
			},
		};
	}

	if (endpoint.match(/^\/student\/profile$/) && options.method === "PUT") {
		const updates = JSON.parse(options.body);
		Mocks._studentProfileData = { ...Mocks._studentProfileData, ...updates };
		return { success: true, data: Mocks._studentProfileData };
	}

	if (endpoint.match(/^\/student\/profile\/portfolio$/) && options.method === "PUT") {
		const updates = JSON.parse(options.body);
		Mocks._studentPortfolioData = { ...Mocks._studentPortfolioData, ...updates };
		return { success: true, data: Mocks._studentPortfolioData };
	}

	if (endpoint.match(/^\/student\/profile\/documents$/) && options.method === "POST") {
		const newDoc = {
			id: `doc-${Date.now()}`,
			docType: "Uploaded Document",
			fileName: "document.pdf",
			uploadedAt: new Date().toISOString(),
			url: "#",
		};
		Mocks._studentPortfolioData.documents.unshift(newDoc);
		return { success: true, data: newDoc };
	}

	return null;
}

//handles student course-related endpoints, including fetching course overview, registering for courses, cancelling registration, swapping courses, and providing feedback.
function _handleStudentCourses(endpoint, options) {
	if (endpoint.match(/^\/student\/courses\/overview$/) && _isGet(options)) {
		return {
			success: true,
			data: {
				registrationConfig: Mocks.MOCK_STUDENT_COURSES_REGISTRATION_CONFIG,
				registrationCourses: Mocks.MOCK_STUDENT_COURSES_REGISTRATION_COURSES,
				myRegistrations: Mocks._studentCoursesMyRegistrations,
			},
		};
	}

	if (endpoint.match(/^\/student\/courses\/register$/) && options.method === "POST") {
		const { courses } = JSON.parse(options.body);
		const newRegs = courses.map((c) => ({
			id: `REG${Date.now()}-${c.id}`,
			courseId: c.id,
			title: c.title,
			courseCode: c.courseCode,
			instructor: c.instructor,
			credits: c.credits,
			isElective: !!c.isElective,
			isCompulsory: !!c.isCompulsory,
			priority: c.priority ?? null,
			status: "Pending",
			appliedAt: new Date().toISOString(),
			adminRemarks: null,
		}));
		Mocks._studentCoursesMyRegistrations = [
			...newRegs,
			...Mocks._studentCoursesMyRegistrations,
		].sort((a, b) => {
			if (a.isCompulsory && !b.isCompulsory) return -1;
			if (!a.isCompulsory && b.isCompulsory) return 1;
			if (a.priority != null && b.priority != null) return a.priority - b.priority;
			return 0;
		});
		return { success: true, data: Mocks._studentCoursesMyRegistrations };
	}

	if (
		endpoint.match(/^\/student\/courses\/register\/[\w-]+$/) &&
		options.method === "DELETE"
	) {
		const regId = endpoint.split("/").pop();
		Mocks._studentCoursesMyRegistrations = Mocks._studentCoursesMyRegistrations.filter(
			(r) => r.id !== regId,
		);
		return { success: true, message: "Registration cancelled." };
	}

	if (
		endpoint.match(/^\/student\/courses\/register\/[\w-]+\/swap$/) &&
		options.method === "PATCH"
	) {
		const regId = endpoint.split("/")[4];
		const { newCourseId } = JSON.parse(options.body);
		const newCourse = Mocks.MOCK_STUDENT_COURSES_REGISTRATION_COURSES.find(
			(c) => c.id.toString() === newCourseId.toString(),
		);
		if (!newCourse) return { success: false, error: "Course not found." };
		Mocks._studentCoursesMyRegistrations = Mocks._studentCoursesMyRegistrations.map((r) =>
			r.id === regId
				? {
						...r,
						courseId: newCourse.id,
						title: newCourse.title,
						courseCode: newCourse.courseCode,
						instructor: newCourse.instructor,
						credits: newCourse.credits,
						status: "Pending",
						appliedAt: new Date().toISOString(),
				  }
				: r,
		);
		return { success: true, data: Mocks._studentCoursesMyRegistrations };
	}

	if (
		endpoint.match(/^\/student\/courses\/\w+\/feedback$/) &&
		options.method === "POST"
	) {
		return { success: true, message: "Feedback recorded." };
	}

	return null;
}


// Note: Hostel related endpoints are handled here in studentHandler since they are mostly used by students, even though they start with /hostel. This is to keep all student-facing functionalities together for easier maintenance.
function _handleHostel(endpoint, options) {
	if (endpoint.match(/^\/hostel\/dashboard$/) && _isGet(options)) {
		return {
			success: true,
			data: {
				...Mocks.MOCK_HOSTEL_DATA,
				leaveRequests: Mocks._hostelLeaveRequests,
				outingRequests: Mocks._hostelOutingRequests,
				maintenanceRequests: Mocks._hostelMaintenanceRequests,
				complaints: Mocks._hostelComplaints,
			},
		};
	}

	if (endpoint.match(/^\/hostel\/leave$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const entry = { id: `LV${Date.now()}`, ...body, status: "Pending", submittedAt: new Date().toISOString() };
		Mocks._hostelLeaveRequests.unshift(entry);
		return { success: true, data: entry };
	}

	if (endpoint.match(/^\/hostel\/outing$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const entry = { id: `OT${Date.now()}`, ...body, status: "Pending", currentStep: 0, submittedAt: new Date().toISOString() };
		Mocks._hostelOutingRequests.unshift(entry);
		return { success: true, data: entry };
	}

	if (endpoint.match(/^\/hostel\/maintenance$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const entry = { id: `MT${Date.now()}`, ...body, status: "Pending", steps: [], submittedAt: new Date().toISOString() };
		Mocks._hostelMaintenanceRequests.unshift(entry);
		return { success: true, data: entry };
	}

	if (endpoint.match(/^\/hostel\/complaints$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const entry = { id: `CP${Date.now()}`, ...body, status: "Open", submittedAt: new Date().toISOString() };
		Mocks._hostelComplaints.unshift(entry);
		return { success: true, data: entry };
	}

	return null;
}

//handles mentor-related endpoints for students, such as fetching dashboard data, submitting meeting requests, and providing feedback.
function _handleMentor(endpoint, options) {
	if (endpoint.match(/^\/mentor\/dashboard$/) && _isGet(options)) {
		return {
			success: true,
			data: {
				...Mocks.MOCK_MENTOR_DATA,
				feedbackHistory: Mocks._mentorFeedbackHistory,
				meetingRequests: Mocks._mentorMeetingRequests,
			},
		};
	}

	if (endpoint.match(/^\/mentor\/meetings\/request$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const entry = { id: `MR${Date.now()}`, ...body, status: "Pending", requestedAt: new Date().toISOString() };
		Mocks._mentorMeetingRequests.unshift(entry);
		return { success: true, data: entry };
	}

	if (endpoint.match(/^\/mentor\/feedback$/) && options.method === "POST") {
		const body = JSON.parse(options.body);
		const entry = { id: `FB${Date.now()}`, date: new Date().toISOString().split("T")[0], ...body };
		Mocks._mentorFeedbackHistory.unshift(entry);
		return { success: true, data: entry };
	}

	return null;
}

function _handleStudentFinance(endpoint, options) {
	const method = options?.method || "GET";

	if (endpoint === "/finance/overview" && method === "GET") {
		return {
			success: true,
			data: {
				fees: Mocks._financeFees,
				paymentHistory: Mocks._financeHistory,
				receipts: Mocks._financeReceipts,
				dueReminders: Mocks._financeDueReminders,
			},
		};
	}
	if (endpoint === "/finance/fees" && method === "GET")
		return { success: true, data: Mocks._financeFees };
	if (endpoint === "/finance/history" && method === "GET")
		return { success: true, data: Mocks._financeHistory };
	if (endpoint === "/finance/receipts" && method === "GET")
		return { success: true, data: Mocks._financeReceipts };
	if (endpoint === "/finance/due-reminders" && method === "GET")
		return { success: true, data: Mocks._financeDueReminders };

	if (endpoint === "/finance/pay" && method === "POST") {
		const { feeId, mode, amount } = JSON.parse(options.body);
		const fee = Mocks._financeFees.find((f) => f.id === feeId);
		if (!fee) return { success: false, error: "Fee not found" };

		fee.due = 0;
		fee.status = "Paid";

		const dateStr = new Date().toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
		const txnId = `TXN${Date.now()}`;
		const refNo = `REF-${feeId}-${Date.now()}`;
		const rcptId = `RC${Date.now()}`;

		const historyEntry = {
			id: `PH${Date.now()}`,
			feeType: fee.type,
			label: fee.label,
			feeHead: fee.label.split("–")[0].trim(),
			semester: fee.semester,
			date: dateStr,
			processedOn: `${dateStr}, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
			mode,
			gateway:
				mode === "UPI"
					? "UPI Gateway"
					: mode === "Card"
					? "Card Gateway"
					: mode === "Net Banking"
					? "Net Banking"
					: "Finance Office",
			amount,
			status: "Paid",
			txnId,
			refNo,
			receiptId: rcptId,
			charges: fee.breakdown?.filter((b) => b.type !== "deduction") ?? [],
		};
		Mocks._financeHistory.unshift(historyEntry);

		const receipt = {
			id: rcptId,
			receiptNo: `RCPT-${new Date().getFullYear()}-${rcptId.slice(-6)}`,
			label: fee.label,
			date: dateStr,
			semester: fee.semester,
			academicYear: `${new Date().getFullYear() - 1}–${new Date().getFullYear()}`,
			mode,
			txnId,
			refNo,
			amount,
			category: fee.type.charAt(0).toUpperCase() + fee.type.slice(1),
			collectedBy: "Finance Office",
			status: "Paid",
			tax: 0,
			note: null,
			breakdown: fee.breakdown?.filter((b) => b.type !== "deduction") ?? [],
		};
		Mocks._financeReceipts.unshift(receipt);
		Mocks._financeDueReminders = Mocks._financeDueReminders.filter((r) => r.feeId !== feeId);

		return { success: true, data: { historyEntry, receipt } };
	}

	const downloadMatch = endpoint.match(/^\/finance\/receipts\/([\w-]+)\/download$/);
	if (downloadMatch && method === "GET") {
		const id = downloadMatch[1];
		const receipt = Mocks._financeReceipts.find((r) => r.id === id);
		return receipt
			? { success: true, data: { url: `https://example.com/receipts/${id}.pdf`, receipt } }
			: { success: false, error: "Receipt not found" };
	}

	return null;
}

function _handleRegistrar(endpoint, options) {
	const method = options?.method || "GET";

	if (endpoint === "/registrar/overview" && method === "GET") {
		return {
			success: true,
			data: {
				adminSubmittedDocs: Mocks._registrarAdminDocs,
				documentRequests: Mocks._registrarDocRequests,
			},
		};
	}
	if (endpoint === "/registrar/checklist" && method === "GET") {
		return { success: true, data: Mocks._registrarAdminDocs };
	}
	if (endpoint === "/registrar/requests" && method === "GET") {
		return { success: true, data: Mocks._registrarDocRequests };
	}
	if (endpoint === "/registrar/requests" && method === "POST") {
		const body = JSON.parse(options.body);
		const newRequest = {
			id: `DR${Date.now()}`,
			...body,
			status: "Processing",
			requestedAt: new Date().toISOString(),
			remarks: null,
		};
		Mocks._registrarDocRequests.unshift(newRequest);

		// If it's a LoR request, also route it to the professor's LoR inbox
		if (body.type === "Letter of Recommendation" && body.teacherId) {
			// Pull logged-in student info from localStorage (set at login)
			const studentName = localStorage.getItem("userName") || "Unknown Student";
			const studentRollNo = localStorage.getItem("userRollNo") || localStorage.getItem("userId") || "N/A";
			const lorEntry = {
				id: `LOR${Date.now()}`,
				studentId: localStorage.getItem("userId") || "current-student",
				studentName,
				studentRollNo,
				purpose: body.purpose,
				urgency: body.urgency || "Normal (5–7 working days)",
				deadline: body.deadline || null,
				supportingDocFileName: body.supportingDocFileName || null,
				status: "Pending",
				requestedAt: new Date().toISOString(),
				professorRemarks: null,
				lorFileUrl: null,
			};
			Mocks._lorRequests.unshift(lorEntry);
		}

		return { success: true, data: newRequest };
	}

	const singleMatch = endpoint.match(/^\/registrar\/requests\/([\w-]+)$/);
	if (singleMatch) {
		const id = singleMatch[1];
		const req = Mocks._registrarDocRequests.find((r) => r.id === id);
		if (method === "GET") {
			return req
				? { success: true, data: req }
				: { success: false, error: "Request not found" };
		}
		if (method === "PATCH") {
			const body = JSON.parse(options.body);
			if (req) {
				Object.assign(req, body, { updatedAt: new Date().toISOString() });
				return { success: true, data: req };
			}
			return { success: false, error: "Request not found" };
		}
		if (method === "DELETE") {
			const index = Mocks._registrarDocRequests.findIndex((r) => r.id === id);
			if (index !== -1) {
				Mocks._registrarDocRequests.splice(index, 1);
				return { success: true, message: "Request cancelled" };
			}
			return { success: false, error: "Request not found" };
		}
	}

	return null;
}

// ── LoR handler (professor-side) ──────────────────────────────────────────────
function _handleLor(endpoint, options = {}) {
	const method = options.method || "GET";

	// GET /lor/requests — fetch all LoR requests for this professor
	if (endpoint === "/lor/requests" && method === "GET") {
		return { success: true, data: Mocks._lorRequests };
	}

	// PATCH /lor/requests/:id — approve / reject / upload LoR
	const lorMatch = endpoint.match(/^\/lor\/requests\/([\w-]+)$/);
	if (lorMatch) {
		const id = lorMatch[1];
		const req = Mocks._lorRequests.find((r) => r.id === id);
		if (!req) return { success: false, error: "LoR request not found" };

		if (method === "PATCH") {
			const body = JSON.parse(options.body || "{}");
			Object.assign(req, body, { updatedAt: new Date().toISOString() });
			return { success: true, data: req };
		}
	}

	return null;
}