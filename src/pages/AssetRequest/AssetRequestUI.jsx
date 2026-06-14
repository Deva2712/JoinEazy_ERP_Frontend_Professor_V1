// src/pages/AssetRequest/AssetRequestUI.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	RefreshCw,
	ClipboardList,
	ArrowLeft,
	History,
	AlertCircle,
	User,
	AlertTriangle,
} from "lucide-react";

import { useAssetRequest } from "./context/AssetRequestContext";
import { categorizeRequests } from "./utils/assetRequestUtils";

import RequestListView from "./views/RequestListView";
import AssetRequestModal from "./components/AssetRequestModal";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";

const AssetRequestUI = () => {
	const navigate = useNavigate();

	const {
		requests,
		admins,
		assets,
		cohorts,
		loading,
		error,
		isModalOpen,
		setIsModalOpen,
		onRefresh,
		onSubmit,
	} = useAssetRequest();

	// ── Local UI state ────────────────────────────────────────────────────────
	const [activeTab, setActiveTab] = useState("my-requests");
	const [editingData, setEditingData] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	// ── Derived data ─────────────────────────────────────────────────────────

	const { active, history } = useMemo(
		() => categorizeRequests(requests),
		[requests],
	);

	const displayRequests = activeTab === "my-requests" ? active : history;

	const pendingCount = requests.filter(
		(r) => r.status === "Pending" || r.status === "Resubmitted",
	).length;

	const actionRequiredCount = requests.filter(
		(r) => r.status === "Rejected" && !r.isArchived,
	).length;

	// ── Modal helpers ─────────────────────────────────────────────────────────

	const handleOpenModal = (data = null) => {
		setEditingData(data);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingData(null);
	};

	// ── Tabs config ───────────────────────────────────────────────────────────

	const tabs = [
		{ key: "my-requests", label: "My Requests", icon: ClipboardList },
		{ key: "history", label: "History", icon: History },
		{ key: "support", label: "Support", icon: User, mobileOnly: true },
	];

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			{/* Hero / Header */}
			<div className="bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-800 dark:from-teal-900 dark:via-teal-950 dark:to-emerald-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Asset Requests
								</h1>
								<p className="text-teal-50 text-sm mt-0.5">
									Manage your resource, equipment and
									accommodation bookings.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-2 md:pb-0">
							<StatSummaryCard
								label="Pending Requests"
								value={pendingCount.toString()}
								icon={ClipboardList}
							/>
							<StatSummaryCard
								label="Action Required"
								value={actionRequiredCount.toString()}
								icon={AlertCircle}
							/>
						</div>
					</div>

					{/* Tabs */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									onClick={() => setActiveTab(tab.key)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										tab.mobileOnly ? "lg:hidden" : ""
									} ${
										activeTab === tab.key
											? "bg-gray-50 dark:bg-[#0f1117] text-teal-700 dark:text-teal-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Main content */}
			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-teal-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Asset Requests
						</p>
						<p className="text-sm">
							Please wait while we fetch your requests...
						</p>
					</div>
				) : (
					<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						{/* Main panel */}
						<div
							className={`flex-grow ${activeTab === "support" ? "block lg:hidden" : "block"}`}
						>
							{activeTab === "support" ? (
								<AdminContactSidebar
									admins={admins}
									themeColor="teal"
									isTabbedView={true}
								/>
							) : (
								<RequestListView
									displayRequests={displayRequests}
									activeTab={activeTab}
									onOpenModal={handleOpenModal}
								/>
							)}
						</div>

						{/* Sidebar (desktop only) */}
						<div className="hidden lg:block">
							<AdminContactSidebar
								admins={admins}
								themeColor="teal"
							/>
						</div>
					</div>
				)}
			</main>

			{/* Modal */}
			{isModalOpen && (
				<AssetRequestModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					assets={assets}
					cohorts={cohorts}
					initialData={editingData}
					onSubmit={onSubmit}
				/>
			)}

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default AssetRequestUI;