// src/pages/Placement/tabs/HistoryTab.jsx

import React, { useState } from "react";
import { Trophy, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { EmptyState } from "../shared/PlacementPrimitives";

// ── Add experience modal ──────────────────────────────────────────────────────

const FIELDS = [
	{ key: "role",    label: "Role / Position",   placeholder: "e.g. Software Engineer" },
	{ key: "company", label: "Company",           placeholder: "e.g. Google"            },
	{ key: "year",    label: "Year",              placeholder: "e.g. 2024"              },
	{ key: "package", label: "Package / Stipend", placeholder: "e.g. ₹24 LPA"          },
];

const EMPTY = { role: "", company: "", year: "", package: "", type: "Full Time", notes: "" };

const AddExperienceModal = ({ onClose, onAdd }) => {
	const [form, setForm] = useState(EMPTY);
	const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
	const cls = "w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 transition-colors text-gray-900 dark:text-white";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md shadow-2xl">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
					<Trophy className="size-4 text-amber-500" /> Add Experience
				</h3>
				<div className="space-y-4">
					{FIELDS.map(({ key, label, placeholder }) => (
						<div key={key}>
							<label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
							<input type="text" value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={cls} />
						</div>
					))}
					<div>
						<label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Type</label>
						<select value={form.type} onChange={(e) => set("type", e.target.value)} className={cls}>
							<option>Full Time</option>
							<option>Internship</option>
						</select>
					</div>
					<div>
						<label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Notes (optional)</label>
						<textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any additional details..." className={`${cls} resize-none`} />
					</div>
				</div>
				<div className="flex gap-3 mt-6">
					<button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
						Cancel
					</button>
					<button
						onClick={() => { if (form.role && form.company) { onAdd({ ...form, id: Date.now() }); onClose(); } }}
						className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
					>
						Add Experience
					</button>
				</div>
			</div>
		</div>
	);
};

// ── History card ──────────────────────────────────────────────────────────────

const HistoryCard = ({ ph }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-yellow-500" />

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Row 1: type + year */}
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">
            {ph.type}
          </span>
          <span className="text-xs font-semibold text-gray-400">{ph.year}</span>
        </div>

        {/* Row 2: role + company */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight text-sm">{ph.role}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ph.company}</p>
        </div>

        {/* Row 3: package meta cell full-width */}
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Package / Stipend</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{ph.package}</p>
          </div>
        </div>

        {/* Expanded notes */}
        {expanded && ph.notes && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{ph.notes}</p>
          </div>
        )}
      </div>

      {ph.notes && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {expanded ? <><ChevronUp className="size-3.5" />Less</> : <><ChevronDown className="size-3.5" />See More</>}
          </button>
        </div>
      )}
    </div>
  );
};

// ── Tab root ──────────────────────────────────────────────────────────────────

export default function HistoryTab({ history: initialHistory }) {
	const [history,    setHistory]    = useState(initialHistory);
	const [showAddExp, setShowAddExp] = useState(false);

	return (
		<div className="animate-in fade-in duration-300">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-base font-bold text-gray-900 dark:text-white">Placement History</h2>
				<button
					onClick={() => setShowAddExp(true)}
					className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
				>
					<Plus className="size-4" /> Add Experience
				</button>
			</div>

			{history.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{history.map((ph) => <HistoryCard key={ph.id} ph={ph} />)}
				</div>
			) : (
				<EmptyState
					icon={Trophy}
					message="No placement history yet."
					action={
						<button
							onClick={() => setShowAddExp(true)}
							className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
						>
							<Plus className="size-4" /> Add your first experience
						</button>
					}
				/>
			)}

			{showAddExp && (
				<AddExperienceModal
					onClose={() => setShowAddExp(false)}
					onAdd={(entry) => setHistory((p) => [entry, ...p])}
				/>
			)}
		</div>
	);
}