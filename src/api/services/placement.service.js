import { apiCall  } from "../client";
import { USE_MOCK_API,FINAL_API_BASE_URL } from "../config";
import { MOCK_PLACEMENT_JOBS, _placementApplications as _placementApplicationsInit, _placementHistory, _placementResumeUrl as _placementResumeUrlInit, _placementProjectUrl as _placementProjectUrlInit } from "../mock";

// Mutable local copies — ES modules don't allow reassigning named imports
let _placementApplications = [..._placementApplicationsInit];
let _placementResumeUrl = _placementResumeUrlInit;
let _placementProjectUrl = _placementProjectUrlInit;

export const placementService = {
    // ── Job Listings ───────────────────────────────────────────────────────

    /** Returns all active job listings. */
    getJobs: () => {
        if (USE_MOCK_API) {
            return Promise.resolve({ success: true, data: MOCK_PLACEMENT_JOBS });
        }
        return apiCall("/placement/jobs");
    },

    /** Returns a single job listing by ID. */
    getJobById: (jobId) => {
        if (USE_MOCK_API) {
            const job = MOCK_PLACEMENT_JOBS.find((j) => j.id === jobId);
            return job
                ? Promise.resolve({ success: true, data: job })
                : Promise.resolve({ success: false, error: "Job not found" });
        }
        return apiCall(`/placement/jobs/${jobId}`);
    },

    // ── Applications ───────────────────────────────────────────────────────

    /** Returns all applications submitted by the current user. */
    getApplications: () => {
        if (USE_MOCK_API) {
            return Promise.resolve({ success: true, data: _placementApplications });
        }
        return apiCall("/placement/applications");
    },

    /** Submits a new application for a job. */
    applyToJob: (jobId, formData) => {
        if (USE_MOCK_API) {
            const alreadyApplied = _placementApplications.some((a) => a.jobId === jobId);
            if (alreadyApplied) {
                return Promise.resolve({ success: false, error: "Already applied to this job." });
            }
            const job = MOCK_PLACEMENT_JOBS.find((j) => j.id === jobId);
            if (!job) {
                return Promise.resolve({ success: false, error: "Job not found." });
            }
            const newApplication = {
                id: `APP${Date.now()}`,
                jobId,
                role: job.role,
                company: job.company,
                type: job.type,
                status: "Applied",
                appliedAt: new Date().toISOString(),
                location: job.location,
                package: job.package,
                rounds: job.rounds,
                description: job.description,
                interviewDate: null,
                interviewTime: null,
                interviewMode: null,
                onlineLink: null,
                venue: null,
                guidelines: [],
                documentsRequired: [],
                notes: formData?.notes ?? null,
            };
            _placementApplications.unshift(newApplication);
            return Promise.resolve({ success: true, data: newApplication });
        }
        return apiCall("/placement/applications", {
            method: "POST",
            body: JSON.stringify({ jobId, ...formData }),
        });
    },

    /** Returns a single application by ID. */
    getApplicationById: (applicationId) => {
        if (USE_MOCK_API) {
            const app = _placementApplications.find((a) => a.id === applicationId);
            return app
                ? Promise.resolve({ success: true, data: app })
                : Promise.resolve({ success: false, error: "Application not found" });
        }
        return apiCall(`/placement/applications/${applicationId}`);
    },

    /** Submits the full apply-form for a job (from PlacementApplyUI). */
    submitApplication: (jobId, formPayload) => {
        if (USE_MOCK_API) {
            const job = MOCK_PLACEMENT_JOBS.find((j) => j.id === jobId);
            const existing = _placementApplications.find((a) => a.jobId === jobId);
            if (existing) {
                return Promise.resolve({ success: false, error: "Already applied to this job." });
            }
            const newApplication = {
                id: `APP${Date.now()}`,
                jobId,
                role: job?.role ?? "Position",
                company: job?.company ?? "Company",
                type: job?.type ?? "Full Time",
                status: "Applied",
                appliedAt: new Date().toISOString(),
                location: job?.location ?? null,
                package: job?.package ?? null,
                rounds: job?.rounds ?? null,
                description: job?.description ?? null,
                interviewDate: null,
                interviewTime: null,
                interviewMode: null,
                onlineLink: null,
                venue: null,
                guidelines: [],
                documentsRequired: [],
                notes: null,
                formPayload,
            };
            _placementApplications.unshift(newApplication);
            return Promise.resolve({ success: true, data: newApplication });
        }
        return apiCall("/placement/apply", {
            method: "POST",
            body: JSON.stringify({ jobId, ...formPayload }),
        });
    },

    // ── Resume & Projects ──────────────────────────────────────────────────

    /** Returns the current user's uploaded resume and project portfolio URLs. */
    getDocuments: () => {
        if (USE_MOCK_API) {
            return Promise.resolve({
                success: true,
                data: {
                    resumeUrl: _placementResumeUrl,
                    projectUrl: _placementProjectUrl,
                },
            });
        }
        return apiCall("/placement/documents");
    },

    /** Uploads (or replaces) the user's resume. Accepts a File object. */
    // In placementAPI, replace the mock branches of uploadResume / uploadProject:

uploadResume: (file) => {
    if (USE_MOCK_API) {
        _placementResumeUrl = URL.createObjectURL(file);
        return Promise.resolve({ success: true, data: { resumeUrl: _placementResumeUrl } });
    }
    const fd = new FormData();
    fd.append("resume", file);
    return fetch(`${FINAL_API_BASE_URL}/placement/documents/resume`, {
        method: "POST", credentials: "include", body: fd,
    }).then((r) => r.json());
},

uploadProjectPortfolio: (file) => {
    if (USE_MOCK_API) {
        _placementProjectUrl = URL.createObjectURL(file);
        return Promise.resolve({ success: true, data: { projectUrl: _placementProjectUrl } });
    }
    const fd = new FormData();
    fd.append("portfolio", file);
    return fetch(`${FINAL_API_BASE_URL}/placement/documents/portfolio`, {
        method: "POST", credentials: "include", body: fd,
    }).then((r) => r.json());
},

    // ── Placement History ──────────────────────────────────────────────────

    /** Returns the user's self-reported placement history. */
    getHistory: () => {
        if (USE_MOCK_API) {
            return Promise.resolve({ success: true, data: _placementHistory });
        }
        return apiCall("/placement/history");
    },

    /** Adds a new entry to the user's placement history. */
    addHistoryEntry: (entry) => {
        if (USE_MOCK_API) {
            const newEntry = {
                id: `HIST${Date.now()}`,
                ...entry,
            };
            _placementHistory.unshift(newEntry);
            return Promise.resolve({ success: true, data: newEntry });
        }
        return apiCall("/placement/history", {
            method: "POST",
            body: JSON.stringify(entry),
        });
    },

    /** Deletes a history entry by ID. */
    deleteHistoryEntry: (historyId) => {
        if (USE_MOCK_API) {
            const index = _placementHistory.findIndex((h) => h.id === historyId);
            if (index !== -1) _placementHistory.splice(index, 1);
            return Promise.resolve({ success: true, message: "Entry deleted." });
        }
        return apiCall(`/placement/history/${historyId}`, { method: "DELETE" });
    },

    // ── Dashboard aggregate ────────────────────────────────────────────────

    /**
     * Single call to hydrate the entire PlacementUI in one round-trip.
     * Returns jobs, applications, history, resumeUrl, and projectUrl together.
     */
    getPlacementOverview: () => {
        if (USE_MOCK_API) {
            return Promise.resolve({
                success: true,
                data: {
                    jobs: MOCK_PLACEMENT_JOBS,
                    applications: _placementApplications,
                    history: _placementHistory,
                    resumeUrl: _placementResumeUrl,
                    projectUrl: _placementProjectUrl,
                },
            });
        }
        return apiCall("/placement/overview");
    },
};