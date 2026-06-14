// export default MaintenanceUI;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, ArrowLeft, History, AlertCircle, School, Home, User, ClipboardList } from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import MaintenanceRequestModal from "./components/MaintenanceRequestModal";
import MaintenanceRequestCard from "./components/MaintenanceRequestCard";
import { useMaintenanceUI } from "./utility/Usemaintenanceui";

const TABS = [
	{ key: "university", label: "University", icon: School },
	{ key: "accommodation", label: "Accommodation", icon: Home },
	{ key: "history", label: "History", icon: History },
	{ key: "support", label: "Support", icon: User, mobileOnly: true },
];

const STAT_ICONS = { "Pending Requests": ClipboardList, "Action Required": AlertCircle };

const MaintenanceUI = ({
	requests = [], technicians = [], admins = [], issueTypes = [],
	loading = false, error = null, activeTab, onTabChange, onSubmitRequest, onRefresh,
}) => {
	const navigate = useNavigate();
	const {
		historyCategory, setHistoryCategory, showRequestForm, formData, setFormData,
		defaultForm, displayRequests, statsData, getTechnicianInfo,
		openRequestForm, closeRequestForm, handleFormSubmit,
	} = useMaintenanceUI({ requests, technicians, activeTab });

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			{/* Hero & Tabs */}
			<div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-600 dark:from-yellow-900 dark:via-amber-900 dark:to-orange-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
								<p className="text-yellow-50 text-sm mt-0.5">Submit and track repair requests for university facilities and accommodation.</p>
							</div>
						</div>
						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, i) => (
								<StatSummaryCard key={i} {...stat} icon={STAT_ICONS[stat.label]} />
							))}
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{TABS.map(({ key, label, icon: Icon, mobileOnly }) => (
							<button key={key} onClick={() => onTabChange(key)}
								className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${mobileOnly ? "lg:hidden" : ""} ${activeTab === key ? "bg-gray-50 dark:bg-[#0f1117] text-yellow-600 dark:text-yellow-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
								<Icon className="w-4 h-4" /> {label}
							</button>
						))}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 pb-24">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertCircle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-yellow-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Maintenance Data</p>
						<p className="text-sm">Please wait while we fetch your requests...</p>
					</div>
				) : (
					<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div className={`flex-grow ${activeTab === "support" ? "block lg:hidden" : "block"}`}>
							{activeTab === "support" ? (
								<AdminContactSidebar admins={admins} themeColor="yellow" isTabbedView={true} />
							) : (
								<>
									{/* List Header */}
									<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
										<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
											{activeTab === "history" ? "Requests History" : `${activeTab} Requests`}
										</h3>
										<div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
											{activeTab === "history" && (
												<div className="flex w-full md:w-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
													{["university", "accommodation"].map((cat) => (
														<button key={cat} onClick={() => setHistoryCategory(cat)}
															className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${historyCategory === cat ? "bg-yellow-500 text-white shadow-md" : "text-gray-500 hover:text-yellow-500"}`}>
															{cat === "university" ? <School className="size-4" /> : <Home className="size-4" />}
															<span className="capitalize">{cat}</span>
														</button>
													))}
												</div>
											)}
											{activeTab !== "history" && (
												<button onClick={openRequestForm}
													className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95">
													<Plus className="size-4" /> New Request
												</button>
											)}
										</div>
									</div>

									{/* Cards */}
									<div className="space-y-4">
										{displayRequests.length > 0 ? (
											displayRequests.map((req) => (
												<MaintenanceRequestCard key={req.id} request={req} technician={getTechnicianInfo(req.assignedTechnicianId)} />
											))
										) : (
											<div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">
												No {activeTab === "history" ? "history" : "active"} requests found for this category.
											</div>
										)}
									</div>
								</>
							)}
						</div>

						<div className="hidden lg:block w-80">
							<AdminContactSidebar themeColor="yellow" admins={admins} />
						</div>
					</div>
				)}
			</main>

			<MaintenanceRequestModal
				isOpen={showRequestForm}
				onClose={closeRequestForm}
				formData={formData}
				setFormData={setFormData}
				defaultForm={defaultForm}
				onSubmit={(e) => handleFormSubmit(e, onSubmitRequest)}
				issueTypes={issueTypes}
			/>
			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default MaintenanceUI;