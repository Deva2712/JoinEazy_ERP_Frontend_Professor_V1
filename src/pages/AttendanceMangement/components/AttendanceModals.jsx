// src/pages/AttendanceManagement/components/AttendanceModals.jsx

import React from "react";
import {
	CheckCircle2,
	AlertTriangle,
	Clock,
	X,
	Archive,
	Users,
	Timer,
	Minus,
	Plus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Shared base modal wrapper
// ---------------------------------------------------------------------------

const ModalBackdrop = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
			onClick={onClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

			{/* Panel */}
			<div
				className="relative w-full max-w-md animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------------------
// 1. SaveSuccessModal
//    Shown after a draft is saved to localStorage.
// ---------------------------------------------------------------------------

/**
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {string}   deadline  — e.g. "May 15 at 11:59 PM"
 */
export const SaveSuccessModal = ({ isOpen, onClose, deadline }) => (
	<ModalBackdrop isOpen={isOpen} onClose={onClose}>
		<div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
			{/* Top accent strip */}
			<div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

			<div className="p-7">
				{/* Icon + close */}
				<div className="flex items-start justify-between mb-5">
					<div className="flex items-center justify-center size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
						<CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" />
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					>
						<X className="size-4" />
					</button>
				</div>

				{/* Text */}
				<h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
					Draft Saved
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
					Your attendance progress has been saved locally. Remember to
					submit before the deadline.
				</p>

				{/* Deadline pill */}
				{deadline && (
					<div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
						<Clock className="size-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
						<p className="text-xs font-bold text-amber-700 dark:text-amber-300">
							Submit by{" "}
							<span className="font-black">{deadline}</span>
						</p>
					</div>
				)}

				{/* CTA */}
				<button
					onClick={onClose}
					className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black uppercase tracking-widest transition-colors"
				>
					Got it
				</button>
			</div>
		</div>
	</ModalBackdrop>
);

// ---------------------------------------------------------------------------
// 2. ConfirmSubmitModal
//    Shown before final attendance submission — irreversible action.
// ---------------------------------------------------------------------------

/**
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {Function} onConfirm
 * @param {number}   studentCount
 */
export const ConfirmSubmitModal = ({
	isOpen,
	onClose,
	onConfirm,
	studentCount,
}) => (
	<ModalBackdrop isOpen={isOpen} onClose={onClose}>
		<div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
			{/* Top accent strip */}
			<div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />

			<div className="p-7">
				{/* Icon + close */}
				<div className="flex items-start justify-between mb-5">
					<div className="flex items-center justify-center size-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
						<Archive className="size-7 text-purple-600 dark:text-purple-400" />
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					>
						<X className="size-4" />
					</button>
				</div>

				{/* Text */}
				<h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
					Submit Attendance?
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
					This will finalise today's attendance record. This action
					cannot be undone.
				</p>

				{/* Student count pill */}
				{studentCount > 0 && (
					<div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
						<Users className="size-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
						<p className="text-xs font-bold text-gray-600 dark:text-gray-300">
							Submitting records for{" "}
							<span className="font-black text-gray-900 dark:text-white">
								{studentCount} student
								{studentCount !== 1 ? "s" : ""}
							</span>
						</p>
					</div>
				)}

				{/* Warning note */}
				<div className="mt-3 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
					<AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
					<p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
						Once submitted, you will not be able to make any
						further changes.
					</p>
				</div>

				{/* Actions */}
				<div className="mt-6 flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black uppercase tracking-widest transition-colors shadow-sm"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	</ModalBackdrop>
);

// ---------------------------------------------------------------------------
// 3. QRSettingsModal
//    Controls the QR code expiry timeout (in seconds).
// ---------------------------------------------------------------------------

const QR_PRESETS = [30, 60, 120, 300];

/**
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {number}   timeout     — current timeout in seconds
 * @param {Function} setTimeout  — setter for timeout
 */
export const QRSettingsModal = ({ isOpen, onClose, timeout, setTimeout }) => {
	const handleDecrement = () => {
		if (timeout > 10) setTimeout((prev) => prev - 10);
	};

	const handleIncrement = () => {
		if (timeout < 600) setTimeout((prev) => prev + 10);
	};

	return (
		<ModalBackdrop isOpen={isOpen} onClose={onClose}>
			<div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
				{/* Top accent strip */}
				<div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

				<div className="p-7">
					{/* Header */}
					<div className="flex items-start justify-between mb-6">
						<div>
							<div className="flex items-center justify-center size-14 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 mb-4">
								<Timer className="size-7 text-violet-600 dark:text-violet-400" />
							</div>
							<h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
								QR Settings
							</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								Set how long each QR code stays active.
							</p>
						</div>
						<button
							onClick={onClose}
							className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						>
							<X className="size-4" />
						</button>
					</div>

					{/* Stepper */}
					<div className="flex items-center justify-between gap-4 px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
						<button
							onClick={handleDecrement}
							disabled={timeout <= 10}
							className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90"
						>
							<Minus className="size-4" />
						</button>

						<div className="text-center">
							<span className="text-4xl font-mono font-black text-gray-900 dark:text-white tabular-nums">
								{timeout}
							</span>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
								seconds
							</p>
						</div>

						<button
							onClick={handleIncrement}
							disabled={timeout >= 600}
							className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90"
						>
							<Plus className="size-4" />
						</button>
					</div>

					{/* Quick presets */}
					<div className="mt-4">
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
							Quick select
						</p>
						<div className="grid grid-cols-4 gap-2">
							{QR_PRESETS.map((preset) => (
								<button
									key={preset}
									onClick={() => setTimeout(preset)}
									className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
										timeout === preset
											? "bg-purple-600 text-white border-purple-600 shadow-sm"
											: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
									}`}
								>
									{preset >= 60
										? `${preset / 60}m`
										: `${preset}s`}
								</button>
							))}
						</div>
					</div>

					{/* Done */}
					<button
						onClick={onClose}
						className="mt-6 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black uppercase tracking-widest transition-colors"
					>
						Save Settings
					</button>
				</div>
			</div>
		</ModalBackdrop>
	);
};