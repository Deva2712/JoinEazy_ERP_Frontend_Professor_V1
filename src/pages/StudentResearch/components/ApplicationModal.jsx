// src/pages/StudentResearch/components/ApplicationModal.jsx

import React, { useState } from "react";
import {
	X,
	FileText,
	GraduationCap,
	Microscope,
	Briefcase,
	ChevronDown,
} from "lucide-react";

/**
 * Modal for submitting research applications.
 * Includes a mandatory role selection field.
 */
const ApplicationModal = ({ isOpen, onClose, type, data, onSubmit }) => {
	const [formData, setFormData] = useState({
		roleId: "",
		justification: "",
		appliedDate: new Date().toISOString(),
	});

	const [errors, setErrors] = useState({});
	const [isApplied, setIsApplied] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	React.useEffect(() => {
		if (isOpen) {
			setIsApplied(false);
			setIsSubmitting(false);
			setFormData({ roleId: "", justification: "", appliedDate: new Date().toISOString() });
			setErrors({});
		}
	}, [isOpen]);

	if (!isOpen) return null;

	if (isApplied) {
		return (
			<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
				<div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
					<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Submitted</h2>
						<button onClick={() => { setIsApplied(false); onClose(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
							<X className="size-5 text-gray-500" />
						</button>
					</div>
					<div className="p-8 text-center">
						<GraduationCap className="mx-auto mb-4 size-10 text-green-500" />
						<p className="text-lg font-bold text-gray-900 dark:text-white">Your application has been submitted!</p>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Thank you. We will notify you when there's an update.</p>
						<button onClick={() => { setIsApplied(false); onClose(); }} className="mt-6 px-6 py-2 rounded-xl bg-blue-600 text-white font-bold">Close</button>
					</div>
				</div>
			</div>
		);
	}

	const validate = () => {
		const newErrors = {};

		if (!formData.roleId) {
			newErrors.roleId = "Please select a role to apply for.";
		}
		if (formData.justification.length < 50) {
			newErrors.justification =
				"Please provide a bit more detail (min 50 characters).";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		setIsSubmitting(true);
		try {
			const result = await onSubmit({ ...formData, appliedDate: new Date().toISOString() });
			if (result?.success !== false) {
				setIsApplied(true);
				setFormData({ roleId: "", justification: "" });
			} else {
				setErrors({ form: "Could not submit application. Please try again." });
			}
		} catch (error) {
			setErrors({ form: "Could not submit application. Please try again." });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30">
							{type === "Project" ? (
								<Microscope className="size-5" />
							) : (
								<GraduationCap className="size-5" />
							)}
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Apply to {type}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6 overflow-y-auto">
					<form
						id="research-application-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Role Selection */}
						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<Briefcase className="size-3" />
								Select Role <span className="text-red-500">*</span>
							</label>

							<div className="relative group">
								<select
									className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border ${errors.roleId ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none`}
									value={formData.roleId}
									onChange={(e) =>
										setFormData({
											...formData,
											roleId: e.target.value,
										})
									}
									required
								>
									<option value="">Choose a role...</option>
									{data?.openRoles?.map((role) => (
										<option key={role.roleName} value={role.roleName}>
											{role.roleName}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
							</div>
							{errors.roleId && (
								<p className="mt-1 text-xs text-red-500">
									{errors.roleId}
								</p>
							)}
						</div>

						{/* Statement of Interest */}
						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<FileText className="size-3" />
								Statement of Interest (min 50 characters){" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								className={`w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-gray-900 border ${errors.justification ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none`}
								value={formData.justification}
								onChange={(e) =>
									setFormData({
										...formData,
										justification: e.target.value,
									})
								}
								placeholder="Describe your relevant experience and why you're a good fit for this role (min 50 characters)..."
								required
							/>
							{errors.justification && (
								<p className="mt-1 text-xs text-red-500">
									{errors.justification}
								</p>
							)}
						</div>

						{errors.form && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
								<p className="text-sm text-red-600 dark:text-red-400">
									{errors.form}
								</p>
							</div>
						)}
					</form>
				</div>

				{/* Modal Footer */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="research-application-form"
						disabled={isSubmitting}
						className="flex-1 h-12 font-bold text-white bg-blue-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
					>
						{isSubmitting ? (
							<>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								Submitting...
							</>
						) : (
							"Submit Application"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ApplicationModal;