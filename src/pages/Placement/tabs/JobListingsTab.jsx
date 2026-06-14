// src/pages/Placement/tabs/JobListingsTab.jsx

import React, { useState } from "react";
import {
	Briefcase, Building2, MapPin, Calendar, Clock, CheckCircle,
	ExternalLink, ArrowLeft, BookOpen, Layers, BarChart2, Users,
	TrendingUp, Star, Shield, Zap, Info,
} from "lucide-react";
import { TypeBadge, EmptyState } from "../shared/PlacementPrimitives";
import { daysLeft, fmtDate, JOB_TYPES } from "../shared/placementConstants";

// ── Job card (grid) ───────────────────────────────────────────────────────────

const JobCard = ({ job, isApplied, onClick }) => {
  const left = daysLeft(job.deadline);
  const urgencyColor =
    left <= 0 ? "text-gray-400" :
    left <= 3 ? "text-red-500 dark:text-red-400" :
    left <= 7 ? "text-amber-500 dark:text-amber-400" :
    "text-gray-500 dark:text-gray-400";

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className={`h-1 w-full ${job.type === "Internship" ? "bg-gradient-to-r from-blue-400 to-indigo-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`} />

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Row 1: type badge + applied indicator */}
        <div className="flex items-center justify-between gap-2">
          <TypeBadge type={job.type} />
          {isApplied && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-3" />Applied
            </span>
          )}
        </div>

        {/* Row 2: role + company */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {job.role}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="size-3 flex-shrink-0" />{job.company}
          </p>
        </div>

        {/* Row 3: meta grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Package</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{job.stipend || job.package}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{job.location}</p>
          </div>
          <div className={`col-span-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5 flex items-center gap-1.5 ${urgencyColor}`}>
            <Clock className="size-3 flex-shrink-0" />
            <p className="text-xs font-semibold">
              {left <= 0 ? "Deadline passed" : left === 1 ? "1 day left" : `${left} days left`}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-emerald-500 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Job detail page ───────────────────────────────────────────────────────────

const JobDetailPage = ({ job, isApplied, onApply, onBack }) => (
	<div className="animate-in fade-in slide-in-from-right-2 duration-300">
		{/* Back */}
		<div className="flex items-center gap-3 mb-6">
			<button onClick={onBack} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
				<ArrowLeft className="size-4" />
			</button>
			<h2 className="text-lg font-bold text-gray-900 dark:text-white">Job Details</h2>
		</div>

		<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
			{/* ── Left ── */}
			<div className="lg:col-span-2 space-y-5">

				{/* Hero */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
					<div className="flex items-start justify-between gap-4 mb-5">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{job.role}</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
								<Building2 className="size-4" />{job.company}
							</p>
						</div>
						<TypeBadge type={job.type} size="lg" />
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
						<div>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
							<p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
								<MapPin className="size-3.5 text-gray-400" />{job.location}
							</p>
						</div>
						<div>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Package</p>
							<p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{job.stipend || job.package}</p>
						</div>
						<div>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
							<p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
								<Calendar className="size-3.5 text-gray-400" />
								{fmtDate(job.deadline)}
							</p>
						</div>
					</div>

					<button
						onClick={() => !isApplied && onApply(job)}
						disabled={isApplied}
						className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
							isApplied
								? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default"
								: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
						}`}
					>
						{isApplied
							? <><CheckCircle className="size-4" />Already Applied</>
							: <><ExternalLink className="size-4" />Apply Now</>}
					</button>
				</div>

				{/* Description */}
				{job.description && (
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
							<BookOpen className="size-3.5" />About the Role
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{job.description}</p>
					</div>
				)}

				{/* Requirements */}
				{job.requirements?.length > 0 && (
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
							<Layers className="size-3.5" />Requirements
						</h3>
						<div className="flex flex-wrap gap-2">
							{job.requirements.map((r) => (
								<span key={r} className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-800">{r}</span>
							))}
						</div>
					</div>
				)}
			</div>

			{/* ── Right sidebar ── */}
			<div className="space-y-5">
				{/* Quick info */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
					<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
						<BarChart2 className="size-3.5" />Quick Info
					</h3>
					<div className="space-y-4">
						{[
							job.openings && { icon: Users,       color: "blue",   label: "Openings", value: job.openings },
							job.rounds   && { icon: TrendingUp,  color: "purple", label: "Rounds",   value: job.rounds   },
							job.duration && { icon: Clock,       color: "amber",  label: "Duration", value: job.duration },
							job.cgpa     && { icon: Star,        color: "green",  label: "Min CGPA", value: job.cgpa     },
						].filter(Boolean).map(({ icon: Icon, color, label, value }) => (
							<div key={label} className="flex items-center justify-between">
								<div className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400`}>
									<div className={`size-7 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center`}>
										<Icon className={`size-3.5 text-${color}-500`} />
									</div>
									{label}
								</div>
								<span className="text-sm font-bold text-gray-800 dark:text-gray-200">{value}</span>
							</div>
						))}
					</div>
				</div>

				{/* Branches */}
				{job.branches?.length > 0 && (
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
							<Shield className="size-3.5" />Eligible Branches
						</h3>
						<div className="flex flex-wrap gap-1.5">
							{job.branches.map((b) => (
								<span key={b} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold">{b}</span>
							))}
						</div>
					</div>
				)}

				{/* Note */}
				{job.additionalInfo && (
					<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
						<h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
							<Info className="size-3.5" />Note
						</h3>
						<p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{job.additionalInfo}</p>
					</div>
				)}

				{/* Apply CTA */}
				{!isApplied && (
					<div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
						<p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-3 flex items-center gap-1.5">
							<Zap className="size-3.5" />Ready to apply? Don't miss the deadline!
						</p>
						<button
							onClick={() => onApply(job)}
							className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-sm"
						>
							<ExternalLink className="size-4" /> Apply Now
						</button>
					</div>
				)}
			</div>
		</div>
	</div>
);

// ── Tab root ──────────────────────────────────────────────────────────────────

export default function JobListingsTab({ jobs, appliedIds, onApply }) {
	const [filterType, setFilterType] = useState("All");
	const [detailJob,  setDetailJob]  = useState(null);

	const filtered = filterType === "All" ? jobs : jobs.filter((j) => j.type === filterType);

	if (detailJob) {
		return (
			<JobDetailPage
				job={detailJob}
				isApplied={appliedIds.has(detailJob.id)}
				onApply={(job) => { onApply(job); }}
				onBack={() => setDetailJob(null)}
			/>
		);
	}

	return (
		<div className="animate-in fade-in duration-300">
			{/* Filter + count */}
			<div className="flex items-center gap-2 mb-6">
				{JOB_TYPES.map((t) => (
					<button
						key={t}
						onClick={() => setFilterType(t)}
						className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
							filterType === t
								? "bg-emerald-600 text-white"
								: "bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
						}`}
					>{t}</button>
				))}
				<span className="ml-auto text-xs text-gray-400 dark:text-gray-500 font-bold">
					{filtered.length} listing{filtered.length !== 1 ? "s" : ""}
				</span>
			</div>

			{filtered.length === 0 ? (
				<EmptyState icon={Briefcase} message="No listings available right now." />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
					{filtered.map((job) => (
						<JobCard
							key={job.id}
							job={job}
							isApplied={appliedIds.has(job.id)}
							onClick={() => setDetailJob(job)}
						/>
					))}
				</div>
			)}
		</div>
	);
}