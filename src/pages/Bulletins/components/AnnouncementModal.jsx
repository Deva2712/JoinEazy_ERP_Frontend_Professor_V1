// src/pages/Bulletins/components/AnnouncementModal.jsx

import React, { useState, useRef } from "react";
import {
	X,
	Megaphone,
	Upload,
	CheckCircle,
	FileText,
	ChevronDown,
	Layers,
	AlertCircle,
} from "lucide-react";

const AnnouncementModal = ({ isOpen, onClose, onSubmit, cohorts }) => {
	const fileInputRef = useRef(null);

	const [formData, setFormData] = useState({
		title: "",
		content: "",
		level: "course",
		priority: "Normal",
		courseId: "",
		cohortId: "",   // controller cohortId check karta hai
		attachment: null,
	});

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await onSubmit(formData);
		if (res.success) {
			setFormData({
				title: "",
				content: "",
				level: "course",
				priority: "Normal",
				courseId: "",
				cohortId: "",
				attachment: null,
			});
			onClose();
		}
	};

	const handleCourseChange = (e) => {
		const val = e.target.value;
		setFormData((prev) => ({
			...prev,
			courseId: val,
			cohortId: val, // dono sync rakho
		}));
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30">
							<Megaphone className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							New Course Announcement
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 overflow-y-auto">
					<form
						id="announcement-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Title */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<FileText className="size-3" /> Title{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								required
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
								placeholder="e.g., Midterm Rescheduled"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							/>
						</div>

						{/* Target Course + Priority */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<Layers className="size-3" /> Target Course{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
										value={formData.courseId}
										onChange={handleCourseChange}
										required
									>
										<option value="">Select Class</option>
										{cohorts.map((c) => (
											<option key={c.id} value={c.id}>
												{c.name}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>

							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<AlertCircle className="size-3" /> Priority{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
										value={formData.priority}
										onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
										required
									>
										<option value="Normal">Normal</option>
										<option value="High">High</option>
										<option value="Urgent">Urgent</option>
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>
						</div>

						{/* Content */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Announcement Details{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								required
								rows="4"
								className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
								placeholder="Detail your announcement here..."
								value={formData.content}
								onChange={(e) => setFormData({ ...formData, content: e.target.value })}
							/>
						</div>

						{/* Attachment */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Attachments
							</label>
							<div className="flex flex-col items-center gap-2">
								<button
									type="button"
									onClick={() => fileInputRef.current.click()}
									className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-all ${
										formData.attachment
											? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
											: "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900"
									}`}
								>
									{formData.attachment ? (
										<CheckCircle className="w-5 h-5" />
									) : (
										<Upload className="w-5 h-5" />
									)}
									<span className="font-semibold">
										{formData.attachment
											? formData.attachment.name
											: "Upload Document/Image"}
									</span>
								</button>
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/*,application/pdf,.doc,.docx"
									onChange={(e) =>
										setFormData({ ...formData, attachment: e.target.files[0] })
									}
								/>
							</div>
						</div>
					</form>
				</div>

				{/* Footer */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="announcement-form"
						className="flex-1 h-12 font-bold text-white bg-cyan-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition-all active:scale-[0.98]"
					>
						Post Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default AnnouncementModal;