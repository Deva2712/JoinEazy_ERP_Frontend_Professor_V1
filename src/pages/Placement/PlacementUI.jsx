// src/pages/Placement/PlacementUI.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, AlertTriangle, Briefcase } from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import PlacementBanner from "./components/Placementbanner";
import JobListingsTab  from "./tabs/JobListingsTab";
import ApplicationsTab from "./tabs/ApplicationsTab";
import ResumeTab       from "./tabs/ResumeTab";
import HistoryTab      from "./tabs/HistoryTab";

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
    <HeaderController />
    <div className="flex justify-center py-32">
      <RefreshCw className="size-10 animate-spin text-emerald-600" />
    </div>
    <BottomNavController /><FooterController />
  </div>
);

const ErrorScreen = ({ onRetry }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
    <HeaderController />
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <AlertTriangle className="size-10 text-red-600 mb-4" />
      <h2 className="text-xl font-bold dark:text-white mb-2">Failed to load</h2>
      <button onClick={onRetry} className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
        Try Again
      </button>
    </div>
    <BottomNavController /><FooterController />
  </div>
);

export default function PlacementUI({
  loading          = false,
  error            = null,
  onRetry          = () => {},
  jobs             = [],
  applications     = [],
  placementHistory = [],
  resumeUrl        = null,
  projectUrl       = null,
  onApply          = () => {},
  onUploadResume   = () => {},
  onUploadProject  = () => {},
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen onRetry={onRetry} />;

  const appliedIds = new Set(applications.map((a) => a.jobId));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
      <HeaderController />

      <PlacementBanner
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationsCount={applications.length}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
        {activeTab === "jobs" && (
          <JobListingsTab
            jobs={jobs}
            appliedIds={appliedIds}
            onApply={(job) => {
              onApply(job);
              navigate(`/placement/apply/${job.id}`, { state: { job } });
            }}
          />
        )}
        {activeTab === "applied"  && <ApplicationsTab applications={applications} />}
        {activeTab === "resume"   && <ResumeTab resumeUrl={resumeUrl} projectUrl={projectUrl} onUploadResume={onUploadResume} onUploadProject={onUploadProject} />}
        {activeTab === "history"  && <HistoryTab history={placementHistory} />}
      </main>

      <BottomNavController />
      <FooterController />
    </div>
  );
}