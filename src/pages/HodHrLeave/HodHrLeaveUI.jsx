// src/pages/HodHrLeave/HodHrLeaveUI.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, ClipboardList, CheckCircle2,
  XCircle, Clock, AlertTriangle, Users, LayoutDashboard,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import LeaveApprovalCard from "./components/LeaveApprovalCard";

const TABS = [
  { key: "pending",   label: "Pending",  icon: Clock },
  { key: "approved",  label: "Approved", icon: CheckCircle2 },
  { key: "rejected",  label: "Rejected", icon: XCircle },
  { key: "all",       label: "All",      icon: LayoutDashboard },
];

const HodHrLeaveUI = ({
  applications = [],
  loading,
  error,
  role,           // "HoD" | "HR"
  activeTab,
  onTabChange,
  onRefresh,
  onApprove,
  onReject,
}) => {
  const navigate = useNavigate();
  const roleLabel = role === "HoD" ? "Head of Department" : "Human Resources";
  const themeFrom = role === "HoD" ? "from-teal-600 via-teal-700 to-cyan-700" : "from-violet-600 via-violet-700 to-purple-700";
  const themeDark = role === "HoD" ? "dark:from-teal-900 dark:via-teal-950 dark:to-cyan-950" : "dark:from-violet-900 dark:via-violet-950 dark:to-purple-950";
  const accentColor = role === "HoD" ? "teal" : "violet";

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

  // Filter apps based on this role's decision status
  const filterByTab = (apps) => {
    if (activeTab === "all") return apps;
    const statusMap = {
      pending:  (a) => a.leaveApproval?.[role]?.status === "Pending",
      approved: (a) => a.leaveApproval?.[role]?.status === "Approved",
      rejected: (a) => a.leaveApproval?.[role]?.status === "Rejected",
    };
    return apps.filter(statusMap[activeTab] || (() => true));
  };

  const displayed = filterByTab(applications);

  const pendingCount  = applications.filter((a) => a.leaveApproval?.[role]?.status === "Pending").length;
  const approvedCount = applications.filter((a) => a.leaveApproval?.[role]?.status === "Approved").length;
  const rejectedCount = applications.filter((a) => a.leaveApproval?.[role]?.status === "Rejected").length;

  const statsData = [
    { label: "Pending Review", value: String(pendingCount),  icon: Clock },
    { label: "Approved",       value: String(approvedCount), icon: CheckCircle2 },
    { label: "Rejected",       value: String(rejectedCount), icon: XCircle },
  ];

  const tabCounts = { pending: pendingCount, approved: approvedCount, rejected: rejectedCount, all: applications.length };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
      <HeaderController />

      {/* Hero Banner */}
      <div className={`bg-gradient-to-br ${themeFrom} ${themeDark} text-white`}>
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
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-black uppercase tracking-widest text-white/60 px-2 py-0.5 bg-white/10 rounded-full">
                    {role} Dashboard
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Leave Approvals</h1>
                <p className="text-white/70 text-sm mt-0.5">{roleLabel} — Review and manage faculty leave applications.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-2 md:pb-0">
              {statsData.map((s, i) => (
                <StatSummaryCard key={i} {...s} />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                  activeTab === key
                    ? "bg-gray-50 dark:bg-gray-900 text-teal-600 dark:text-teal-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
                {tabCounts[key] > 0 && (
                  <span className={`ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeTab === key
                      ? `bg-${accentColor}-100 text-${accentColor}-700`
                      : "bg-white/20 text-white"
                  }`}>
                    {tabCounts[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <AlertTriangle className="size-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
            >
              <RefreshCw className="size-4" /> Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="size-12 animate-spin mb-4 text-teal-600" />
            <p className="font-bold text-gray-900 dark:text-white">Loading Applications</p>
            <p className="text-sm">Fetching leave requests...</p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight capitalize flex items-center gap-2">
                <ClipboardList className="size-5 text-teal-500" />
                {activeTab === "all" ? "All Applications" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Applications`}
                <span className="text-sm font-normal text-gray-400">({displayed.length})</span>
              </h3>
              <button
                onClick={onRefresh}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {displayed.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <Users className="size-14 text-gray-200 dark:text-gray-700 mb-4" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">No applications</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {activeTab === "pending"
                    ? "All applications have been reviewed."
                    : "No applications in this category."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {displayed.map((app) => (
                  <LeaveApprovalCard
                    key={app.id}
                    app={app}
                    role={role}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavController />
      <FooterController />
    </div>
  );
};

export default HodHrLeaveUI;