// src/pages/AssetRequest/views/RequestListView.jsx

import React from "react";
import { Plus, Calendar } from "lucide-react";
import AssetRequestCard from "../components/AssetRequestCard";

/**
 * Renders either the active requests list or the history list.
 * Also owns the "New Request" button when on the active tab.
 *
 * Props:
 *  - displayRequests  {Array}    Already-filtered list (active or history).
 *  - activeTab        {string}   "my-requests" | "history"
 *  - onOpenModal      {Function} Opens the create/edit modal.
 */
const RequestListView = ({ displayRequests, activeTab, onOpenModal }) => {
	const isActiveTab = activeTab === "my-requests";

	return (
		<>
			{/* Section header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
					{isActiveTab ? "Active Requests" : "Request History"}
				</h3>

				{isActiveTab && (
					<button
						onClick={() => onOpenModal()}
						className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
					>
						<Plus className="size-4" />
						New Request
					</button>
				)}
			</div>

			{/* Request cards or empty state */}
			{displayRequests.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{displayRequests.map((req) => (
						<AssetRequestCard
							key={req.id}
							req={req}
							onEdit={onOpenModal}
						/>
					))}
				</div>
			) : (
				<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#1a1d26] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
					<Calendar className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">
						No requests
					</h2>
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						Your asset requests will appear here.
					</p>
				</div>
			)}
		</>
	);
};

export default RequestListView;