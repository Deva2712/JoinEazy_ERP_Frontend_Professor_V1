// src/pages/Placement/PlacementController.jsx
//
// Owns ALL data-fetching, state, and side-effects for the Placement feature.
// Renders <PlacementUI> with clean props — zero UI logic here.

import React, { useState, useEffect } from "react";
import PlacementUI from "./PlacementUI";
// import { placementAPI } from "../../services/api";
import { placementService } from "@/api/services/placement.service";

export default function PlacementController() {
	const [loading,          setLoading]          = useState(true);
	const [error,            setError]            = useState(null);
	const [jobs,             setJobs]             = useState([]);
	const [applications,     setApplications]     = useState([]);
	const [placementHistory, setPlacementHistory] = useState([]);
	const [resumeUrl,        setResumeUrl]        = useState(null);
	const [projectUrl,       setProjectUrl]       = useState(null);

	// ── Fetch ─────────────────────────────────────────────────────────────────

	const fetchData = async () => {
    try {
        setLoading(true);
        setError(null);
        const res = await placementService.getPlacementOverview();
        if (!res.success) throw new Error(res.error);
        const { jobs, applications, history, resumeUrl, projectUrl } = res.data;
        setJobs(jobs);
        setApplications(applications);
        setPlacementHistory(history);
        setResumeUrl(resumeUrl);
        setProjectUrl(projectUrl);
    } catch (err) {
        setError("Failed to load placement data. Please try again.");
    } finally {
        setLoading(false);
    }
};

	useEffect(() => {
		fetchData();
		document.title = "Placement Cell – Joineazy";
	}, []);

	// ── Handlers ──────────────────────────────────────────────────────────────

	/** Optimistically adds an application entry (controller mirrors what the apply page does) */
	const handleApply = (job) => {
    // navigation happens in PlacementUI; actual submission is in PlacementApplyUI
    // nothing needed here unless you want an optimistic update
};
	const handleUploadResume = async (file) => {
    const res = await placementService.uploadResume(file);
    if (res.success) setResumeUrl(res.data.resumeUrl);
};


	const handleUploadProject = async (file) => {
    const res = await placementService.uploadProjectPortfolio(file);
    if (res.success) setProjectUrl(res.data.projectUrl);
};

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<PlacementUI
			loading={loading}
			error={error}
			onRetry={fetchData}
			jobs={jobs}
			applications={applications}
			placementHistory={placementHistory}
			resumeUrl={resumeUrl}
			projectUrl={projectUrl}
			onApply={handleApply}
			onUploadResume={handleUploadResume}
			onUploadProject={handleUploadProject}
		/>
	);
}