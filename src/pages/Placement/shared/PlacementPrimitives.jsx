// src/pages/Placement/shared/PlacementPrimitives.jsx

import React from "react";
import { Send, Clock, XCircle, CheckCircle } from "lucide-react";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
	Applied:     { cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",     icon: Send        },
	Shortlisted: { cls: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800", icon: Clock   },
	Rejected:    { cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",           icon: XCircle     },
	Selected:    { cls: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800", icon: CheckCircle },
};

export const StatusBadge = ({ status }) => {
	const cfg  = STATUS_STYLES[status] ?? STATUS_STYLES.Applied;
	const Icon = cfg.icon;
	return (
		<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.cls}`}>
			<Icon className="size-3" />{status}
		</span>
	);
};

// ── Job / app type badge ──────────────────────────────────────────────────────

export const TypeBadge = ({ type, size = "sm" }) => (
	<span className={`px-2${size === "lg" ? ".5" : ""} py-0.5 rounded-${size === "lg" ? "lg" : "md"} text-[10px] font-bold border ${
		type === "Internship"
			? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
			: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
	}`}>{type}</span>
);

// ── Form field wrapper ────────────────────────────────────────────────────────

export const Field = ({ label, required, error, children }) => (
	<div>
		<label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
			{label}{required && <span className="text-red-500 ml-1">*</span>}
		</label>
		{children}
		{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
	</div>
);

export const inputCls = (err) =>
	`w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:border-emerald-500 transition-colors ${err ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`;

// ── Section title (for apply form) ───────────────────────────────────────────

export const SectionTitle = ({ icon: Icon, label }) => (
	<div className="flex items-center gap-2 pt-2">
		<Icon className="size-4 text-emerald-500" />
		<h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{label}</h3>
	</div>
);

// ── Info grid tile (reused in detail pages) ───────────────────────────────────

export const InfoTile = ({ label, children }) => (
	<div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
		<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
		<div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{children}</div>
	</div>
);

// ── Detail page back button + title row ───────────────────────────────────────

export const DetailPageHeader = ({ title, onBack }) => (
	<div className="flex items-center gap-3 mb-6">
		<button
			onClick={onBack}
			className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
		>
			{/* ArrowLeft inline so this file stays self-contained */}
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
		</button>
		<h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
	</div>
);

// ── Empty state ───────────────────────────────────────────────────────────────

export const EmptyState = ({ icon: Icon, message, action }) => (
	<div className="text-center py-20">
		<Icon className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
		<p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
		{action}
	</div>
);