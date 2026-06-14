// src/pages/Schedule/views/RequestsView.jsx

import React, { useState, useMemo } from "react";
import { Inbox, Send, Search, ArrowLeft, History, Plus } from "lucide-react";
import MeetingCard from "../components/MeetingCard";

const RequestsView = ({
	meetingRequests = [],
	outgoingRequests = [],
	handleAccept,
	handleReschedule,
	handleReject,
	setShowRequestModal,
}) => {
	const [viewMode, setViewMode] = useState("incoming"); // Default to incoming for professors to see requests
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	const filteredData = useMemo(() => {
		const list =
			viewMode === "incoming" ? meetingRequests : outgoingRequests;

		// Filter out accepted and scheduled meetings from this view
		const pendingList = list.filter(
			(item) =>
				item.status?.toLowerCase() !== "accepted" &&
				item.status?.toLowerCase() !== "scheduled",
		);

		if (!searchQuery) return pendingList;

		const q = searchQuery.toLowerCase();
		return pendingList.filter(
			(item) =>
				item.participantName?.toLowerCase().includes(q) ||
				item.subject?.toLowerCase().includes(q),
		);
	}, [meetingRequests, outgoingRequests, viewMode, searchQuery]);

	const selectedRequest = useMemo(
		() => filteredData.find((r) => r.id === selectedId),
		[filteredData, selectedId],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Search bar and Incoming/Outgoing toggle */}
			<div
				className={`flex flex-col md:flex-row gap-4 ${selectedId ? "hidden lg:flex" : "flex"}`}
			>
				<div className="relative group flex-1">
					<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
					<input
						type="text"
						placeholder="Search by name or subject..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-600 transition-all"
					/>
				</div>

				<div className="flex w-full md:w-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
					<button
						onClick={() => {
							setViewMode("incoming");
							setSelectedId(null);
						}}
						className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "incoming" ? "bg-rose-600 text-white shadow-md" : "text-gray-500 hover:text-rose-600"}`}
					>
						<Inbox className="size-4" /> <span>Received</span>
					</button>
					<button
						onClick={() => {
							setViewMode("outgoing");
							setSelectedId(null);
						}}
						className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "outgoing" ? "bg-rose-600 text-white shadow-md" : "text-gray-500 hover:text-rose-600"}`}
					>
						<Send className="size-4" /> <span>Sent</span>
					</button>
				</div>
			</div>

			{/* Main content area */}
			<div
				className={`flex flex-col ${selectedId ? "lg:flex-row gap-8" : "gap-4"}`}
			>
				<div
					className={`${
						selectedId
							? "hidden lg:block lg:w-[380px] shrink-0 max-h-[70vh] overflow-y-auto pt-2 px-2 -mx-2 custom-scrollbar"
							: "w-full"
					}`}
				>
					<div className="flex items-center justify-between px-1 mb-6">
						<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
							{viewMode} Requests ({filteredData.length})
						</h3>

						{viewMode === "outgoing" && (
							<button
								onClick={() => setShowRequestModal(true)}
								className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
							>
								<Plus className="size-4" /> New Request
							</button>
						)}
					</div>

					{filteredData.length > 0 ? (
						<div
							className={
								selectedId
									? "flex flex-col gap-4"
									: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
							}
						>
							{filteredData.map((req) => (
								<MeetingCard
									key={req.id}
									meeting={req}
									isExpanded={false}
									isSelected={selectedId === req.id}
									onClick={() => setSelectedId(req.id)}
								/>
							))}
						</div>
					) : (
						<div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
							<History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500 font-medium">
								No {viewMode} requests found.
							</p>
						</div>
					)}
				</div>

				{selectedRequest && (
					<div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<button
							onClick={() => setSelectedId(null)}
							className="inline-flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400 hover:text-rose-700 font-bold transition-all"
						>
							<div className="size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center">
								<ArrowLeft className="size-4" />
							</div>
							<span className="text-xs uppercase tracking-widest">
								Return
							</span>
						</button>
						<MeetingCard
							meeting={selectedRequest}
							isExpanded={true}
							isIncoming={viewMode === "incoming"}
							onAccept={(r) => handleAccept(r)}
							onReject={(r) => handleReject(r)}
							onReschedule={(r) => handleReschedule(r)}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default RequestsView;