import React from "react";
import {
	ArrowLeft, Briefcase, MapPin, Calendar, Upload, Send,
	CheckCircle, User, FileText, Link, AlignLeft, GraduationCap,
} from "lucide-react";
import HeaderController    from "../../../components/layout/Header/HeaderController";
import BottomNavController from "../../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../../components/layout/Footer/FooterController";

// ── Primitives ────────────────────────────────────────────────────────────────

export const inputCls = (err) =>
	`w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:border-emerald-500 transition-colors ${err ? "border-red-400" : "border-gray-200 dark:border-gray-700"}`;

export const Field = ({ label, required, error, children }) => (
	<div>
		<label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
			{label}{required && <span className="text-red-500 ml-1">*</span>}
		</label>
		{children}
		{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
	</div>
);

export const SectionTitle = ({ icon: Icon, label }) => (
	<div className="flex items-center gap-2 pt-2">
		<Icon className="size-4 text-emerald-500" />
		<h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{label}</h3>
	</div>
);

// ── Success Screen ────────────────────────────────────────────────────────────

export const SuccessScreen = ({ job, navigate }) => (
	<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
		<HeaderController />
		<div className="flex flex-col items-center justify-center py-32 px-4 text-center">
			<div className="size-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
				<CheckCircle className="size-10 text-emerald-500" />
			</div>
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
			<p className="text-gray-500 dark:text-gray-400 mb-2">
				Your application for <strong className="text-gray-700 dark:text-gray-300">{job.role}</strong> at{" "}
				<strong className="text-gray-700 dark:text-gray-300">{job.company}</strong> has been sent.
			</p>
			<p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
				The placement cell will review it and get back to you shortly.
			</p>
			<button onClick={() => navigate("/placement")} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
				<ArrowLeft className="size-4" /> Back to Placement Cell
			</button>
		</div>
		<BottomNavController /><FooterController />
	</div>
);

// ── Job Banner ────────────────────────────────────────────────────────────────

export const JobBanner = ({ job, navigate }) => (
	<div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 text-white">
		<div className="max-w-7xl mx-auto px-4 pt-5 pb-5">
			<div className="flex items-center gap-4 mb-5">
				<button onClick={() => navigate(-1)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
					<ArrowLeft className="size-5" />
				</button>
				<div>
					<h1 className="text-xl font-bold tracking-tight">Apply for Position</h1>
					<p className="text-white/70 text-sm mt-0.5">Fill in all required details carefully.</p>
				</div>
			</div>
			<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 flex flex-wrap gap-4 items-center">
				<div className="flex items-center gap-3 min-w-0">
					<div className="size-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
						<Briefcase className="size-5" />
					</div>
					<div className="min-w-0">
						<p className="font-bold truncate">{job.role}</p>
						<p className="text-sm text-white/70 truncate">{job.company}</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-3 text-sm text-white/80 ml-auto">
					<span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{job.location}</span>
					<span className="flex items-center gap-1.5"><Calendar className="size-3.5" />Due {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
					<span className="font-bold text-white">{job.stipend || job.package}</span>
				</div>
			</div>
		</div>
	</div>
);

// ── Apply Form ────────────────────────────────────────────────────────────────

export const ApplyForm = ({ job, form, set, errors, handleSubmit, navigate }) => (
	<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">

		<SectionTitle icon={User} label="Personal Information" />
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{[
				{ key: "fullName",   label: "Full Name",     type: "text",  placeholder: "As on ID card",     required: true },
				{ key: "email",      label: "Email Address", type: "email", placeholder: "college@email.com", required: true },
				{ key: "phone",      label: "Phone Number",  type: "tel",   placeholder: "+91 XXXXX XXXXX",   required: true },
				{ key: "rollNumber", label: "Roll Number",   type: "text",  placeholder: "e.g. 21CS001",      required: true },
			].map(({ key, label, type, placeholder, required }) => (
				<Field key={key} label={label} required={required} error={errors[key]}>
					<input type={type} value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={inputCls(errors[key])} />
				</Field>
			))}
		</div>

		<SectionTitle icon={GraduationCap} label="Academic Details" />
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<Field label="Branch / Department" required error={errors.branch}>
				<input type="text" value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="e.g. CSE" className={inputCls(errors.branch)} />
			</Field>
			<Field label="Year of Study" error={errors.year}>
				<select value={form.year} onChange={(e) => set("year", e.target.value)} className={inputCls(errors.year)}>
					<option value="">Select year</option>
					{["1st Year","2nd Year","3rd Year","4th Year","5th Year"].map((y) => <option key={y}>{y}</option>)}
				</select>
			</Field>
			<Field label="CGPA / Percentage" required error={errors.cgpa}>
				<input type="text" value={form.cgpa} onChange={(e) => set("cgpa", e.target.value)} placeholder="e.g. 8.5 or 85%" className={inputCls(errors.cgpa)} />
			</Field>
		</div>

		<SectionTitle icon={AlignLeft} label="Application Questions" />
		<div className="space-y-4">
			<Field label={`Why do you want to join ${job.company}?`} required error={errors.whyCompany}>
				<textarea rows={4} value={form.whyCompany} onChange={(e) => set("whyCompany", e.target.value)} placeholder="Describe your motivation..." className={`${inputCls(errors.whyCompany)} resize-none`} />
			</Field>
			<Field label="Key Strengths & Skills" error={errors.strengths}>
				<textarea rows={3} value={form.strengths} onChange={(e) => set("strengths", e.target.value)} placeholder="List your most relevant strengths..." className={`${inputCls(errors.strengths)} resize-none`} />
			</Field>
			<Field label="Relevant Experience / Projects" error={errors.experience}>
				<textarea rows={3} value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="Internships, projects, competitions..." className={`${inputCls(errors.experience)} resize-none`} />
			</Field>
			{job.type === "Internship" && (
				<Field label="Availability / Joining Date" error={errors.availability}>
					<input type="text" value={form.availability} onChange={(e) => set("availability", e.target.value)} placeholder="e.g. June 2025 onwards" className={inputCls(errors.availability)} />
				</Field>
			)}
		</div>

		<SectionTitle icon={FileText} label="Cover Letter" />
		<Field label="Cover Letter" required error={errors.coverLetter}>
			<textarea rows={6} value={form.coverLetter} onChange={(e) => set("coverLetter", e.target.value)} placeholder="Write a compelling cover letter..." className={`${inputCls(errors.coverLetter)} resize-none`} />
		</Field>

		<SectionTitle icon={Link} label="Links & Profiles" />
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<Field label="LinkedIn Profile" error={errors.linkedIn}>
				<input type="url" value={form.linkedIn} onChange={(e) => set("linkedIn", e.target.value)} placeholder="https://linkedin.com/in/..." className={inputCls(errors.linkedIn)} />
			</Field>
			<Field label="Portfolio / GitHub" error={errors.portfolio}>
				<input type="url" value={form.portfolio} onChange={(e) => set("portfolio", e.target.value)} placeholder="https://github.com/..." className={inputCls(errors.portfolio)} />
			</Field>
		</div>

		<SectionTitle icon={Upload} label="Resume" />
		<div className="flex items-center gap-4">
			<label className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl cursor-pointer transition-colors border border-gray-200 dark:border-gray-700">
				<Upload className="size-4" />
				{form.resumeFile ? form.resumeFile.name : "Upload Resume (PDF)"}
				<input type="file" accept=".pdf" className="hidden" onChange={(e) => set("resumeFile", e.target.files?.[0] || null)} />
			</label>
			{form.resumeFile && (
				<span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold">
					<CheckCircle className="size-3.5" /> Ready
				</span>
			)}
		</div>
		<p className="text-xs text-gray-400 -mt-3">Optional if you have already uploaded your resume to your profile.</p>

		<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
			<button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm">
				<Send className="size-4" /> Submit Application
			</button>
			<button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
				Cancel
			</button>
		</div>
	</div>
);