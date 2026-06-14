// src/pages/Placement/shared/placementConstants.js

import { Send, Clock, XCircle, CheckCircle } from "lucide-react";

export const STATUS_CONFIG = [
	{ status: "Applied",     icon: Send,        color: "blue"    },
	{ status: "Shortlisted", icon: Clock,       color: "yellow"  },
	{ status: "Rejected",    icon: XCircle,     color: "red"     },
	{ status: "Selected",    icon: CheckCircle, color: "emerald" },
];

export const JOB_TYPES = ["All", "Internship", "Full Time"];

export const TABS = [
	{ key: "jobs",    label: "Job Listings",      icon: "Briefcase" },
	{ key: "applied", label: "My Applications",   icon: "FileText"  },
	{ key: "resume",  label: "Resume & Projects", icon: "Upload"    },
	{ key: "history", label: "Placement History", icon: "Trophy"    },
];

/** Returns days-left count from a deadline ISO string */
export const daysLeft = (deadline) =>
	Math.ceil((new Date(deadline) - new Date()) / 86400000);

/** Formats a date string to "Mar 15, 2026" */
export const fmtDate = (iso, opts = { month: "short", day: "numeric", year: "numeric" }) =>
	new Date(iso).toLocaleDateString("en-US", opts);