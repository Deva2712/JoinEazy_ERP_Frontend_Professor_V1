// src/api/handlers/revaluationHandler.js
//
// Handles all /student/revaluation/* and /professor/revaluation/* endpoints.
// Drop this file into src/api/handlers/ and register it in client.js:
//
//   import { handleRevaluation } from "./handlers/revaluationHandler";
//   // Add to MOCK_HANDLERS array (before the catch-all):
//   handleRevaluation,   // /student/revaluation/*, /professor/revaluation/*
//

const _isGet    = (o) => !o.method || o.method === "GET";
const _isPost   = (o) => o.method === "POST";
const _isDelete = (o) => o.method === "DELETE";

// ── Shared mutable mock store ─────────────────────────────────────────────────
// In a real app these would live in a database; here they live in module-level
// arrays so changes persist for the lifetime of the browser session.

const _revaluationRequests = [
    {
        id: "rev-001",
        studentId: "STU-2021-001",
        studentName: "Arjun Sharma",
        enrollmentNo: "2021CS001",
        subjectCode: "CS301",
        subjectName: "Data Structures & Algorithms",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 38,
        maxMarks: 50,
        originalGrade: "B",
        priority: "High",
        reason: "I believe my answer for Q4(b) was marked incorrectly. The approach used is an alternate valid solution.",
        status: "Pending",
        submittedAt: "2026-05-10T09:00:00Z",
        revisedMarks: null,
        revisedGrade: null,
        professorRemarks: null,
        updatedAt: "2026-05-10T09:00:00Z",
    },
    {
        id: "rev-002",
        studentId: "STU-2021-002",
        studentName: "Priya Nair",
        enrollmentNo: "2021CS002",
        subjectCode: "CS302",
        subjectName: "Database Management Systems",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 41,
        maxMarks: 50,
        originalGrade: "B+",
        priority: "Mid",
        reason: "My ER diagram in Q2 was marked 0 but it correctly represents the given schema.",
        status: "UnderReview",
        submittedAt: "2026-05-09T11:30:00Z",
        revisedMarks: null,
        revisedGrade: null,
        professorRemarks: null,
        updatedAt: "2026-05-11T14:00:00Z",
    },
    {
        id: "rev-003",
        studentId: "STU-2021-003",
        studentName: "Rahul Verma",
        enrollmentNo: "2021CS003",
        subjectCode: "CS301",
        subjectName: "Data Structures & Algorithms",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 35,
        maxMarks: 50,
        originalGrade: "C",
        priority: "High",
        reason: "The dynamic programming solution in Q5 is correct but received no marks.",
        status: "Approved",
        submittedAt: "2026-05-01T08:45:00Z",
        revisedMarks: 43,
        revisedGrade: "A",
        professorRemarks: "Upon re-evaluation, alternate DP approach is accepted. Revised marks awarded.",
        updatedAt: "2026-05-12T10:00:00Z",
    },
    {
        id: "rev-004",
        studentId: "STU-2021-004",
        studentName: "Sneha Patel",
        enrollmentNo: "2021CS004",
        subjectCode: "CS303",
        subjectName: "Operating Systems",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 44,
        maxMarks: 50,
        originalGrade: "A",
        priority: "Low",
        reason: "Believe partial marking was not applied in Q3.",
        status: "Rejected",
        submittedAt: "2026-05-03T14:00:00Z",
        revisedMarks: null,
        revisedGrade: null,
        professorRemarks: "The answer does not meet the minimum criteria for partial marks.",
        updatedAt: "2026-05-07T16:00:00Z",
    },
];

// Subjects eligible for revaluation for the logged-in student
const _eligibleSubjects = [
    {
        subjectCode: "CS301",
        subjectName: "Data Structures & Algorithms",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 38,
        maxMarks: 50,
        grade: "B",
    },
    {
        subjectCode: "CS302",
        subjectName: "Database Management Systems",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 41,
        maxMarks: 50,
        grade: "B+",
    },
    {
        subjectCode: "CS303",
        subjectName: "Operating Systems",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 44,
        maxMarks: 50,
        grade: "A",
    },
    {
        subjectCode: "CS304",
        subjectName: "Computer Networks",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 36,
        maxMarks: 50,
        grade: "B",
    },
];

// The currently logged-in student's own requests (subset of _revaluationRequests)
const _studentOwnRequests = [
    {
        id: "rev-student-001",
        subjectCode: "CS301",
        subjectName: "Data Structures & Algorithms",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 38,
        maxMarks: 50,
        originalGrade: "B",
        priority: "High",
        reason: "I believe my answer for Q4(b) was marked incorrectly.",
        status: "Pending",
        submittedAt: "2026-05-10T09:00:00Z",
        revisedMarks: null,
        revisedGrade: null,
        professorRemarks: null,
        updatedAt: "2026-05-10T09:00:00Z",
    },
    {
        id: "rev-student-002",
        subjectCode: "CS302",
        subjectName: "Database Management Systems",
        semester: "Semester 5",
        examType: "End Term",
        originalMarks: 41,
        maxMarks: 50,
        originalGrade: "B+",
        priority: "Mid",
        reason: "ER diagram in Q2 was marked 0 but it is correct.",
        status: "Approved",
        submittedAt: "2026-05-05T10:00:00Z",
        revisedMarks: 46,
        revisedGrade: "A+",
        professorRemarks: "ER diagram re-evaluated. Additional marks awarded.",
        updatedAt: "2026-05-12T10:00:00Z",
    },
];

// ── Main handler ──────────────────────────────────────────────────────────────
export const handleRevaluation = (endpoint, options = {}) => {
    const role =
        typeof localStorage !== "undefined"
            ? localStorage.getItem("userRole") || "student"
            : "student";

    // ── STUDENT routes (/student/revaluation/*) ───────────────────────────────
    if (endpoint.startsWith("/student/revaluation/")) {
        // GET /student/revaluation/overview
        if (endpoint === "/student/revaluation/overview" && _isGet(options)) {
            return {
                success: true,
                data: {
                    eligibleSubjects: _eligibleSubjects,
                    requests: _studentOwnRequests,
                    stats: {
                        totalRequests: _studentOwnRequests.length,
                        pending:       _studentOwnRequests.filter((r) => r.status === "Pending").length,
                        underReview:   _studentOwnRequests.filter((r) => r.status === "UnderReview").length,
                        approved:      _studentOwnRequests.filter((r) => r.status === "Approved").length,
                        rejected:      _studentOwnRequests.filter((r) => r.status === "Rejected").length,
                    },
                },
            };
        }

        // GET /student/revaluation/subjects
        if (endpoint === "/student/revaluation/subjects" && _isGet(options)) {
            return { success: true, data: _eligibleSubjects };
        }

        // GET /student/revaluation/requests
        if (endpoint === "/student/revaluation/requests" && _isGet(options)) {
            return { success: true, data: _studentOwnRequests };
        }

        // POST /student/revaluation/requests
        if (endpoint === "/student/revaluation/requests" && _isPost(options)) {
            const body = JSON.parse(options.body || "{}");
            const newRequest = {
                id: `rev-student-${Date.now()}`,
                ...body,
                status: "Pending",
                revisedMarks: null,
                revisedGrade: null,
                professorRemarks: null,
                submittedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            _studentOwnRequests.unshift(newRequest);
            // Also add to professor-visible list
            _revaluationRequests.unshift({
                ...newRequest,
                studentId: "STU-CURRENT",
                studentName: "Current Student",
                enrollmentNo: "2021CS000",
            });
            return { success: true, data: newRequest };
        }

        // DELETE /student/revaluation/requests/:id
        const deleteMatch = endpoint.match(/^\/student\/revaluation\/requests\/([\w-]+)$/);
        if (deleteMatch && _isDelete(options)) {
            const id = deleteMatch[1];
            const idx = _studentOwnRequests.findIndex((r) => r.id === id);
            if (idx !== -1 && _studentOwnRequests[idx].status === "Pending") {
                _studentOwnRequests.splice(idx, 1);
                return { success: true, data: { message: "Request cancelled." } };
            }
            return { success: false, error: "Request not found or cannot be cancelled." };
        }
    }

    // ── PROFESSOR routes (/professor/revaluation/*) ───────────────────────────
    if (endpoint.startsWith("/professor/revaluation/")) {
        // GET /professor/revaluation/overview
        if (endpoint === "/professor/revaluation/overview" && _isGet(options)) {
            const pending    = _revaluationRequests.filter((r) => r.status === "Pending");
            const underReview = _revaluationRequests.filter((r) => r.status === "UnderReview");
            const resolved   = _revaluationRequests.filter((r) =>
                r.status === "Approved" || r.status === "Rejected"
            );
            return {
                success: true,
                data: {
                    pendingRequests:  [...pending, ...underReview],
                    resolvedRequests: resolved,
                    stats: {
                        total:       _revaluationRequests.length,
                        pending:     pending.length,
                        underReview: underReview.length,
                        approved:    resolved.filter((r) => r.status === "Approved").length,
                        rejected:    resolved.filter((r) => r.status === "Rejected").length,
                    },
                    myCourses: [
                        { code: "CS301", name: "Data Structures & Algorithms" },
                        { code: "CS302", name: "Database Management Systems" },
                        { code: "CS303", name: "Operating Systems" },
                    ],
                },
            };
        }

        // GET /professor/revaluation/requests (with optional ?status=&subject= filters)
        if (endpoint.match(/^\/professor\/revaluation\/requests(\?.*)?$/) && _isGet(options)) {
            const url   = new URL(`http://x${endpoint}`);
            const status  = url.searchParams.get("status");
            const subject = url.searchParams.get("subject");

            let results = [..._revaluationRequests];
            if (status === "Pending")   results = results.filter((r) => r.status === "Pending" || r.status === "UnderReview");
            if (status === "resolved")  results = results.filter((r) => r.status === "Approved" || r.status === "Rejected");
            if (subject)                results = results.filter((r) => r.subjectCode === subject);

            return { success: true, data: results };
        }

        // POST /professor/revaluation/requests/:id/accept
        const acceptMatch = endpoint.match(/^\/professor\/revaluation\/requests\/([\w-]+)\/accept$/);
        if (acceptMatch && _isPost(options)) {
            const id  = acceptMatch[1];
            const req = _revaluationRequests.find((r) => r.id === id);
            if (!req) return { success: false, error: "Request not found." };
            req.status    = "UnderReview";
            req.updatedAt = new Date().toISOString();
            return { success: true, data: req };
        }

        // POST /professor/revaluation/requests/:id/result
        const resultMatch = endpoint.match(/^\/professor\/revaluation\/requests\/([\w-]+)\/result$/);
        if (resultMatch && _isPost(options)) {
            const id   = resultMatch[1];
            const body = JSON.parse(options.body || "{}");
            const req  = _revaluationRequests.find((r) => r.id === id);
            if (!req) return { success: false, error: "Request not found." };
            req.status           = "Approved";
            req.revisedMarks     = body.revisedMarks;
            req.revisedGrade     = body.revisedGrade;
            req.professorRemarks = body.remarks;
            req.updatedAt        = new Date().toISOString();
            return { success: true, data: req };
        }

        // POST /professor/revaluation/requests/:id/reject
        const rejectMatch = endpoint.match(/^\/professor\/revaluation\/requests\/([\w-]+)\/reject$/);
        if (rejectMatch && _isPost(options)) {
            const id   = rejectMatch[1];
            const body = JSON.parse(options.body || "{}");
            const req  = _revaluationRequests.find((r) => r.id === id);
            if (!req) return { success: false, error: "Request not found." };
            req.status           = "Rejected";
            req.professorRemarks = body.reason;
            req.updatedAt        = new Date().toISOString();
            return { success: true, data: req };
        }
    }

    return null; // not handled — pass to next handler
};
