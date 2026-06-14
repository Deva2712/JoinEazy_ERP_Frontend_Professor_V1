// src/pages/Schedule/components/RequestMeetingModal.jsx

import React, { useState, useEffect } from "react";
import {
	X,
	User,
	Calendar,
	FileText,
	ChevronDown,
	MapPin,
	Link as LinkIcon,
	MessageSquare,
	Video,
	Users,
} from "lucide-react";

const RECIPIENT_ROLES = ["Student", "Professor", "Supervisor", "HOD"];

const RequestMeetingModal = ({ isOpen, onClose, onConfirm, initialData }) => {
	const initialState = {
		recipientName: "",
		recipientRole: "Professor",
		recipientDepartment: "",
		subject: "",
		requestedDateTime: "",
		reason: "",
		meetingMode: "offline",
		link: "",
		venue: "",
		note: "",
	};

	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});

	useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                recipientName: initialData.recipientName || "",
                recipientRole: initialData.recipientRole || "Professor",
                recipientDepartment: initialData.recipientDepartment || "", // Ensure department is mapped
                subject: initialData.subject || "",
            }));
        } else {
            setFormData(initialState);
        }
        setErrors({});
    }
}, [isOpen, initialData]);

	if (!isOpen) return null;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: null }));
		}
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.recipientName.trim())
			newErrors.recipientName = "Required";
		if (!formData.subject.trim()) newErrors.subject = "Required";
		if (!formData.requestedDateTime)
			newErrors.requestedDateTime = "Required";
		if (!formData.reason.trim()) newErrors.reason = "Required";

		if (formData.meetingMode === "online" && !formData.link.trim()) {
			newErrors.link = "Link required";
		}
		if (formData.meetingMode === "offline" && !formData.venue.trim()) {
			newErrors.venue = "Venue required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		onConfirm({
			id: Date.now(),
			recipientName: formData.recipientName.trim(),
			recipientRole: formData.recipientRole,
			recipientDepartment: formData.recipientDepartment.trim(),
			subject: formData.subject.trim(),
			requestedTime: new Date(formData.requestedDateTime).toISOString(),
			reason: formData.reason.trim(),
			mode: formData.meetingMode,
			link: formData.meetingMode === "online" ? formData.link : null,
			venue: formData.meetingMode === "offline" ? formData.venue : null,
			note: formData.note.trim() || null,
			status: "pending",
			createdAt: new Date().toISOString(),
		});

		onClose();
	};

	const minDateTime = new Date();
	minDateTime.setMinutes(minDateTime.getMinutes() + 30);
	const minStr = minDateTime.toISOString().slice(0, 16);

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Header Section */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30">
							<Users className="size-5" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Request Meeting
							</h2>
						</div>
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
						id="meeting-request-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Recipient Info */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									<span className="flex items-center gap-2">
										<User className="size-3" /> Recipient
										Name
									</span>
								</label>
								<input
									type="text"
									name="recipientName"
									value={formData.recipientName}
									onChange={handleChange}
									placeholder="Dr. John Smith"
									className={`w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border ${errors.recipientName ? "border-rose-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all`}
								/>
							</div>

							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Role{" "}
									<span className="text-rose-500">*</span>
								</label>
								<div className="relative group">
									<select
										name="recipientRole"
										value={formData.recipientRole}
										onChange={handleChange}
										className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all appearance-none"
									>
										{RECIPIENT_ROLES.map((role) => (
											<option key={role} value={role}>
												{role}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Department{" "}
								<span className="text-gray-400 font-normal lowercase">
									(optional)
								</span>
							</label>
							<input
								type="text"
								name="recipientDepartment"
								value={formData.recipientDepartment}
								onChange={handleChange}
								placeholder="E.g., Computer Science"
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all"
							/>
						</div>

						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<FileText className="size-3" /> Subject{" "}
								<span className="text-rose-500">*</span>
							</label>
							<input
								type="text"
								name="subject"
								value={formData.subject}
								onChange={handleChange}
								placeholder="E.g., Research collaboration discussion"
								className={`w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border ${errors.subject ? "border-rose-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all`}
							/>
						</div>

						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Calendar className="size-3" /> Date & Time{" "}
								<span className="text-rose-500">*</span>
							</label>
							<input
								name="requestedDateTime"
								type="datetime-local"
								min={minStr}
								value={formData.requestedDateTime}
								onChange={handleChange}
								className={`w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border ${errors.requestedDateTime ? "border-rose-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all`}
							/>
						</div>

						{/* Meeting Mode Selector */}
						<div className="grid grid-cols-2 gap-3">
							{[
								{
									id: "offline",
									icon: <MapPin className="size-4" />,
								},
								{
									id: "online",
									icon: <Video className="size-4" />,
								},
							].map((mode) => (
								<button
									key={mode.id}
									onClick={() =>
										setFormData((prev) => ({
											...prev,
											meetingMode: mode.id,
										}))
									}
									className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all  ${
										formData.meetingMode === mode.id
											? "bg-rose-600 text-white border-rose-600 shadow-md dark:shadow-none"
											: "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-100"
									}`}
								>
									{mode.icon}
									<span className="capitalize">
										{mode.id}
									</span>
								</button>
							))}
						</div>

						{/* Conditional Input */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								{formData.meetingMode === "offline" ? (
									<>
										<MapPin className="size-3" /> Venue
									</>
								) : (
									<>
										<LinkIcon className="size-3" /> Meeting
										Link
									</>
								)}
								<span className="text-rose-500">*</span>
							</label>
							<input
								type={
									formData.meetingMode === "online"
										? "url"
										: "text"
								}
								name={
									formData.meetingMode === "offline"
										? "venue"
										: "link"
								}
								value={
									formData.meetingMode === "offline"
										? formData.venue
										: formData.link
								}
								onChange={handleChange}
								placeholder={
									formData.meetingMode === "offline"
										? "E.g., Room 201, Library"
										: "https://zoom.us/..."
								}
								className={`w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border ${errors.venue || errors.link ? "border-rose-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all`}
							/>
						</div>

						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<MessageSquare className="size-3" /> Reason /
								Agenda <span className="text-rose-500">*</span>
							</label>
							<textarea
								name="reason"
								value={formData.reason}
								onChange={handleChange}
								placeholder="Briefly describe the purpose of this meeting..."
								className={`w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-gray-900 border ${errors.reason ? "border-rose-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none`}
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Additional Note{" "}
								<span className="text-gray-400 font-normal lowercase">
									(optional)
								</span>
							</label>
							<textarea
								name="note"
								value={formData.note}
								onChange={handleChange}
								placeholder="Any extra info for the recipient..."
								className="w-full min-h-[80px] px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
							/>
						</div>
					</form>
				</div>

				{/* Footer Actions */}
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
						form="meeting-request-form"
						className="flex-1 h-12 font-bold text-white bg-rose-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-[0.98]"
					>
						Send Request
					</button>
				</div>
			</div>
		</div>
	);
};

export default RequestMeetingModal;
