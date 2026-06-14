// src/pages/Placement/tabs/ResumeTab.jsx

import React, { useState } from "react";
import { FileText, FolderOpen, Upload, Eye, CheckCircle, Zap } from "lucide-react";

// ── Upload card ───────────────────────────────────────────────────────────────

const UploadCard = ({ title, icon: Icon, accept, maxSize, url, onUpload, description, color = "emerald", fileTypeLabel }) => {
	const [dragging, setDragging] = useState(false);

	const handleDrop = (e) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) onUpload(file);
	};

	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
			<div className={`h-1 bg-gradient-to-r from-${color}-400 to-teal-500`} />
			<div className="p-6">
				{/* Header */}
				<div className="flex items-start gap-4 mb-5">
					<div className={`size-11 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center flex-shrink-0`}>
						<Icon className={`size-5 text-${color}-600 dark:text-${color}-400`} />
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
							{url && (
								<span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
									<CheckCircle className="size-3" />Uploaded
								</span>
							)}
						</div>
						<p className="text-xs text-gray-400 mt-0.5">{description}</p>
					</div>
				</div>

				{/* Current file preview */}
				{url && (
					<div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl mb-4 border border-gray-100 dark:border-gray-700">
						<div className={`size-8 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center flex-shrink-0`}>
							<FileText className={`size-4 text-${color}-500`} />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">Current file uploaded</p>
							<p className="text-[10px] text-gray-400">Click preview to view</p>
						</div>
						<a
							href={url}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-colors"
						>
							<Eye className="size-3" />Preview
						</a>
					</div>
				)}

				{/* Drop zone */}
				<label
					className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
						dragging
							? `border-${color}-400 bg-${color}-50 dark:bg-${color}-900/20`
							: "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-gray-50 dark:hover:bg-gray-800/40"
					}`}
					onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
					onDragLeave={() => setDragging(false)}
					onDrop={handleDrop}
				>
					<div className={`size-10 rounded-xl flex items-center justify-center ${dragging ? `bg-${color}-100 dark:bg-${color}-900/30` : "bg-gray-100 dark:bg-gray-800"}`}>
						<Upload className={`size-5 ${dragging ? `text-${color}-500` : "text-gray-400"}`} />
					</div>
					<div className="text-center">
						<p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							{url ? "Replace file" : "Upload file"}
						</p>
						<p className="text-xs text-gray-400 mt-0.5">
							Drag &amp; drop or <span className={`text-${color}-600 dark:text-${color}-400 font-semibold`}>browse</span>
						</p>
					</div>
					<p className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
						{fileTypeLabel} · Max {maxSize}
					</p>
					<input type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
				</label>
			</div>
		</div>
	);
};

// ── Tab root ──────────────────────────────────────────────────────────────────

const TIPS = [
	"Keep your resume to 1 page for freshers",
	"Use ATS-friendly formatting with standard fonts",
	"Highlight projects relevant to job descriptions",
	"Update your portfolio before each drive",
];

export default function ResumeTab({ resumeUrl, projectUrl, onUploadResume, onUploadProject }) {
	return (
		<div className="animate-in fade-in duration-300">
			<div className="mb-6">
				<h2 className="text-base font-bold text-gray-900 dark:text-white">Resume &amp; Projects</h2>
				<p className="text-sm text-gray-400 mt-0.5">Manage your documents for placement applications.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
				<UploadCard
					title="Resume"
					icon={FileText}
					accept=".pdf"
					maxSize="5 MB"
					url={resumeUrl}
					onUpload={onUploadResume}
					description="Your main placement resume for recruiters."
					color="emerald"
					fileTypeLabel="PDF only"
				/>
				<UploadCard
					title="Projects Portfolio"
					icon={FolderOpen}
					accept=".pdf,.zip"
					maxSize="20 MB"
					url={projectUrl}
					onUpload={onUploadProject}
					description="Showcase your projects and technical work."
					color="teal"
					fileTypeLabel="PDF or ZIP"
				/>
			</div>

			{/* Tips */}
			<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
				<div className="flex items-center gap-2 mb-3">
					<div className="size-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
						<Zap className="size-3.5 text-amber-600 dark:text-amber-400" />
					</div>
					<p className="text-sm font-bold text-amber-800 dark:text-amber-300">Tips for better placement chances</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{TIPS.map((tip, i) => (
						<div key={i} className="flex items-start gap-2">
							<span className="size-4 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
							<p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{tip}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}