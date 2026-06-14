// src/pages/Placement/tabs/ApplicationsTab.jsx

import React, { useState } from "react";
import {
	Briefcase, Building2, MapPin, Calendar, Clock, CheckCircle,
	XCircle, Send, ArrowLeft, Video, MapPinned, BookOpen,
	ClipboardList, FileText, ExternalLink, Link2, Wifi, ChevronRight,
} from "lucide-react";
import { StatusBadge, TypeBadge, EmptyState } from "../shared/PlacementPrimitives";
import { STATUS_CONFIG, fmtDate } from "../shared/placementConstants";

// ── Stat filter box ───────────────────────────────────────────────────────────

const StatBox = ({ label, count, icon: Icon, color, isActive, onClick }) => (
	<button
		onClick={onClick}
		className={`flex flex-col gap-2 p-4 rounded-2xl border-2 transition-all text-left w-full ${
			isActive
				? `border-${color}-500 dark:border-${color}-400 bg-${color}-50 dark:bg-${color}-900/20 shadow-sm`
				: "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d26] hover:border-emerald-400 dark:hover:border-emerald-600"
		}`}
	>
		<Icon className={`size-5 ${isActive ? `text-${color}-600 dark:text-${color}-400` : "text-gray-400 dark:text-gray-500"}`} />
		<p className={`text-3xl font-extrabold ${isActive ? `text-${color}-700 dark:text-${color}-300` : "text-gray-900 dark:text-white"}`}>{count}</p>
		<p className={`text-xs font-bold uppercase tracking-wider ${isActive ? `text-${color}-600 dark:text-${color}-400` : "text-gray-400 dark:text-gray-500"}`}>{label}</p>
	</button>
);

// ── Application card ──────────────────────────────────────────────────────────

const ApplicationCard = ({ app, onClick }) => {
  const hasInterview = !!app.interviewDate;
  const hasLink      = !!app.onlineLink;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Status stripe */}
      <div className={`h-1 w-full ${
        app.status === "Selected"    ? "bg-gradient-to-r from-emerald-400 to-teal-500" :
        app.status === "Shortlisted" ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
        app.status === "Rejected"    ? "bg-gradient-to-r from-red-400 to-rose-500" :
        "bg-gradient-to-r from-blue-400 to-indigo-500"
      }`} />

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Row 1: status + type badges together */}
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={app.status} />
          {app.type && <TypeBadge type={app.type} />}
        </div>

        {/* Row 2: role + company */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {app.role}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="size-3" />{app.company}
          </p>
        </div>

        {/* Row 3: meta grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Applied</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{fmtDate(app.appliedAt)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Interview</p>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {app.interviewDate ? fmtDate(app.interviewDate, { month: "short", day: "numeric" }) : "—"}
            </p>
          </div>
          {hasLink && (
            <div className="col-span-2 flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <Link2 className="size-3" />Online meeting link attached
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-emerald-500 transition-colors">
            View Details →
          </span>
          <ChevronRight className="size-3.5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>
    </div>
  );
};

// ── Application detail page ───────────────────────────────────────────────────

const ApplicationDetailPage = ({ app, onBack }) => {
	const isOnline = app.mode?.toLowerCase().includes("online") ||
		app.interviewMode?.toLowerCase().includes("online") ||
		app.mode?.toLowerCase().includes("virtual");

	return (
		<div className="animate-in fade-in slide-in-from-right-2 duration-300">
			{/* Back */}
			<div className="flex items-center gap-3 mb-6">
				<button onClick={onBack} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
					<ArrowLeft className="size-4" />
				</button>
				<h2 className="text-lg font-bold text-gray-900 dark:text-white">Application Details</h2>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
				{/* ── Left ── */}
				<div className="lg:col-span-2 space-y-5">

					{/* Hero */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
						{/* Status stripe */}
						<div className={`h-1.5 w-full ${
							app.status === "Selected"    ? "bg-gradient-to-r from-emerald-400 to-teal-500" :
							app.status === "Shortlisted" ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
							app.status === "Rejected"    ? "bg-gradient-to-r from-red-400 to-rose-500" :
							"bg-gradient-to-r from-blue-400 to-indigo-500"
						}`} />
						<div className="p-6">
							<div className="flex items-start justify-between gap-4 mb-5">
								<div>
									<div className="flex items-center gap-2 mb-2 flex-wrap">
										<StatusBadge status={app.status} />
										{app.type && <TypeBadge type={app.type} />}
									</div>
									<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{app.role}</h1>
									<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
										<Building2 className="size-4" />{app.company}
									</p>
								</div>
							</div>

							{/* Info grid */}
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
								<div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Applied On</p>
									<p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{fmtDate(app.appliedAt)}</p>
								</div>
								{app.package && (
									<div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
										<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Package</p>
										<p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{app.package}</p>
									</div>
								)}
								{app.location && (
									<div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
										<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
										<p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
											<MapPin className="size-3 text-gray-400" />{app.location}
										</p>
									</div>
								)}
								{app.rounds && (
									<div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
										<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rounds</p>
										<p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{app.rounds}</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Description */}
					{app.description && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
							<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
								<BookOpen className="size-3.5" />About the Role
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">{app.description}</p>
						</div>
					)}

					{/* Guidelines */}
					{app.guidelines?.length > 0 && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
							<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
								<ClipboardList className="size-3.5" />Guidelines
							</h3>
							<div className="space-y-2">
								{app.guidelines.map((g, i) => (
									<div key={i} className="flex items-start gap-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
										<span className="size-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
										<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{g}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Documents required */}
					{app.documentsRequired?.length > 0 && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
							<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
								<FileText className="size-3.5" />Documents Required
							</h3>
							<div className="flex flex-wrap gap-2">
								{app.documentsRequired.map((d) => (
									<span key={d} className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold">{d}</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* ── Right sidebar ── */}
				<div className="space-y-5">

					{/* Interview scheduled */}
					{app.interviewDate && (
						<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
							<div className="flex items-center gap-2 mb-3">
								<div className="size-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
									<Calendar className="size-3.5 text-blue-600 dark:text-blue-400" />
								</div>
								<p className="text-sm font-bold text-blue-800 dark:text-blue-300">Interview Scheduled</p>
							</div>
							<div className="space-y-3">
								<div>
									<p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-wider mb-0.5">Date &amp; Time</p>
									<p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
										{fmtDate(app.interviewDate, { weekday: "short", month: "short", day: "numeric" })}
										{app.interviewTime && <span className="ml-1 text-blue-600 dark:text-blue-400">· {app.interviewTime}</span>}
									</p>
								</div>
								<div>
									<p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-wider mb-0.5">Mode</p>
									<p className="text-sm font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-1">
										{isOnline ? <Wifi className="size-3.5" /> : <MapPinned className="size-3.5" />}
										{app.interviewMode || app.mode || "TBD"}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Online link */}
					{app.onlineLink && (
						<div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5">
							<div className="flex items-center gap-2 mb-3">
								<Video className="size-4 text-indigo-600 dark:text-indigo-400" />
								<p className="text-sm font-bold text-indigo-800 dark:text-indigo-300">Online Interview Link</p>
							</div>
							<a
								href={app.onlineLink}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors w-fit"
							>
								<ExternalLink className="size-3.5" /> Join Meeting
							</a>
						</div>
					)}

					{/* Venue */}
					{app.venue && (
						<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
							<div className="flex items-center gap-2 mb-2">
								<MapPinned className="size-4 text-amber-600 dark:text-amber-400" />
								<p className="text-sm font-bold text-amber-800 dark:text-amber-300">Venue</p>
							</div>
							<p className="text-sm text-amber-700 dark:text-amber-300 font-medium leading-relaxed">{app.venue}</p>
						</div>
					)}

					{/* Notes */}
					{app.notes && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Your Notes</p>
							<p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">"{app.notes}"</p>
						</div>
					)}

					{/* Back button (sidebar) */}
					<button
						onClick={onBack}
						className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
					>
						<ArrowLeft className="size-3.5" /> Back to Applications
					</button>
				</div>
			</div>
		</div>
	);
};

// ── Tab root ──────────────────────────────────────────────────────────────────

export default function ApplicationsTab({ applications }) {
	const [statusFilter, setStatusFilter] = useState(null);
	const [detailApp,    setDetailApp]    = useState(null);

	const filtered = statusFilter
		? applications.filter((a) => a.status === statusFilter)
		: applications;

	if (detailApp) {
		return (
			<ApplicationDetailPage
				app={detailApp}
				onBack={() => setDetailApp(null)}
			/>
		);
	}

	return (
		<div className="animate-in fade-in duration-300">
			{/* Stat filter boxes */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
				{STATUS_CONFIG.map(({ status, icon, color }) => (
					<StatBox
						key={status}
						label={status}
						count={applications.filter((a) => a.status === status).length}
						icon={icon}
						color={color}
						isActive={statusFilter === status}
						onClick={() => setStatusFilter(statusFilter === status ? null : status)}
					/>
				))}
			</div>

			{/* Active filter label */}
			{statusFilter && (
				<div className="flex items-center gap-2 mb-4">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Showing <span className="font-bold text-gray-900 dark:text-white">{statusFilter}</span> applications
					</p>
					<button
						onClick={() => setStatusFilter(null)}
						className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
					>
						Clear filter
					</button>
				</div>
			)}

			{/* Cards grid */}
			{filtered.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{filtered.map((app) => (
						<ApplicationCard
							key={app.id}
							app={app}
							onClick={() => setDetailApp(app)}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon={Briefcase}
					message={statusFilter ? `No ${statusFilter.toLowerCase()} applications.` : "No applications yet. Browse job listings to apply."}
				/>
			)}
		</div>
	);
}