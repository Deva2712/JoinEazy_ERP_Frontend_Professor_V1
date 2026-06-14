// src/pages/FinanceManagement/components/ClaimsSection.jsx
import React from "react";
import { Plus, RefreshCw, FileText } from "lucide-react";
import FinanceRequestCard from "./FinanceRequestCard";

const EmptyState = ({ activeTab }) => (
	<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
		<div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-6 text-amber-500">
			<FileText className="w-10 h-10" />
		</div>
		<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
			No {activeTab} Records
		</h3>
		<p className="text-sm text-gray-500 max-w-xs">
			Try adjusting your filters or search query to find what you're looking for.
		</p>
	</div>
);

/**
 * ClaimsSection
 * Renders the list header, New button, and cards for
 * either the "expenses" or "advances" tab.
 */
const ClaimsSection = ({ activeTab, items = [], loading, onRefresh, onNew, onEditItem }) => {
	const isExpenses = activeTab === "expenses";
	const label     = isExpenses ? "Expense"  : "Advance";
	const heading   = isExpenses ? "Your Expense Claims" : "Your Advance Requests";
	const btnLabel  = isExpenses ? "New Claim" : "New Request";

	return (
		<div className="space-y-6">
			{/* Header row */}
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
					{heading}
				</h3>
				<div className="flex items-center gap-2">
					<button
						onClick={onRefresh}
						className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
					>
						<RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
					</button>
					<button
						onClick={onNew}
						className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
					>
						<Plus className="size-4" /> {btnLabel}
					</button>
				</div>
			</div>

			{/* Cards */}
			{items.length > 0 ? (
				<div className="grid gap-4">
					{items.map((item) => (
						<FinanceRequestCard
							key={item.id}
							item={item}
							type={label}
							onEdit={onEditItem}
						/>
					))}
				</div>
			) : (
				<EmptyState activeTab={label} />
			)}
		</div>
	);
};

export default ClaimsSection;