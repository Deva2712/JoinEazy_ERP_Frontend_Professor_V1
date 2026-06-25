// src/pages/LeaveApplication/LeaveApplicationUI.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, RefreshCw, ClipboardList,
  History, User, UserPlus, AlertTriangle, Users,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import LeaveRequestModal from "./components/LeaveRequestModal";
import LeaveContentSection from "./components/LeaveContentSection";

const TABS = [
  { key: "my-leaves",     label: "My Leaves",    icon: ClipboardList },
  { key: "substitutions", label: "Substitutions", icon: UserPlus },
  { key: "history",       label: "History",       icon: History },
  { key: "support",       label: "Support",       icon: User, mobileOnly: true },
];

const SUBSTITUTION_SUB_TABS = [
  { key: "my-substitutes", label: "Covering for Others", icon: Users   },
  { key: "substitutes",    label: "My Substitutes",       icon: UserPlus },
];

const LeaveApplicationUI = ({
  applications = [], substitutionRequests = [],
  admins = [], faculties = [], courses = [],
  loading, error, isModalOpen, setIsModalOpen,
  onRefresh, onSubmit, onRespondToSubstitution,
  activeTab, onTabChange,
}) => {
  const navigate = useNavigate();
  const [editingData, setEditingData] = useState(null);
  const [subTab, setSubTab] = useState("my-substitutes");

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);
  useEffect(() => { if (activeTab !== "substitutions") setSubTab("my-substitutes"); }, [activeTab]);

  const categorizedLeaves = applications.reduce(
    (acc, app) => {
      const isPast = new Date(app.toDate) < new Date();
      if ((app.status === "Rejected" && app.isArchived) || (app.status === "Approved" && isPast)) {
        acc.history.push(app);
      } else {
        acc.active.push(app);
      }
      return acc;
    },
    { active: [], history: [] },
  );

  const sortedActive = [...categorizedLeaves.active].sort((a, b) => {
    const aNeedsAction = a.status === "Rejected" && !a.isArchived;
    const bNeedsAction = b.status === "Rejected" && !b.isArchived;
    if (aNeedsAction !== bNeedsAction) return aNeedsAction ? -1 : 1;
    return new Date(b.appliedAt) - new Date(a.appliedAt);
  });

  // My Substitutes: incoming — someone asked me to cover (from substitutionRequests)
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const incomingSubstitutions = substitutionRequests.filter(
    // FIX: was `s.status` (the leave's overall status, which only becomes
    // "Rejected"/"Approved" once HoD+HR also act). The substitution-specific
    // accept/reject lives in `substitutionStatus`, so filter on that instead —
    // otherwise an accepted/rejected substitution request never leaves this list.
    (s) => s.substitutionStatus !== "Rejected" && new Date(s.toDate) >= today
  );

  // Substitutes: outgoing — my leave applications where I assigned someone
  // replacementFaculty = name, replacementFacultyId = ID, koi bhi ho toh dikhao
  const outgoingSubstitutions = applications.filter(
    (a) => !!(a.replacementFacultyId || a.replacementFacultyName || a.replacementFaculty)
  );

  const getDisplayContent = () => {
    if (activeTab === "substitutions") {
      return subTab === "my-substitutes" ? incomingSubstitutions : outgoingSubstitutions;
    }
    if (activeTab === "history") return categorizedLeaves.history;
    return sortedActive;
  };

  const handleOpenModal = (data = null) => { setEditingData(data); setIsModalOpen(true); };

  const statsData = [
    { label: "Pending Applications", value: String(applications.filter((a) => a.status === "Pending" || a.status === "Resubmitted").length), icon: ClipboardList },
    { label: "Substitution Requests", value: String(incomingSubstitutions.filter((s) => s.status === "Pending").length), icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
      <HeaderController />

      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 dark:from-orange-900 dark:via-orange-950 dark:to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Leave Applications</h1>
                <p className="text-white/80 text-sm mt-0.5">Manage leaves and substitution requests.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-2 md:pb-0">
              {statsData.map((s, i) => <StatSummaryCard key={i} {...s} />)}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(({ key, label, icon: Icon, mobileOnly }) => (
              <button key={key} onClick={() => onTabChange(key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${mobileOnly ? "lg:hidden" : ""} ${activeTab === key ? "bg-gray-50 dark:bg-gray-900 text-orange-600 dark:text-orange-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <AlertTriangle className="size-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
            <button onClick={onRefresh} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
              <RefreshCw className="size-4" /> Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="size-12 animate-spin mb-4 text-orange-600" />
            <p className="font-bold text-gray-900 dark:text-white">Loading Leave Data</p>
            <p className="text-sm">Please wait while we fetch your leave applications...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex-grow">
              {activeTab === "support" ? (
                <AdminContactSidebar admins={admins} themeColor="orange" isTabbedView={true} />
              ) : (
                <LeaveContentSection
                  activeTab={activeTab}
                  subTab={subTab}
                  onSubTabChange={setSubTab}
                  substitutionSubTabs={SUBSTITUTION_SUB_TABS}
                  displayRequests={getDisplayContent()}
                  loading={loading}
                  onRefresh={onRefresh}
                  onOpenModal={handleOpenModal}
                  onEdit={handleOpenModal}
                  onRespondToSubstitution={onRespondToSubstitution}
                />
              )}
            </div>
            <div className="hidden lg:block">
              <AdminContactSidebar admins={admins} themeColor="orange" />
            </div>
          </div>
        )}
      </main>

      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingData}
        faculties={faculties}
        courses={courses}
        onSubmit={onSubmit}
      />

      <BottomNavController />
      <FooterController />
    </div>
  );
};

export default LeaveApplicationUI;