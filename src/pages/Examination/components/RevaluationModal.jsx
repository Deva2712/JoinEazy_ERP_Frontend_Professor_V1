// src/pages/Examination/components/RevaluationModal.jsx

import React, { useState } from "react";
import { X, Send, CheckCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

const RevaluationStatusBadge = ({ status }) => {
	const styles = {
		Pending: {
			bg: "bg-yellow-50 dark:bg-yellow-900/20",
			text: "text-yellow-700 dark:text-yellow-400",
			border: "border-yellow-200 dark:border-yellow-800",
			icon: Clock,
		},
		UnderReview: {
			bg: "bg-blue-50 dark:bg-blue-900/20",
			text: "text-blue-700 dark:text-blue-400",
			border: "border-blue-200 dark:border-blue-800",
			icon: Clock,
		},
		Approved: {
			bg: "bg-green-50 dark:bg-green-900/20",
			text: "text-green-700 dark:text-green-400",
			border: "border-green-200 dark:border-green-800",
			icon: CheckCircle2,
		},
		Rejected: {
			bg: "bg-red-50 dark:bg-red-900/20",
			text: "text-red-700 dark:text-red-400",
			border: "border-red-200 dark:border-red-800",
			icon: XCircle,
		},
	};

	const style = styles[status] || styles.Pending;
	const Icon = style.icon;

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}
		>
			<Icon className="size-3.5" />
			{status}
		</span>
	);
};

const PriorityBadge = ({ priority }) => {
	const styles = {
		High: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
		Mid: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
		Low: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
	};

	return (
		<span
			className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
				styles[priority] || styles.Low
			}`}
		>
			{priority} Priority
		</span>
	);
};

const RevaluationProgressTimeline = ({ request }) => {
	const stages = [
		{ label: "Submitted", completed: true },
		{ label: "Under Review", completed: request.status !== "Pending" },
		{
			label: "Decision",
			completed: request.status === "Approved" || request.status === "Rejected",
		},
	];

	return (
		<div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
			<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
				Progress
			</p>
			<div className="flex items-center justify-between">
				{stages.map((stage, idx) => (
					<div key={idx} className="flex flex-col items-center flex-1">
						<div
							className={`size-8 rounded-full flex items-center justify-center mb-2 font-bold text-xs transition-all ${
								stage.completed
									? "bg-rose-600 text-white"
									: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
							}`}
						>
							{stage.completed ? <CheckCircle2 className="size-4" /> : idx + 1}
						</div>
						<p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center leading-tight">
							{stage.label}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

const RevaluationModal = ({ subject, onClose, onSubmit, existingRequest }) => {
	const [form, setForm] = useState({
		reason: existingRequest?.reason || "",
		priority: existingRequest?.priority || "Mid",
	});
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = () => {
		if (!form.reason.trim()) return;
		onSubmit({ ...subject, ...form });
		setSubmitted(true);
		setTimeout(() => {
			setSubmitted(false);
			onClose();
		}, 2000);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

			{/* Panel */}
			<div className="relative w-full max-w-lg bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-5">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">
								Revaluation Request
							</p>
							<h2 className="text-white font-bold text-lg leading-tight">
								{subject.subjectName || subject.subject}
							</h2>
							<p className="text-white/60 text-sm mt-0.5">{subject.subjectCode || subject.code}</p>
						</div>
						<button
							onClick={onClose}
							className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
						>
							<X className="size-4 text-white" />
						</button>
					</div>
				</div>

				{/* Existing Request Status */}
				{existingRequest && (
					<div className="px-6 pt-4">
						<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
							<div>
								<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
									Existing Request
								</p>
								<RevaluationStatusBadge status={existingRequest.status} />
							</div>
							<PriorityBadge priority={existingRequest.priority} />
						</div>
						<RevaluationProgressTimeline request={existingRequest} />
					</div>
				)}

				{/* Form */}
				<div className="px-6 py-5 space-y-5">
					{submitted && (
						<div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
							<CheckCircle className="size-5 text-green-600 dark:text-green-400 flex-shrink-0" />
							<p className="text-sm font-semibold text-green-700 dark:text-green-400">
								Request submitted successfully!
							</p>
						</div>
					)}

					{/* Priority */}
					<div>
						<label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
							Priority Level <span className="text-red-500">*</span>
						</label>
						<div className="grid grid-cols-3 gap-2">
							{["High", "Mid", "Low"].map((p) => (
								<button
									key={p}
									onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
									className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
										form.priority === p
											? p === "High"
												? "bg-red-600 text-white border-red-600"
												: p === "Mid"
												? "bg-yellow-500 text-white border-yellow-500"
												: "bg-gray-600 text-white border-gray-600"
											: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
									}`}
								>
									{p}
								</button>
							))}
						</div>
					</div>

					{/* Reason */}
					<div>
						<label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
							Reason <span className="text-red-500">*</span>
						</label>
						<textarea
							value={form.reason}
							onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
							placeholder="Explain why you believe your answer deserves revaluation. Be specific..."
							rows={4}
							className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 resize-none transition-all"
						/>
					</div>

					<div className="flex gap-3">
						<button
							onClick={onClose}
							className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							disabled={!form.reason.trim()}
							className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
						>
							<Send className="size-4" />
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RevaluationModal;